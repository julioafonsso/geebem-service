const Mongoose = require("mongoose");
const mongoDb = require("./modelMongoDB");

const vendaSchema = new Mongoose.Schema({
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

class VendaModel extends mongoDb {
	constructor() {
		super(Mongoose.model("venda", vendaSchema));
	}

	async cadastrar(venda) {
		try {
			return await super.create(venda);
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

module.exports = VendaModel;
