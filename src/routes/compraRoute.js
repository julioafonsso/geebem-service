const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const { cadastrar, pesquisar } = require("../services/compraService");
const { getMessagesErro } = require ('../services/messagesErro');
module.exports.getRouteCompra = getRouteCompra = () => [
	{
		path: "/compra",
		method: "POST",
		options: {
			tags: ['api'],
			description: "Cadastro de compra de livros",
			validate: {
				failAction: (request, header, erro) => {
					throw erro;
				},
				options: {
					abortEarly: false,
				},
				payload: Joi.object({
					data: Joi.date().required().format("DD/MM/YYYY").label("Data da compra"),
					livros: Joi.array()
						.items(
							Joi.object({
								idLivro: Joi.string().required().label("Livro"),
								preco: Joi.number()
									.min(0)
									.required()
									.label("Preço da compra"),
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
		path: "/compra",
		method: "GET",
		options: {
			tags: ['api'],
			description: "Consulta de compra de livros",
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
