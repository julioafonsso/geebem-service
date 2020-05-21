const { config } = require("dotenv");
const { join } = require("path");

const env = process.env.NODE_ENV || "dev";

const configPath = join("./config", `.env.${env}`);

config({ path: configPath });

const Hapi = require("@hapi/hapi");

const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("package");

const HapiJwt = require("hapi-auth-jwt2");

const cors = require("hapi-cors");

const { connect } = require("./bd/mongoDB");
const { getRouteAuth } = require("./routes/authRoute");
const { getRouteLivro } = require("./routes/livroRoute");
const { getRouteCompra } = require("./routes/compraRoute");
const { getRouteVenda } = require("./routes/vendaRoute");

const KEY = process.env.JWT_KEY;

const server = Hapi.server({
	port: process.env.PORT,
});

const swaggerOptions = {
	info: {
		title: "Livraria GEEBEM",
		version: Pack.version,
	},
};

server.route([
	...getRouteAuth(),
	...getRouteLivro(),
	...getRouteCompra(),
	...getRouteVenda(),
]);

exports.init = async () => {
	await server.initialize();
	return server;
};

exports.start = async () => {
	await server.register([
		HapiJwt,
		Inert,
		Vision,
		cors,
		{
			plugin: HapiSwagger,
			options: swaggerOptions,
			origins: ["http://localhost:3000"],
		},
	]);

	server.auth.strategy("jwt", "jwt", {
		key: KEY,
		validate: (dado, request) => {
			console.log(dado);
			return {
				isValid: true,
			};
		},
	});

	server.auth.default("jwt");

	server.start();
	connect();

	console.log(`Server running at: ${server.info.uri}`);
	return server;
};
