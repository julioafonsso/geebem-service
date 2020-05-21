const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const { cadastrar, pesquisar } = require("../services/vendaService");
const { getMessagesErro } = require ('../services/messagesErro');

module.exports.getRouteVenda = getRouteVenda = () => [
	{
		path: "/venda",
		method: "POST",
		options: {
			description: "Cadastro de venda de livro",
			tags: ['api'],
			validate: {
				failAction: (request, header, erro) => {
					throw erro;
				},
				options: {
					abortEarly: false,
				},
				payload: Joi.object({
					data: Joi.date().required().format("DD/MM/YYYY").label("Data da venda"),
					livros: Joi.array()
						.items(
							Joi.object({
								idLivro: Joi.string().required().label("Livro"),
								quantidade: Joi.number()
									.greater(0)
									.required()
									.label("Quantidade do livro"),
							})
						)
						.required()
						.min(1)
						.label("Lista de livros"),
				}).messages(getMessagesErro()),
			},
		},
		handler: cadastrar,
	},
	{
		path: "/venda",
		method: "GET",
		options: {
			description: "Cadastro de venda de livro",
			tags: ['api'],
			validate: {
				failAction: (request, header, erro) => {
					throw erro;
				},
				options: {
					abortEarly: false,
				},
				query: Joi.object({
					dataInicial: Joi.date()
						.format("DD/MM/YYYY")
						.required()
						.label("Data Inicial"),
					dataFinal: Joi.date()
						.format("DD/MM/YYYY")
						.required()
						.label("Data Final"),
				}).messages(getMessagesErro()),
			},
		},
		handler: pesquisar,
	},
];
