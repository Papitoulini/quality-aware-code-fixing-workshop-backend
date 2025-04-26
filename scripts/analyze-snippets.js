/* eslint-disable security/detect-non-literal-fs-filename */
import "dotenv/config.js";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { analyzeFile } from "#utils";
import { models, init } from "#dbs";

const { Snippet, FileAnalysis } = models;

// Resolve __dirname and define output folder path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFolderPath = path.join(__dirname, '..', 'assets', 'snippets');

// Ensure the base output directory exists
try {
  fs.mkdirSync(outputFolderPath, { recursive: true });
} catch (err) {
  console.error('Failed to create output directory:', err);
  process.exit(1);
}

// Main CLI routine
async function main() {
  const db = await init();

  try {
    const analyses = await FileAnalysis.find();
    const alreadyAnalyzedSnippetsIds = analyses.map((a) => {
      return a.snippet
    });
    const snippets = await Snippet.find({ original: false, _id: { $nin: alreadyAnalyzedSnippetsIds } });

    if (!snippets.length) {
      console.info('No snippets to analyze.');
      await db.disconnect();
      return;
    }

    for (const snippet of snippets) {
      try {

      const id = snippet._id.toString();
      const snippetDir = path.join(outputFolderPath, id);

      // Create directory for this snippet
      await fs.promises.mkdir(snippetDir, { recursive: true });

      const filename = 'snippet.js';
      const filePath = path.join(snippetDir, filename);

      // Write the snippet code to a file
      await fs.promises.writeFile(filePath, snippet.code, 'utf8');

      // Run the analysis tool
      const results = await analyzeFile(snippetDir, filename);
      console.log(`Results for snippet ${id}:`, results.sast.success);

      if (results.sast.success) {
        await FileAnalysis.create({
          snippet: snippet._id,
          analysis: results?.sast?.sast,
        });
      }
    } catch {}

    }
  } catch (err) {
    console.error('Error during analysis:', err);
  } finally {
    await db.disconnect();
    console.info('All analyses completed.');
  }
}

// Execute when invoked as a script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
  });
}
