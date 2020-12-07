const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerSchemaMongoose = new Schema(
  {
    building: ObjectId,

    type: String,

    serialNumber: Number,

    manufacturingDate: String,

    instalationDate: String,

    status: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Boiler", boilerSchemaMongoose);
