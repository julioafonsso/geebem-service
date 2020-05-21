const Boom = require("boom");
const LivroModel = require("../bd/livroModel");
const CompraModel = require("../bd/compraModel");

module.exports.cadastrar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			let livroModel = new LivroModel();
			let compraModel = new CompraModel();
			let compra = request.payload;
			let livros = [];
			for (const item of compra.livros) {
				let livro = await livroModel.adicionarNoEstoque(
					item.idLivro,
					item.quantidade
				);

				livros.push({
					nome: livro.nome,
					nomeAutor: livro.nomeAutor,
					nomeEditora: livro.nomeEditora,
					nomeMedium: livro.nomeMedium,
					preco: item.preco,
					quantidade: item.quantidade,
				});
			}
			let cadastroCompra = {
				data: compra.data,
				livros,
			};

			compraModel.cadastrar(cadastroCompra);
			resolve({ message: "Compra cadastrada com sucesso" });
		} catch (e) {
			console.log(e)
			reject(Boom.badRequest(e.message));
		}
	});
};

module.exports.pesquisar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { dataInicial, dataFinal } = request.query;
			let compraModel = new CompraModel();
			let lista = await compraModel.pesquisar(dataInicial, dataFinal);
			resolve(lista);
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};
