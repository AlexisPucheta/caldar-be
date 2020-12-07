const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerTypeSchema = new Schema(
  {
    boilerType: String,

    std_maintainance: Number,

    technician: ObjectId,

    obs: String,
  },
  { _id: true, timestamps: true }
);

module.exports = model("BoilerType", boilerTypeSchema);
