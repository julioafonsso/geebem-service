module.exports.getMessagesErro = () => {
	return {
		"any.required": "O campo {#label} deve ser preenchido",
		"number.greater": "O campo {#label} deve ser maior que {#limit}",
		"number.positive": "O campo {#label} deve ser maior 0",
		"number.min": "O campo {#label} deve ser maior ou igual {#limit}",
		"array.min": "O campo {#label} deve ser maior ou igual {#limit}",
		"date.format": "O campo {#label} deve ser uma data valida",
		"string.min": "O campo {#label} deve ter no mimimo {#limit} caracteres"
	};
};

module.exports.getMessage = (value) => {
	return this.getMessagesErro()[value];
}
