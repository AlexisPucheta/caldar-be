const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerSchemaMongoose = new Schema(
  {
    companyId: ObjectId,

    buildingId: ObjectId,

    type: ObjectId,

    serialNumber: Number,

    manufacturingDate: String,

    instalationDate: String,

    location: String,

    status: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Boiler", boilerSchemaMongoose);
