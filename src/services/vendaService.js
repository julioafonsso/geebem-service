const Boom = require("boom");
const LivroModel = require("../bd/livroModel");
const VendaModel = require("../bd/vendaModel");

module.exports.cadastrar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			let livroModel = new LivroModel();
			let vendaModel = new VendaModel();
			let venda = request.payload;
			let livros = [];
			for (const item of venda.livros) {
				let livro = await livroModel.retirarDoEstoque(
					item.idLivro,
					item.quantidade
				);

				livros.push({
					nome: livro.nome,
					nomeAutor: livro.nomeAutor,
					nomeEditora: livro.nomeEditora,
					nomeMedium: livro.nomeMedium,
					preco: livro.preco,
					quantidade: item.quantidade,
				});
			}
			let cadastroVenda = {
				data: venda.data,
				livros,
			};

			vendaModel.cadastrar(cadastroVenda);
			resolve({ message: "Venda cadastrada com sucesso" });
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};

module.exports.pesquisar = (request) => {
	return new Promise(async (resolve, reject) => {
		try {
			const { dataInicial, dataFinal } = request.query;
			let vendaModel = new VendaModel();
			let lista = await vendaModel.pesquisar(dataInicial, dataFinal);
			resolve(lista);
		} catch (e) {
			reject(Boom.badRequest(e.message));
		}
	});
};
