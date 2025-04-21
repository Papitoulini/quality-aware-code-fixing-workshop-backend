
import { execSync } from "node:child_process";

import Sentry from "@sentry/node";
import jwt from "jsonwebtoken";
import express from "express";
import constructUrl from "@iamnapo/construct-url";

import oauthRoutes from "./oauth.js";

import { Github } from "#utils";
import { models } from "#dbs";

const router = express.Router({ mergeParams: true });

const { User  } = models;

router.get("/", (req, res) => {
	try {
		return res.json({ message: "Λειτουργεί!" });
	} catch (error) {
		Sentry.captureException(error);
		return res.status(500).json({ message: "Κάτι πήγε στραβά" });
	}
});

router.get("/version", (req, res) => {
	const commitHash = execSync("git rev-parse --short HEAD").toString();
	return res.json(commitHash.split("\n")[0]);
});

router.get("/refresh/", async (req, res) => {
	const { JWT_SECRET_KEY, JWT_SECRET_KEY_FOR_REFRESH } = process.env;

	try {
		const token = req.cookies._cyclopt || req.body.token || req.query.token || req.headers["x-access-token"];
		const rToken = req.cookies._cyclopt_r || req.body.refresh_token || req.query.refresh_token || req.headers["x-refresh-token"];
		if (token && rToken) {
			try {
				jwt.verify(token, JWT_SECRET_KEY);
			} catch (error) {
				if (error.message.includes("signature")) return res.status(401).json({ message: "Failed to authenticate user." });
			}

			const { id, email, username, type } = jwt.verify(rToken, JWT_SECRET_KEY_FOR_REFRESH);
			const user = await User.findOne({ _id: id, refreshTokens: rToken }).exec();
			if (user) {
				const jwtToken = jwt.sign({ id, email, username, type }, JWT_SECRET_KEY, { expiresIn: "30min" });
				return res.json({ token: jwtToken });
			}

			return res.status(404).json({ message: "User not found." });
		}

		return res.status(401).json({ message: "No token provided." });
	} catch (error) {
		if (!(error instanceof jwt.TokenExpiredError)) Sentry.captureException(error);
		return res.status(401).json({ message: "Failed to authenticate user." });
	}
});

router.all("/auth/", async (req, res) => {
	const { JWT_SECRET_KEY, JWT_SECRET_KEY_FOR_REFRESH, CLIENT_URL } = process.env;

	const { type = "github", accessToken, origin = CLIENT_URL } = req.query;

	if (type === "github") {
		const { rest, graphql } = Github(accessToken);
		try {
			const { viewer: { login, id, avatarUrl } } = await graphql("{ viewer { login id avatarUrl } }");
			const emails = await rest("GET /user/emails");
			const { email } = emails.find((e) => !e.email.includes("users.noreply.github.com")) || emails[0];
			const maybeExistingUser = await User.findOne({ "github.id": id }).lean().exec();
			const { value: user } = await User.findOneAndUpdate({ "github.id": id }, {
				...(maybeExistingUser?.keepCurrentToken ? {} : { "github.token": accessToken }),
				avatar: avatarUrl || "https://storage.googleapis.com/cyclopt-user-content/113286556.png",
				"github.id": id,
				email,
				username: login,
				lastActiveAt: new Date(),
			}, { new: true, upsert: true, includeResultMetadata: true }).exec();

			console.log("User", user);

			const jwtToken = jwt.sign(
				{ id: user.id, email: user.email, username: user.username, type },
				JWT_SECRET_KEY,
				{ expiresIn: "30min" },
			);
			const refreshToken = jwt.sign(
				{ id: user.id, email: user.email, username: user.username, type },
				JWT_SECRET_KEY_FOR_REFRESH,
				{ expiresIn: "1day" },
			);
			user.refreshTokens = [...user.refreshTokens.filter((t) => {
				try {
					jwt.verify(t, JWT_SECRET_KEY_FOR_REFRESH);
					return true;
				} catch {
					return false;
				}
			}), refreshToken];
			user.markModified("refreshTokens");

			await user.save();
			return res.redirect(constructUrl(origin, "auth", { token: jwtToken, rToken: refreshToken }));
		} catch (error) {
			Sentry.captureException(error);
			return res.redirect(constructUrl(origin, "auth"));
		}
	}

	return res.redirect(constructUrl(origin, "auth"));
});

router.use("/oauth/", oauthRoutes);

export default router;
