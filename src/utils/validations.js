import validationSchemas from "./validation-schemas.js";

const helpers = {
	minPassword: validationSchemas.minPassword,
	validate: async (req, res, next, schema) => {
		try {
			const { body } = req;
			await validationSchemas[schema].validate(body);
			return next();
		} catch (error) {
			return res.json({
				message: `Validation Error: ${error.errors[0]}`,
				status: 400,
			});
		}
	},
};

export default helpers;
