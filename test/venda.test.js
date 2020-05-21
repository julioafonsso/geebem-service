const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { before, describe, it } = (exports.lab = Lab.script());
const { init } = require("../src/server");

const { connect } = require("./mongoTest");

describe("vendas...", () => {
	let server;
	let livro;
	before(async () => {
		server = await init();
		await connect();

		const res = await server.inject({
			method: "post",
			url: "/livro",
			payload: {
				nome: "NomeLivroVenda",
				nomeAutor: "NomeAutorVenda",
				nomeMedium: "NomeMediumVenda",
				nomeEditora: "NomeEditorVenda",
			},
		});

		livro = JSON.parse(res.payload).data;

		let compra = {
			data: "01/01/2019",
			livros: [
				{ idLivro: livro._id, quantidade: 100, preco: 15 },
			],
		};

		const resCompra = await server.inject({
			method: "post",
			url: "/compra",
			payload: compra,
		});
	});

	it("Validando cadastrar venda de livros sem lista de livro...", async () => {
		let venda = {
			data: "01/01/2020",
		};

		const resVenda = await server.inject({
			method: "post",
			url: "/venda",
			payload: venda,
		});

		let { message } = JSON.parse(resVenda.payload);

		expect(resVenda.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Lista de livros" deve ser preenchido');
	});

	it("Validando cadastrar venda de livros com lista de livro vazia...", async () => {
		let venda = {
			data: "01/01/2020",
			livros: [],
		};

		const resVenda = await server.inject({
			method: "post",
			url: "/venda",
			payload: venda,
		});

		let { message } = JSON.parse(resVenda.payload);

		expect(resVenda.statusCode).to.equal(400);
		expect(message).to.equal(
			'O campo "Lista de livros" deve ser maior ou igual 1'
		);
	});
	it("Validando cadastrar venda de livros sem parmetros obrigatorios", async () => {
		let venda = {
			livros: [{}],
		};

		const resVenda = await server.inject({
			method: "post",
			url: "/venda",
			payload: venda,
		});

		let { message } = JSON.parse(resVenda.payload);

		expect(resVenda.statusCode).to.equal(400);

		expect(message).to.contain('O campo "Data da venda" deve ser preenchido');
		expect(message).to.contain('O campo "Livro" deve ser preenchido');
		expect(message).to.contain(
			'O campo "Quantidade do livro" deve ser preenchido'
		);
	});

	it("Validando cadastrar venda de livros com parametros invalidos", async () => {
		let venda = {
			data: "",
			livros: [{ idLivro: "abx", quantidade: 0 }],
		};

		const resVenda = await server.inject({
			method: "post",
			url: "/venda",
			payload: venda,
		});

		let { message } = JSON.parse(resVenda.payload);

		expect(resVenda.statusCode).to.equal(400);

		expect(message).to.contain(
			'O campo "Data da venda" deve ser uma data valida'
		);
		expect(message).to.contain(
			'O campo "Quantidade do livro" deve ser maior que 0'
		);
	});


	it("validando cadastro de venda sem ter livro em estoque", async () => {

		let venda = {
			data: "01/01/2019",
			livros: [
				{ idLivro: livro._id, quantidade: 200 },
			],
		};

		const resVenda = await server.inject({
			method: "post",
			url: "/venda",
			payload: venda,
		});

		let { message } = JSON.parse(resVenda.payload);
		
		expect(resVenda.statusCode).to.equal(400);
		expect(message).to.equal("Não existe o livro no estoque");

	
	});

	it("Cadastrando venda", async () => {

		let venda = {
			data: "01/01/2019",
			livros: [
				{ idLivro: livro._id, quantidade: 2 },
			],
		};

		const resVenda = await server.inject({
			method: "post",
			url: "/venda",
			payload: venda,
		});

		let { message } = JSON.parse(resVenda.payload);
		expect(resVenda.statusCode).to.equal(200);
		expect(message).to.equal("Venda cadastrada com sucesso");

		const resPesquisa = await server.inject({
			method: "get",
			url: "/livro/" + livro._id,
		});

		let livroConsultado = JSON.parse(resPesquisa.payload);

		expect(livroConsultado.quantidade).to.equal(98);
	});

	it("Validando parametros obrigatorios da consulta de vendas...", async () => {
		const resPesquisa = await server.inject({
			method: "get",
			url: "/venda",
		});
		let { message } = JSON.parse(resPesquisa.payload);

		expect(resPesquisa.statusCode).to.equal(400);
		expect(message).to.contain('O campo "Data Inicial" deve ser preenchido');
		expect(message).to.contain('O campo "Data Final" deve ser preenchido');
	});

	it("Validando parametros da consulta de vendas com valores invalidos...", async () => {
		const resPesquisa = await server.inject({
			method: "get",
			url: "/venda?dataInicial=11111&dataFinal=2",
		});
		let { message } = JSON.parse(resPesquisa.payload);

		expect(resPesquisa.statusCode).to.equal(400);
		expect(message).to.contain(
			'O campo "Data Inicial" deve ser uma data valida'
		);
		expect(message).to.contain('O campo "Data Final" deve ser uma data valida');
	});

	it("Pesquisando vendas...", async () => {
		let venda1 = {
			data: "01/02/2020",
			livros: [
				{ idLivro: livro._id, quantidade: 1 },
			],
		};

		let venda2 = {
			data: "02/02/2020",
			livros: [
				{ idLivro: livro._id, quantidade: 1 },
			],
		};

		let venda3 = {
			data: "03/02/2020",
			livros: [
				{ idLivro: livro._id, quantidade: 1 },
			],
		};

		await server.inject({
			method: "post",
			url: "/venda",
			payload: venda1,
		});

		await server.inject({
			method: "post",
			url: "/venda",
			payload: venda3,
		});

		await server.inject({
			method: "post",
			url: "/venda",
			payload: venda2,
		});

		const resPesquisa = await server.inject({
			method: "get",
			url: "/venda?dataInicial=01/02/2020&dataFinal=02/02/2020",
		});
		let vendas = JSON.parse(resPesquisa.payload);
		expect(resPesquisa.statusCode).to.equal(200);
		expect(vendas.length).to.equal(2);
	});
});
