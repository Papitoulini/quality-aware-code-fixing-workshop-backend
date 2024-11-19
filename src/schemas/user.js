import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		email: { type: String, required: true },
		cyclopt: {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
		},
		github: {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
		},
		gitlab: {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-draxis": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-byte": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-cyclopt": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-liknoss": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-ots": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-sleed": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-appart": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-collectives": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-ime": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"gitlab-ubitech": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		bitbucket: {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		azure: {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"azure-interworks": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		"tfs-prosvasis": {
			_id: false,
			id: { type: String, default: "" },
			token: { type: String, default: "" },
			refreshToken: { type: String, default: "" },
		},
		avatar: { type: String, default: "https://storage.googleapis.com/cyclopt-user-content/113286556.png" },
		username: { type: String, required: true },
		lastActiveAt: { type: Date, default: () => new Date() },
		hiddenProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
		lastCallAt: { type: Date, default: () => new Date() },
		apiKey: { type: String, default: "" },
		kanbanTheme: { type: String, default: "Default" },
		notifications: {
			_id: false,
			projectParticipation: { type: Boolean, default: true },
			taskAssignment: { type: Boolean, default: true },
			userMention: { type: Boolean, default: true },
			weeklyReports: { type: Boolean, default: true },
			reportsAt: { type: Array, default: ["Monday", "07:00"] },
			email: { type: String },
		},
		refreshTokens: [{ type: String }],
		keepCurrentToken: { type: Boolean, default: false },
		taskSubscriptions: [{ type: Schema.Types.ObjectId, ref: "Task" }],
		roles: { type: [String], enum: ["user", "technical", "marketing", "admin"], default: "user" },
		chatGPT: {
			token: { type: "String", default: null },
		},
	},
	{ timestamps: true, toObject: { versionKey: false } },
);

userSchema.plugin(mongooseLeanDefaults.default);

export default userSchema;
