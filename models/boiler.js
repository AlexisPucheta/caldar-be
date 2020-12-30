const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerSchemaMongoose = new Schema(
  {
    building: {
      type: ObjectId,
      ref: "Building",
    },

    type: {
      type: String,
      ref: "BoilerType",
    },

    serialNumber: Number,

    manufacturingDate: String,

    installationDate: String,

    status: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Boiler", boilerSchemaMongoose);
