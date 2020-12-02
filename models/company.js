const { model, Schema } = require("mongoose");

const CompanySchema = new Schema({
	name: {
		type: String,
        required: true
    },
    buildings: {
        type: Array,
        required: true
    }
}, {_id: true, timestamps: true });

module.exports = model('Company', CompanySchema);
