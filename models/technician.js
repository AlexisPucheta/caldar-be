const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const technicianSchema = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "Gimme a name at least!"],
    },
    phone: String,
    birthday: String,
    email: String,
    boilers: [ObjectId],
    types: [ObjectId],
  },
  { _id: true, timestamps: true }
);

module.exports = model("Technician", technicianSchema);
