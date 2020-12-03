const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const boilerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Give me a name at least!"],
    },
    type: ObjectId,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Boiler", boilerSchema);
