const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const technicianSchemaMongoose = new Schema(
  {
    service: [ObjectId],

    fullname: String,

    email: String,

    phone: Number,

    address: String,

    dateOfBirth: Date,

    knowledge: [String],

    obs: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Technician", technicianSchemaMongoose);
