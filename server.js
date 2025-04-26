import "dotenv/config.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import morgan from "morgan";
import compression from "compression";
import favicon from "serve-favicon";
import cors from "cors";
import chalk from "chalk";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import Sentry from "@sentry/node";

import routes from "./src/routes/index.js";

import { MAX_FILE_SIZE_ALLOWED_IN_MB } from "#utils";
import { init } from "#dbs";
import { setServerTimeout, captureErrors } from "#middleware";

const { NODE_ENV, PORT } = process.env;

init();

const app = express();

app.use(helmet());
app.use(setServerTimeout(2 * 60 * 1000));
if (NODE_ENV === "development") app.use(morgan("dev", { skip: (req) => req.method === "OPTIONS" }));
app.use(cookieParser());
const corsOptions = {
	origin: true,
	credentials: true,
  };
app.use(cors(corsOptions));
app.use((req, res, next) => { // eslint-disable-line consistent-return
	const noCompressionPaths = ["/file/recommendations"];
	if (noCompressionPaths.some((p) => req.path.endsWith(p))) {
		return next();
	}

	compression()(req, res, next);
});
app.use(express.json({ limit: "10mb" }));
app.use((req, _, next) => { req.body ||= {}; next(); });
app.use(express.urlencoded({ extended: true, limit: `${MAX_FILE_SIZE_ALLOWED_IN_MB + 1}mb` }));
app.use(favicon(path.join(path.dirname(fileURLToPath(import.meta.url)), "src", "assets", "images", "favicon.ico")));
app.use("/api/", routes);
app.all("/", (_, res) => res.json({ body: "It works! ✅" }));

app.use(Sentry.Handlers.errorHandler());

app.use(captureErrors);

const port = PORT || 3000;
app.listen(port, () => NODE_ENV !== "test" && console.log(chalk.bold.cyan(`>>> Live at http://localhost:${port} (node ${process.versions.node})`)));
export default app;
