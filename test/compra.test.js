const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { after, before, describe, it } = (exports.lab = Lab.script());
const { init } = require("../src/server");

const { connect } = require("./mongoTest");

describe("compras...", () => {
	let server;
	let livro;
	before(async () => {
		server = await init();
		await connect();

		const res = await server.inject({
			method: "post",
			url: "/livro",
			payload: {
				nome: "NomeLivro1",
				nomeAutor: "NomeAutor1",
				nomeMedium: "NomeMedium1",
				nomeEditora: "NomeEditor1",
			},
		});

		livro = JSON.parse(res.payload).data;
	});

	it("Validando cadastrar compra de livros sem lista de livro...", async () => {
		let compra = {
			data: "01/01/2020",
		};

		const resCompra = await server.inject({
			method: "post",
			url: "/compra",
			payload: compra,
		});

		let { message } = JSON.parse(resCompra.payload);

		expect(resCompra.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Lista de livros" deve ser preenchido');
	});
	it("Validando cadastrar compra de livros com lista de livro vazia...", async () => {
		let compra = {
			data: "01/01/2020",
			livros: [],
		};

		const resCompra = await server.inject({
			method: "post",
			url: "/compra",
			payload: compra,
		});

		let { message } = JSON.parse(resCompra.payload);

		expect(resCompra.statusCode).to.equal(400);
		expect(message).to.equal(
			'O campo "Lista de livros" deve ser maior ou igual 1'
		);
	});
	it("Validando cadastrar compra de livros sem parmetros obrigatorios", async () => {
		let compra = {
			livros: [{}],
		};

		const resCompra = await server.inject({
			method: "post",
			url: "/compra",
			payload: compra,
		});

		let { message } = JSON.parse(resCompra.payload);

		expect(resCompra.statusCode).to.equal(400);

		expect(message).to.contain('O campo "Data da compra" deve ser preenchido');
		expect(message).to.contain('O campo "Livro" deve ser preenchido');
		expect(message).to.contain('O campo "Preço da compra" deve ser preenchido');
		expect(message).to.contain(
			'O campo "Quantidade do livro" deve ser preenchido'
		);
	});

	it("Validando cadastrar compra de livros com parametros invalidos", async () => {
		let compra = {
			data: "",
			livros: [{ idLivro: "abx", quantidade: 0, preco: -1 }],
		};

		const resCompra = await server.inject({
			method: "post",
			url: "/compra",
			payload: compra,
		});

		let { message } = JSON.parse(resCompra.payload);

		expect(resCompra.statusCode).to.equal(400);

		expect(message).to.contain('O campo "Data da compra" deve ser uma data valida');
		expect(message).to.contain(
			'O campo "Preço da compra" deve ser maior ou igual 0'
		);
		expect(message).to.contain(
			'O campo "Quantidade do livro" deve ser maior que 0'
		);
	});

	it("Cadastrando compra", async () => {
		let compra = {
			data: "01/01/2019",
			livros: [
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
			],
		};

		const resCompra = await server.inject({
			method: "post",
			url: "/compra",
			payload: compra,
		});

		let { message } = JSON.parse(resCompra.payload);

		expect(resCompra.statusCode).to.equal(200);
		expect(message).to.equal("Compra cadastrada com sucesso");

		const resPesquisa = await server.inject({
			method: "get",
			url: "/livro/" + livro._id,
		});

		let livroConsultado = JSON.parse(resPesquisa.payload);

		expect(livroConsultado.quantidade).to.equal(10);
	});

	it("Validando parametros obrigatorios da consulta de compras...", async () => {
		const resPesquisa = await server.inject({
			method: "get",
			url: "/compra",
		});
		let { message } = JSON.parse(resPesquisa.payload);

		expect(resPesquisa.statusCode).to.equal(400);
		expect(message).to.contain('O campo "Data Inicial" deve ser preenchido');
		expect(message).to.contain('O campo "Data Final" deve ser preenchido');
	});

	it("Validando parametros da consulta de compras com valores invalidos...", async () => {
		const resPesquisa = await server.inject({
			method: "get",
			url: "/compra?dataInicial=11111&dataFinal=2",
		});
		let { message } = JSON.parse(resPesquisa.payload);

		expect(resPesquisa.statusCode).to.equal(400);
		expect(message).to.contain(
			'O campo "Data Inicial" deve ser uma data valida'
		);
		expect(message).to.contain('O campo "Data Final" deve ser uma data valida');
	});

	it("Pesquisando Compras...", async () => {
		let compra1 = {
			data: "01/02/2020",
			livros: [
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
			],
		};

		let compra2 = {
			data: "02/02/2020",
			livros: [
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
			],
		};

		let compra3 = {
			data: "03/02/2020",
			livros: [
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
				{ idLivro: livro._id, quantidade: 10, preco: 15 },
			],
		};

		await server.inject({
			method: "post",
			url: "/compra",
			payload: compra1,
		});

		await server.inject({
			method: "post",
			url: "/compra",
			payload: compra3,
		});

		await server.inject({
			method: "post",
			url: "/compra",
			payload: compra2,
		});

		const resPesquisa = await server.inject({
			method: "get",
			url: "/compra?dataInicial=01/02/2020&dataFinal=02/02/2020",
		});
		let compras = JSON.parse(resPesquisa.payload);
		expect(resPesquisa.statusCode).to.equal(200);
		expect(compras.length).to.equal(2);
	});
});
