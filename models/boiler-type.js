const { model, Schema } = require("mongoose");

const boilerTypeSchema = new Schema({
	desc: {
		type: String,
		required: true
	}
}, { timestamps: true });

module.exports = model('BoilerType', boilerTypeSchema);