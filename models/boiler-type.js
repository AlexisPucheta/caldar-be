const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerTypeSchemaMongoose = new Schema(
  {
    boilerType: String,

    stdMaintainance: Number,

    technician: {
      type: [ObjectId],
      ref: "technician",
    },

    obs: String,
  },
  { timestamps: true }
);

module.exports = model("BoilerType", boilerTypeSchemaMongoose);
