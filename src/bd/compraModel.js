const Mongoose = require("mongoose");
const mongoDb = require("./modelMongoDB");

const compraSchema = new Mongoose.Schema({
	livros: [
		{
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
				required: true,
			},
			quantidade: {
				type: Number,
				default: 0,
			},
		},
	],
	data: {
		type: Date,
		required: true,
	},
});

class CompraModel extends mongoDb {
	constructor() {
		super(Mongoose.model("compra", compraSchema));
	}

	async cadastrar(compra) {
		try {
			return await super.create(compra);
		} catch (e) {
			throw e;
		}
	}

	async pesquisar(dataInicio , dataFim){
		try {
			return await super.read({data : { $gte: dataInicio, $lte: dataFim }})
		} catch (e) {
			throw e;
		}
	}
}

module.exports = CompraModel;
