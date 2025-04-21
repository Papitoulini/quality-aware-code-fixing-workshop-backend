/* eslint-disable security/detect-object-injection */
import express from "express";
import Sentry from "@sentry/node";
import got from "got";
import constructUrl from "@iamnapo/construct-url";
import { decrypt, encrypt } from "@iamnapo/enigma";

import { encryptionKey } from "#utils";

const router = express.Router({ mergeParams: true });

const specifyGitType = (type) => (type.includes("gitlab") || type.includes("azure") || type.includes("tfs")
	? type.split("-")[0]
	: type);

const queriesData = () => {
	const {
		GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET,
	} = process.env;
	return {
		github: {
			base: () => "https://github.com",
			uri: "/login/oauth/authorize",
			query: (state) => ({ client_id: GITHUB_CLIENT_ID, state }),
			callback: (code, state) => got.post("https://github.com/login/oauth/access_token", {
				http2: true,
				headers: {
					"User-Agent": "Cyclopt Platform",
				},
				json: {
					client_id: GITHUB_CLIENT_ID,
					client_secret: GITHUB_CLIENT_SECRET,
					code,
					state,
				},
				responseType: "json",
			}),
		},
	};
};

router.get("/login/", (req, res) => {
	const { type = "github", redirectTo } = req.query;
	const state = encrypt(JSON.stringify({
		type,
		origin: redirectTo || req.get("origin"),
	}), { encryptionKey, encoding: "base64url" });

	console.log(type, redirectTo)

	const specificGitType = specifyGitType(type);

	const { base, uri, query } = queriesData()[specificGitType];
	const url = constructUrl(base(type), uri, query(state, type));
	return res.redirect(url);
});

router.get("/callback/", async (req, res) => {
	const {
		OWN_URL,
		CLIENT_URL,
	} = process.env;
	const { code, state, setup_action: setupAction } = req.query;
	let type = "bitbucket";
	let origin = CLIENT_URL;
	try {
		({ type, origin } = JSON.parse(decrypt(state, { encryptionKey, encoding: "base64url" })));
	} catch { /** empty */ }

	const fallBackUrl = constructUrl(origin, "", { error: "`code` query param required!" });
	if (!code) return res.redirect(fallBackUrl);
	if (setupAction === "install") return res.redirect(origin);
	try {
		const specificGitType = specifyGitType(type);

		const { body, statusCode } = await queriesData()[specificGitType].callback(code, state, type);
		const fallBackErrorUrl = constructUrl(origin, "", { error: `${specificGitType} server error!` });
		if (statusCode !== 200) return res.redirect(fallBackErrorUrl);
		const queries = {
			accessToken: body.access_token,
			...(body.refresh_token ? { refreshToken: body.refresh_token } : {}),
			type,
			origin,
		};
		return res.redirect(constructUrl(OWN_URL, "api/auth", queries));
	} catch (error) {
		Sentry.captureException(error);
		return res.redirect(constructUrl(origin, "", { error: `${type} might be down or something!` }));
	}
});

export default router;
