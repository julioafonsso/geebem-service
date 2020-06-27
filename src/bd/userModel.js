const Mongoose = require("mongoose");
const mongoDb = require("./modelMongoDB");

const Jwt = require("jsonwebtoken");
const Bcrypt = require("bcrypt");
const { promisify } = require("util");

const hashAsync = promisify(Bcrypt.hash);
const compareAsync = promisify(Bcrypt.compare);
const SALT = parseInt(process.env.PWD_SALT);
const KEY = process.env.JWT_KEY;

const userSchema = new Mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

class UserModel extends mongoDb {
	constructor() {
		super(Mongoose.model("usuario", userSchema));
	}

	async signup(username, password) {
		try {
			await this._validusername(username);
			let passwordHash = await hashAsync(password, SALT);
			await super.create({
				username: username.toLowerCase(),
				password: passwordHash,
			});
		} catch (e) {
			throw e;
		}
	}

	async login(username, password) {
		try {
			const [user] = await this.read({ username: username.toLowerCase() });
			if (user === undefined || !compareAsync(password, user.password))
				throw Error("O usuario e senha invalidos!");
			return {
				token: Jwt.sign(
					{
						username: username,
					},
					KEY
				),
			};
		} catch (e) {
			throw e;
		}
	}

	async _validusername(username) {
		const result = await this.read({ username: username.toLowerCase() });
		if (result.length > 0) throw Error("Usuario Já existe");
	}
}

module.exports = UserModel;
