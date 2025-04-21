import jwt from "jsonwebtoken";
import Sentry from "@sentry/node";
import rateLimit from "express-rate-limit";
import { Types } from "mongoose";

import { DISABLED_KEY_VERSIONS } from "#utils";
import { models } from "#dbs";

const { User, Project, Repository } = models;

export const setServerTimeout = (millis = 5 * 60 * 1000) => (req, res, next) => {
	req.setTimeout(millis, () => res.status(408).json({ message: "Request Timeout" }));
	res.setTimeout(millis, () => res.status(503).json({ message: "Service Unavailable" }));
	next();
};

export const attachUser = async (req, res, next) => {
	const {
		JWT_SECRET_KEY,
	} = process.env;

	try {
		const token = req.cookies._cyclopt || req.body.token || req.query.token || req.headers["x-access-token"];
		if (token) {
			const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
			console.log(`Decoded token: ${JSON.stringify(decodedToken)}`);
			const user = await User.findById(decodedToken.id).exec();
			if (user) {
				if (!decodedToken?.customToken) {
					user.lastActiveAt = new Date();
					await user.save();
				}

				res.locals.user = { ...user.toObject(), jwt: token, type: decodedToken.type };
				return next();
			}

			return res.status(404).json({ message: "User not found." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch (error) {
		if (!(error instanceof jwt.TokenExpiredError)) Sentry.captureException(error);
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

export const attachCycloptUser = async (req, res, next) => {
	const {
		JWT_SECRET_KEY_FOR_OPENAPI,
	} = process.env;

	try {
		const token = req.body.token || req.query.token || req.headers["x-access-cyclopt-token"];
		if (token) {
			const decodedToken = jwt.verify(token, JWT_SECRET_KEY_FOR_OPENAPI);
			const user = await User.findById(decodedToken.id).exec();
			if (user) {
				user.lastCallAt = new Date();
				await user.save();
				res.locals.user = { ...user.toObject(), jwt: token, type: decodedToken.type, email: decodedToken.email };
				return next();
			}

			return res.status(404).json({ message: "User not found" });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch (error) {
		if (!(error instanceof jwt.TokenExpiredError)) Sentry.captureException(error);
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

export const attachCycloptPagination = (req, res, next) => {
	const {	page: unParsedPage = 1, limit: unParsedLimit = 10 } = req.query;
	try {
		const page = Number.parseInt(unParsedPage, 10);
		const userLimit = Number.parseInt(unParsedLimit, 10);

		if (Number.isNaN(page) || page < 1) return res.status(400).json({ error: "Invalid page number, must be 1 or greater." });
		if (Number.isNaN(userLimit) || userLimit < 1) return res.status(400).json({ error: "Invalid limit, must be between 1 and 100." });

		const limit = Math.min(userLimit, 100);
		const skip = (page - 1) * limit;

		res.locals.pagination = { limit, skip, page };

		return next();
	} catch (error) {
		if (!(error instanceof jwt.TokenExpiredError)) Sentry.captureException(error);
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

export const attachCycloptRepositories = async (req, res, next) => {
	const { user: { _id: userId } } = res.locals;
	try {
		const ownedRepos = await Repository.find({
			addedBy: new Types.ObjectId(userId),
			isActive: true,
		}).select("root language addedBy isActive").lean().exec();

		const projects = await Project.find({ "team.user": new Types.ObjectId(userId) })
			.populate({
				path: "linkedRepositories",
				match: { isActive: true },
				select: "_id",
			}).lean().exec();

		const teamProjectRepoIds = projects.flatMap((p) => p.linkedRepositories.map((r) => r._id));
		const ownedRepoIDs = ownedRepos.map((r) => r._id);

		const idMap = new Map();
		for (const id of [...teamProjectRepoIds, ...ownedRepoIDs]) idMap.set(id.toString(), id);

		const linkedRepositoriesIds = [...idMap.values()];

		if (linkedRepositoriesIds.length === 0) return res.status(401).json({ error: "NoRepositoriesForThisToken" });

		res.locals.linkedRepositoriesIds = linkedRepositoriesIds;
		res.locals.projects = projects;

		return next();
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ error: "Something went wrong." });
	}
};

export const attachProject = (application = "panorama") => async (req, res, next) => {
	try {
		const { user } = res.locals;
		const project = await Project.findOne({
			...(req.params.PROJECT_ID ? { _id: req.params.PROJECT_ID } : {}),
			"team.user": user._id,
			isCompanion: application === "companion",
		})
			.lean({ defaults: true })
			.populate("team.user", "username avatar")
			.populate("linkedRepositories", "owner name providerId root")
			.exec();
		if (!project) return res.status(404).json({ message: "Project not found." });
		res.locals.project = project;
		return next();
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

export const attachRepository = async (req, res, next) => {
	try {
		const { user } = res.locals;
		const project = await Project.findOne({ _id: req.params.PROJECT_ID, "team.user": user._id })
			.lean({ defaults: true })
			.populate({
				path: "linkedRepositories",
				populate: { path: "addedBy" },
				select: "owner name root branches providerId language csProjects vcType addedBy  isPrivate  productionBranch ",
			})
			.exec();
		if (!project) return res.status(404).json({ message: "Project not found." });
		const repository = project.linkedRepositories.find((e) => e._id.equals(req.params.REPOSITORY_ID));
		if (!repository) return res.status(400).json({ message: "Repository not in project." });
		res.locals.repository = repository;
		return next();
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

export const attachCompanionRepositories = async (req, res, next) => {
	try {
		const { user } = res.locals;
		const { OWNER: owner, NAME: name } = req.params;
		const { root, language, csProjects, productionBranch } = req.query;

		const projects = await Project.find({ "team.user": user._id, isCompanion: true })
			.lean({ defaults: true })
			.populate({
				path: "linkedRepositories",
				match: {
					...(root ? { root } : {}),
					...(language ? { language } : {}),
					...((root && root.endsWith(".sln") && csProjects.length > 0)
						? { csProjects: { $all: csProjects.map((cs) => cs.replaceAll("\\", "/")) } }
						: {}),
					owner,
					name,
					isActive: true,
				},
				// This populate is for the "addedBy" field inside linkedRepositories
				populate: { path: "addedBy" },
				select: "_id owner name vcType productionBranch root language csProjects",
			})
			.exec();

		if (projects.length === 0) return res.status(404).json({ message: "Project not found." });
		if (!projects.some((p) => p.linkedRepositories.length)) return res.status(404).json({ message: "Repository not found." });
		res.locals.repository = {
			ids: projects.flatMap((p) => p.linkedRepositories.map((r) => new Types.ObjectId(r._id))),
			name,
			owner,
			productionBranch,
			branches: projects.flatMap((p) => p.linkedRepositories.map((r) => r.productionBranch)),
			addedBy: user, // this is for consistency with other middlewares
			// we should not fetch repository files info from gitProviders with added by tokens!
		};
		res.locals.projects = projects;
		return next();
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Something went wrong." });
	}
};

export const attachIntegration = async (req, res, next) => {
	const {
		JWT_SECRET_KEY_FOR_INTEGRATIONS,
	} = process.env;
	try {
		const token = req.cookies.token || req.body.token || req.query.token || req.headers["x-access-token"];
		if (token) {
			const { projectId, name, keyVersion } = jwt.verify(token, JWT_SECRET_KEY_FOR_INTEGRATIONS);

			const project = await Project
				.findById(projectId)
				.populate("integrations.useReq.integration")
				.populate("integrations.azureTasks.integration")
				.populate("integrations.msTeams.integration")
				.populate("integrations.azurePullRequests.integration")
				.populate("integrations.githubTasks.integration")
				.exec();
			if (!project) return res.status(404).json({ message: "Project not found." });

			const integration = Object.values(project.integrations).find((int) => int?.integration?.name === name)?.integration;
			if (!integration) return res.status(404).json({ message: `Integration \`${name}\` not found on this project.` });
			if (DISABLED_KEY_VERSIONS.includes(keyVersion)) return res.status(403).json({ message: "This token is disabled." });

			const user = await User.findOne({ username: `${name}-bot` }).lean().exec();

			res.locals.integration = {
				project,
				user,
			};
			return next();
		}

		return res.status(401).json({ message: "No token provided." });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(401).json({ message: "Failed to authenticate integration." });
	}
};

export const attachAdmin = (_req, res, next) => {
	const { user } = res.locals;

	return user?.roles?.includes("admin")
		? next()
		: res.status(401).json({ message: "Failed to authenticate user." });
};

export const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour)
	message: "Oh no, you have exceeded your rate limit! It will reset in 1 hour.",
	statusCode: 429,
	headers: true,
	keyGenerator: (req, res) => {
		const { user } = res.locals;
		return user?._id || req.ip;
	},
});

export const attachAdminUser = (req, res, next) => {
	const {
		ADMIN_API_USERNAME,
		ADMIN_API_PASSWORD,
	} = process.env;
	try {
		const { authorization } = req.headers;
		if (authorization) {
			const [username, password] = Buffer.from(authorization.split(" ")[1], "base64").toString().split(":");
			return username === ADMIN_API_USERNAME && password === ADMIN_API_PASSWORD ? next() : res.status(401).json({ message: "Failed to authenticate user." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch {
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

export const attachJarvis = (req, res, next) => {
	const { JARVIS_USERNAME, JARVIS_PASSWORD } = process.env;

	const { authorization } = req.headers;
	if (authorization) {
		if (authorization === `Basic ${Buffer.from(`${JARVIS_USERNAME}:${JARVIS_PASSWORD}`).toString("base64")}`) return next();
		return res.status(401).json({ message: "Failed to authenticate user." });
	}

	return res.status(401).json({ message: "No Authorization provided." });
};

// Do not remove unused parameters.
// Express requires a four-parameter signature to recognize this function as an error handler
export const captureErrors = (err, req, res, next) => {
	console.log(err?.response?.errors || err);
	Sentry.captureException(err);
	if (res.headersSent) {
		return next(err);
	}

	return res.status(500).json({ message: "Something went wrong." });
};

export const attachHackathonUser = (req, res, next) => {
	const {
		HACKATHON_API_USERNAME,
		HACKATHON_API_PASSWORD,
	} = process.env;
	try {
		const authorizationHeader = req?.headers?.["x-access-token"];
		if (authorizationHeader) {
			const [username, password] = Buffer.from(authorizationHeader, "base64").toString().split(":");
			return (username === HACKATHON_API_USERNAME && password === HACKATHON_API_PASSWORD) ? next() : res.status(401).json({ message: "Failed to authenticate user." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch {
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};

export const attachTddUser = (req, res, next) => {
	const {
		TDD_API_USERNAME,
		TDD_API_PASSWORD,
	} = process.env;
	try {
		const authorizationHeader = req?.headers?.["x-access-token"];
		if (authorizationHeader) {
			const [username, password] = Buffer.from(authorizationHeader, "base64").toString().split(":");
			return (username === TDD_API_USERNAME && password === TDD_API_PASSWORD) ? next() : res.status(401).json({ message: "Failed to authenticate user." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch {
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
};
