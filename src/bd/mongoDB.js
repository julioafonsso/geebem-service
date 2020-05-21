const Mongoose = require("mongoose");
const STATUS = {
	0: "Disconectado",
	1: "Conectado",
	2: "Conectando",
	3: "Disconectando",
};

module.exports.connect = async () => {
	Mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
		.then(() => {
			console.log("MongoDB is connected");
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
};
