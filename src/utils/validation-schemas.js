import yup from "yup";

const minPassword = 8;

const email = yup
	.string()
	.lowercase()
	.trim()
	.email();

const username = yup
	.string()
	.trim();

const password = yup
	.string()
	.trim()
	.min(minPassword);

const token = yup
	.string()
	.trim();

const request = yup.object().shape({ username: username.required() });

const authenticate = yup.object().shape({
	username: username.required(),
	password: password.required(),
});

const authenticateGoogle = yup.object().shape({
	token: token.required(),
});

const register = yup.object().shape({
	email: email.required(),
	password: password.required(),
	username: username.required(),
});

const invite = yup.object().shape({
	email: email.required(),
});

const helpers = {
	minPassword, authenticate, authenticateGoogle, register, request, invite,
};

export default helpers;
