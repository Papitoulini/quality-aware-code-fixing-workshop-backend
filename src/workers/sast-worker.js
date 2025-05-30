import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import amqp from "amqplib";
import Sentry from "@sentry/node";

import { analyzeFile } from "../utils/index.js";
import { models, init as connect } from "../dbs.js";

const { UserResponse } = models;

const { CLOUDAMQP_URL } = process.env;

// Initialize DB connection
await connect();
console.log("✅ Connected to database");

// Configure worker
const QUEUE_NAME = 'analysis_queue';
const WORKER_ID = `worker-${os.hostname()}-${process.pid}`;

async function processJob(jobData) {
  const { userResponseId, code, userId, questionId } = jobData;
  console.log(`🔍 [${WORKER_ID}] Processing analysis for userResponse: ${userResponseId}`);
  
  try {
    // Create temporary directory for analysis
    const fileName = `analysis-${userId}-${questionId}.js`;
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-analysis-'));
    const tempFile = path.join(tempDir, fileName);
    
    // Write code to temp file
    await fs.writeFile(tempFile, code, 'utf8');

    // Run analysis
    console.log(`⚙️ [${WORKER_ID}] Running analysis on file: ${tempFile}`);
    const analysisResults = await analyzeFile(tempDir, fileName);
    
    // Update database with results
    await UserResponse.findByIdAndUpdate(userResponseId, {
      analysis: analysisResults?.sast?.sast || [],
      status: "completed"
    });
    
    console.log(`✅ [${WORKER_ID}] Analysis completed for userResponse: ${userResponseId}`);
    
    // Clean up temporary files
    await fs.rm(tempDir, { recursive: true, force: true });
    
  } catch (error) {
    console.error(`❌ [${WORKER_ID}] Analysis failed:`, error);
    Sentry.captureException(error);
    
    // Mark job as failed in database
    try {
      await UserResponse.findByIdAndUpdate(userResponseId, {
        status: "failed"
      });
    } catch (dbError) {
      console.error(`❌ [${WORKER_ID}] Failed to update status:`, dbError);
      Sentry.captureException(dbError);
    }
  }
}

async function startWorker() {
  let connection;
  let channel;
  
  try {
    // Connect to RabbitMQ
    console.log(`🔄 [${WORKER_ID}] Connecting to RabbitMQ...`);
    connection = await amqp.connect(CLOUDAMQP_URL);
    channel = await connection.createChannel();
    
    // Configure queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Only take one job at a time
    channel.prefetch(1);
    
    console.log(`✅ [${WORKER_ID}] Connected to queue: ${QUEUE_NAME}`);
    
    // Consume messages
    await channel.consume(QUEUE_NAME, async (msg) => {
    //   if (!msg) return;
      
      try {
        const jobData = JSON.parse(msg.content.toString());
        await processJob(jobData);
        
        // Acknowledge successful processing
        channel.ack(msg);
      } catch (error) {
        console.error(`❌ [${WORKER_ID}] Error processing message:`, error);
        Sentry.captureException(error);
        
        // Reject the message and requeue it
        // Consider using a dead-letter exchange for failed messages
        channel.nack(msg, false, true);
      }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (error) {
    console.error(`❌ [${WORKER_ID}] Worker startup failed:`, error);
    Sentry.captureException(error);
    await cleanup();
    process.exit(1);
  }
  
  async function cleanup() {
    console.log(`🛑 [${WORKER_ID}] Shutting down worker...`);
    if (channel) await channel.close();
    if (connection) await connection.close();
    process.exit(0);
  }
}

// Start the worker
await startWorker().catch(err => {
  console.error('Fatal error:', err);
  Sentry.captureException(err);
  process.exit(1);
});