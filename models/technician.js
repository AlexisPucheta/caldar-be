const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const technicianSchema = new Schema({
    full_name: String,
    phone: String,
    birthday: String,
    email: String,
    boilers: [ObjectId],
    types: [ObjectId]
}, { timestamps: true });

module.exports = model('Technician', technicianSchema)