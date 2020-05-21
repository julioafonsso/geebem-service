const Joi = require("@hapi/joi");
const { signup, login } = require("../services/authService");
const { getMessagesErro } = require("../services/messagesErro");
module.exports.getRouteAuth = getRouteAuth = () => [
	{
		path: "/signup",
		method: "POST",
		options: {
			auth: false,
			description: "signup",
			tags: ['api'],
			validate: {
				failAction: (request, header, erro) => {
					throw erro;
				},
				payload: Joi.object({
					username: Joi.string().required().label("Usuario"),
					password: Joi.string().required().label("Senha"),
				}).messages(getMessagesErro()),
			},
		},
		handler: signup,
	},
	{
		path: "/login",
		method: "POST",
		options: {
			auth: false,
			description: "login",
			tags: ['api'],
			validate: {
				failAction: (request, header, erro) => {
					throw erro;
				},
				payload: Joi.object({
					username: Joi.string().required().label("Usuario"),
					password: Joi.string().required().label("Senha"),
				}).messages(getMessagesErro()),
			},
		},
		handler: login,
	},
];
