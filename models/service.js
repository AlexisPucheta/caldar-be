const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const serviceSchemaMongoose = new Schema(
  {
    boiler: ObjectId,

    technician: ObjectId,

    status: String,

    prioriry: String,

    type: String,

    agreedDate: Date,

    openedDate: Date,

    closingDate: Date,

    details: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Service", serviceSchemaMongoose);
