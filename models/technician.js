const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const technicianSchemaMongoose = new Schema(
  {
    services: {
      type: [ObjectId],
      ref: "Service",
    },

    fullname: String,

    email: String,

    phone: Number,

    address: String,

    dateOfBirth: Date,

    knowledge: {
      type: [String],
      ref: "BoilerType",
    },

    obs: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Technician", technicianSchemaMongoose);
