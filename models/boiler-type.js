const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerTypeSchemaMongoose = new Schema(
  {
    boilerType: String,

    stdMaintainance: Number,

    technicians: {
      type: [ObjectId],
      ref: "Technician",
    },

    obs: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("BoilerType", boilerTypeSchemaMongoose);
