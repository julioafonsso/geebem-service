"use strict";

const Lab = require("@hapi/lab");
const { expect } = require("@hapi/code");
const { after, before, describe, it } = (exports.lab = Lab.script());
const { init } = require("../src/server");

const { connect } = require("./mongoTest");

describe("Auth...", () => {
	let server;

	before(async () => {
		server = await init();
		await connect();

		const res = await server.inject({
			method: "post",
			url: "/signup",
			payload: { username: "julio", password: "senhasecreta" },
		});
		
	});

	after(async () => {
		await server.stop();
	});

	it("Validando signup sem passar username", async () => {
		const res = await server.inject({
			method: "post",
			url: "/signup",
			payload: {},
		});
		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Usuario" deve ser preenchido');
	});

	it("Validando signup sem passar password", async () => {
		const res = await server.inject({
			method: "post",
			url: "/signup",
			payload: { username: "julio" },
		});
		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Senha" deve ser preenchido');
	});

	it("Criando usuario", async () => {
		const res = await server.inject({
			method: "post",
			url: "/signup",
			payload: { username: "julioafonsso", password: "senhasecreta" },
		});

		expect(res.statusCode).to.equal(200);
	});

	it("Criando usuario com username já existente", async () => {
		const res = await server.inject({
			method: "post",
			url: "/signup",
			payload: { username: "julio", password: "senhasecreta" },
		});

		expect(res.statusCode).to.equal(401);
		let { message } = JSON.parse(res.payload);
		expect(message).to.equal("Usuario Já existe");

	});

	it("Efetuando Login...", async()=>{
		const res = await server.inject({
			method: "post",
			url: "/login",
			payload: { username: "julio", password: "senhasecreta" },
		});
		expect(res.statusCode).to.equal(200);
		let { token } = JSON.parse(res.payload);
		expect(token)
	})

	it("Validando Login sem passar user", async()=>{
		const res = await server.inject({
			method: "post",
			url: "/login",
			payload: {},
		});
		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Usuario" deve ser preenchido');
	})

	it("Validando login sem passar password", async () => {
		const res = await server.inject({
			method: "post",
			url: "/login",
			payload: { username: "julio" },
		});
		let { message } = JSON.parse(res.payload);

		expect(res.statusCode).to.equal(400);
		expect(message).to.equal('O campo "Senha" deve ser preenchido');
	});

	
});
