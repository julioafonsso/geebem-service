const Mongoose = require("mongoose");
const mongoDb = require("./modelMongoDB");

const Joi = require("@hapi/joi");
const { getMessagesErro } = require("../services/messagesErro");

const livroSchema = new Mongoose.Schema({
	nome: {
		type: String,
		required: true,
	},
	nomeAutor: {
		type: String,
		required: true,
	},

	nomeMedium: {
		type: String,
		required: true,
	},
	nomeEditora: {
		type: String,
		required: true,
	},
	preco: {
		type: Number,
		default: 0,
	},
	quantidade: {
		type: Number,
		default: 0,
	},
});

class LivroModel extends mongoDb {
	constructor() {
		super(Mongoose.model("livro", livroSchema));
	}

	async cadastrar(livro) {
		try {
			// this._valid(livro)
			return await super.create(livro);
		} catch (e) {
			throw e;
		}
	}

	async pesquisar(filter) {
		try {
			return await super.read({
				$or: [
					{ nome: { $regex: ".*" + filter + ".*", $options: "i" } },
					{ nomeAutor: { $regex: ".*" + filter + ".*", $options: "i" } },
					{ nomeMedium: { $regex: ".*" + filter + ".*", $options: "i" } },
					{ nomeEditora: { $regex: ".*" + filter + ".*", $options: "i" } },
				],
			});
		} catch (e) {
			throw e;
		}
	}

	async pesquisarPeloId(id) {
		try {
			let retorno = await super.read({ _id: id });
			return retorno[0];
		} catch (e) {
			throw e;
		}
	}

	async alterar(id, livro) {
		try {
			return await super.update(id, livro);
		} catch (e) {
			throw e;
		}
	}

	async retirarDoEstoque(id, quantidade) {
		try {
			let livro = await this.pesquisarPeloId(id);
			if (
				livro === undefined ||
				livro.quantidade === undefined ||
				quantidade > livro.quantidade
			)
				throw new Error("Não existe o livro no estoque");
			livro.quantidade = livro.quantidade - quantidade;
			await this.alterar(livro._id, { quantidade: livro.quantidade });
			return livro;
		} catch (e) {
			throw e;
		}
	}

	async adicionarNoEstoque(id, quantidade) {
		try {
			let livro = await this.pesquisarPeloId(id);
			livro.quantidade = livro.quantidade + quantidade;
			await this.alterar(livro._id, { quantidade: livro.quantidade });
			return livro;
		} catch (e) {
			throw e;
		}
	}
}

module.exports = LivroModel;
