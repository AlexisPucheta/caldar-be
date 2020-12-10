const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const serviceSchemaMongoose = new Schema(
  {
    boiler: {
      type: ObjectId,
      ref: "Boiler",
    },

    technician: {
      type: ObjectId,
      ref: "Technician",
    },

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
