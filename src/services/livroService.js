const LivroModel = require("../bd/livroModel");

const Boom = require("boom");

module.exports.cadastrar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			const livro = request.payload;
			let livroModel = new LivroModel();
			let livroCdastrado = await livroModel.cadastrar(livro);
			resolve({
				message: "Livro cadastrado com sucesso",
				data: livroCdastrado,
			});
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};

module.exports.pesquisar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { filter } = request.query;
			let livroModel = new LivroModel();
			const retorno = await livroModel.pesquisar(filter);
			resolve(retorno);
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};


module.exports.pesquisarPeloId = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { id } = request.params;
			let livroModel = new LivroModel();
			const retorno = await livroModel.pesquisarPeloId(id);
			resolve(retorno);
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};

module.exports.alterar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
            const livro = request.payload;
			const { id } = request.params;
			let livroModel = new LivroModel();
			const retorno = await livroModel.alterar(id, livro);
			resolve({
				message: "Livro alerado com sucesso",
				data: retorno,
			});
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};