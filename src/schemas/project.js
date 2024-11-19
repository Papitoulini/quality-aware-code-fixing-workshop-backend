import mongoose from "mongoose";
import mongooseLeanDefaults from "mongoose-lean-defaults";

const { Schema } = mongoose;

const defaultIntegrationVal = {
	subscription: { type: Boolean, default: false }, // Editable from admin panel. If false, the user cannot enable
	enabled: { type: Boolean, default: false }, // Editable from the user, if subscription = true
	integration: { type: Schema.Types.ObjectId, ref: "Integration", default: null }, // Object id, reference to the integrations collection
};

const projectSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, default: "" },
		type: { type: String, enum: ["personal", "team"], default: "personal" },
		kanban: {
			_id: false,
			style: { type: String, enum: ["none", "minimal", "default"], default: "default" },
			hasArchived: { type: Boolean, default: true },
		},
		team: [{
			_id: false,
			user: { type: Schema.Types.ObjectId, ref: "User" },
			role: { type: String, enum: ["admin", "member"], default: "member" },
		}],
		linkedRepositories: [{ type: Schema.Types.ObjectId, ref: "Repository" }],
		availableLabels: { type: Array, default: ["bug", "documentation", "enhancement", "feature", "design", "invalid", "duplicate"] },
		analytics: {
			project: { type: Boolean, default: true },
			quality: { type: Boolean, default: true },
		},
		integrations: {
			useReq: defaultIntegrationVal,
			azureTasks: defaultIntegrationVal,
			msTeams: defaultIntegrationVal,
			azurePullRequests: defaultIntegrationVal,
			githubTasks: defaultIntegrationVal,
		},
		supportEmail: { type: String, default: "" },
		azurePullRequests: { type: Number },
	},
	{ timestamps: true, toObject: { versionKey: false } },
);
projectSchema.plugin(mongooseLeanDefaults.default);

export default projectSchema;
