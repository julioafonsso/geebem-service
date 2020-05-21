const Joi = require("@hapi/joi");
const {
	cadastrar,
	pesquisar,
	pesquisarPeloId,
	alterar,
} = require("../services/livroService");
const { getMessagesErro } = require("../services/messagesErro");
module.exports.getRouteLivro = getRouteLivro = () => [
	{
		path: "/livro",
		method: "POST",
		options: {
			description: "Cadastro de livros",
			tags: ["api"],
			validate: {
				options: {
					abortEarly: false,
				},
				failAction: (request, header, erro) => {
					throw erro;
				},
				payload: Joi.object({
					nome: Joi.string().required().label("Nome do livro"),
					nomeAutor: Joi.string().required().label("Nome do autor"),
					nomeMedium: Joi.string().required().label("Nome do medium"),
					nomeEditora: Joi.string().required().label("Nome da editora"),
					preco: Joi.number().min(0).default(0).label("Preco"),
				}).messages(getMessagesErro()),
			},
		},
		handler: cadastrar,
	},
	{
		path: "/livro",
		method: "GET",
		options: {
			description: "Consulta de livros",
			tags: ["api"],
			validate: {
				failAction: (request, header, erro) => {
					throw erro;
				},
				query: Joi.object({
					filter: Joi.string().required().min(3).label("Filtro"),
				}).messages(getMessagesErro()),
			},
		},
		handler: pesquisar,
	},

	{
		path: "/livro/{id}",
		method: "GET",
		options: {
			description: "Consulta de livros pelo ID",
			tags: ["api"],
			validate: {
				options: {
					abortEarly: false,
				},
				failAction: (request, header, erro) => {
					throw erro;
				},
				params: Joi.object({
					id: Joi.string().required().label("Livro"),
				}).messages(getMessagesErro()),
			},
		},
		handler: pesquisarPeloId,
	},

	{
		path: "/livro/{id}",
		method: "PUT",
		options: {
			description: "Alteração de livro",
			tags: ["api"],
			validate: {
				options: {
					abortEarly: false,
				},
				failAction: (request, header, erro) => {
					throw erro;
				},
				payload: Joi.object({
					nome: Joi.string().required().label("Nome do livro"),
					nomeAutor: Joi.string().required().label("Nome do autor"),
					nomeMedium: Joi.string().required().label("Nome do medium"),
					nomeEditora: Joi.string().required().label("Nome da editora"),
					preco: Joi.number().min(0).default(0).label("Preco"),
				}).messages(getMessagesErro()),

				params: Joi.object({
					id: Joi.string().required().label("Livro"),
				}).messages(getMessagesErro()),
			},
		},
		handler: alterar,
	},
];
