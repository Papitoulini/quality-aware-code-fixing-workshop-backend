import "dotenv/config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import compression from "compression";
import favicon from "serve-favicon";
import cors from "cors";
import chalk from "chalk";
import helmet from "helmet";
import * as Sentry from "@sentry/node";

import routes from "./src/routes/index.js";

import { init } from "#dbs";
import { setServerTimeout, captureErrors } from "#middleware";

const { NODE_ENV, PORT } = process.env;

Sentry.init({ enabled: NODE_ENV === "production" });

await init();

const app = express();

app.use(helmet());
app.use(setServerTimeout(2 * 60 * 1000));
app.use(cors({ credentials: true, origin: true }));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use((req, _, next) => { req.body ||= {}; next(); });
app.use(favicon(path.join(path.dirname(fileURLToPath(import.meta.url)), "src", "assets", "images", "favicon.ico")));

app.use("/api/", routes);
app.all("/", (_, res) => res.json({ body: "It works! ✅" }));

app.use(Sentry.expressErrorHandler());

app.use(captureErrors);

const port = PORT || 6666;
app.listen(port, () => NODE_ENV !== "test" && console.log(chalk.bold.cyan(`>>> Live at http://localhost:${port} (node ${process.versions.node})`)));
