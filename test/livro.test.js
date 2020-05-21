const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { after, before, describe, it } = (exports.lab = Lab.script());
const { init } = require("../src/server");

const { connect } = require("./mongoTest");

describe("Livros...", () => {
	let server;
	let livroInicial;

	before(async () => {
		server = await init();
		await connect();

		const res = await server.inject({
			method: "post",
			url: "/livro",
			payload: {
				nome: "Nosso Lar",
				nomeAutor: "Andre Luiz",
				nomeMedium: "Chico Xavier",
				nomeEditora: "FEEBE",
			},
		});
		let retorno = JSON.parse(res.payload);

		livroInicial = retorno.data;
	});

	it("Validando cadastro de livro sem parametros obrigatorios", async () => {
		const res = await server.inject({
			method: "post",
			url: "/livro",
			payload: {},
		});

		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.contain('O campo "Nome do livro" deve ser preenchido');
		expect(message).to.contain('O campo "Nome do autor" deve ser preenchido');
		expect(message).to.contain('O campo "Nome do medium" deve ser preenchido');
		expect(message).to.contain('O campo "Nome da editora" deve ser preenchido');
	});

	it("Validando cadastro de livro com preco negativo", async () => {
		const res = await server.inject({
			method: "post",
			url: "/livro",
			payload: {
				nome: "Nosso Lar",
				nomeAutor: "Andre Luiz",
				nomeMedium: "Chico Xavier",
				nomeEditora: "Nome Editora",
				preco: -1,
			},
		});
		let { message } = JSON.parse(res.payload);
		expect(res.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Preco" deve ser maior ou igual 0');
	});

	it("Cadastrando Livro...", async () => {
		const res = await server.inject({
			method: "post",
			url: "/livro",
			payload: {
				nome: "Nome Livro",
				nomeAutor: "Nome Autor",
				nomeMedium: "Nome Medium",
				nomeEditora: "Nome Editora",
			},
		});
		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(200);

		expect(message).to.equal("Livro cadastrado com sucesso");
	});

	it("validando pesquisa livro sem filtro...", async () => {
		const res = await server.inject({
			method: "get",
			url: "/livro",
		});
		expect(res.statusCode).to.equal(400);

		let { message } = JSON.parse(res.payload);
		expect(message).to.equal('O campo "Filtro" deve ser preenchido');
	});

	it("validando pesquisa livro com filtro com menos de 3 caracter...", async () => {
		const res = await server.inject({
			method: "get",
			url: "/livro?filter=ab",
		});
		expect(res.statusCode).to.equal(400);
		let { message } = JSON.parse(res.payload);

		expect(message).to.equal('O campo "Filtro" deve ter no mimimo 3 caracteres');
	});

	it("Pesquisando pelo nome...", async () => {
		const res = await server.inject({
			method: "get",
			url: "/livro?filter=lar",
		});
		expect(res.statusCode).to.equal(200);

		let lista = JSON.parse(res.payload);
		expect(lista.length).to.equal(1);

		let livro = lista[0];
		expect(livro.nome).to.equal("Nosso Lar");
	});

	it("Pesquisando pelo nome do autor...", async () => {
		const res = await server.inject({
			method: "get",
			url: "/livro?filter=andre",
		});
		expect(res.statusCode).to.equal(200);

		let lista = JSON.parse(res.payload);
		expect(lista.length).to.equal(1);

		let livro = lista[0];
		expect(livro.nomeAutor).to.equal("Andre Luiz");
	});

	it("Pesquisando pelo nome do Medium...", async () => {
		const res = await server.inject({
			method: "get",
			url: "/livro?filter=chic",
		});
		expect(res.statusCode).to.equal(200);

		let lista = JSON.parse(res.payload);
		expect(lista.length).to.equal(1);

		let livro = lista[0];
		expect(livro.nomeMedium).to.equal("Chico Xavier");
	});

	it("Pesquisando pelo nome da Editora...", async () => {
		const res = await server.inject({
			method: "get",
			url: "/livro?filter=fee",
		});
		expect(res.statusCode).to.equal(200);

		let lista = JSON.parse(res.payload);
		expect(lista.length).to.equal(1);

		let livro = lista[0];
		expect(livro.nomeEditora).to.equal("FEEBE");
	});

	it("Pesquisando um livro pelo id...", async () => {
		const resConsult = await server.inject({
			method: "get",
			url: "/livro/" + livroInicial._id,
		});

		expect(resConsult.statusCode).to.equal(200);

		let livroConsultado = JSON.parse(resConsult.payload);

		expect(livroInicial).to.equal(livroConsultado);
	});

	it("Validando alteração de livro sem parametros obrigatorios...", async () => {
		const res = await server.inject({
			method: "put",
			url: "/livro/1",
			payload: {},
		});

		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.contain('O campo "Nome do livro" deve ser preenchido');
		expect(message).to.contain('O campo "Nome do autor" deve ser preenchido');
		expect(message).to.contain('O campo "Nome do medium" deve ser preenchido');
		expect(message).to.contain('O campo "Nome da editora" deve ser preenchido');
	});

	it("Validando alteração de livro com preço negativo...", async () => {
		const res = await server.inject({
			method: "put",
			url: "/livro/1",
			payload: {
				nome: "Nosso Lar",
				nomeAutor: "Andre Luiz",
				nomeMedium: "Chico Xavier",
				nomeEditora: "Nome Editora",
				preco: -1,
			},
		});

		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Preco" deve ser maior ou igual 0');
	});

	it("Alterando um livro pelo id...", async () => {
		const livroAlterado = {
			nome: "Nome Livro Alterado",
			nomeAutor: "Nome Autor Alterado",
			nomeMedium: "Nome Medium Alterado",
			nomeEditora: "Nome Editora Alterado",
			preco: 25,
		};

		const resAlteracao = await server.inject({
			method: "put",
			url: "/livro/" + livroInicial._id,
			payload: livroAlterado,
		});

		expect(resAlteracao.statusCode).to.equal(200);

		const resConsult = await server.inject({
			method: "get",
			url: "/livro/" + livroInicial._id,
		});
		expect(resConsult.statusCode).to.equal(200);

		let livroConsultado = JSON.parse(resConsult.payload);

		let livroParaComparacao = {
			...livroInicial,
			...livroAlterado,
		};

		expect(livroParaComparacao).to.equal(livroConsultado);
	});
});
