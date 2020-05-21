const UserModel = require("../bd/userModel");

const Boom = require("boom");

module.exports.signup = (request) => {
	const { username, password } = request.payload;

	return new Promise((resolve, reject) => {
		let user = new UserModel();
		user
			.signup(username, password)
			.then(() => {
				resolve({message : "Usuario cadastrado com sucesso!!!"});
			})
			.catch((erro) => {
				reject(Boom.unauthorized(erro.message));
			});
	});
};

module.exports.login = (request) => {
	const { username, password } = request.payload;
	
	return new Promise((resolve, reject) => {
		let user = new UserModel();
		user
			.login(username, password)
			.then((res) => {
				resolve(res);
			})
			.catch((erro) => {
				reject(Boom.unauthorized(erro.message));
			});
	});
};