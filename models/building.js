const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const buildingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Give me a name at least!"],
    },
    address: String,
    boilers: [ObjectId],
    company: ObjectId,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Building", buildingSchema);
