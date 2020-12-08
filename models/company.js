const { ObjectId} = require("mongodb");
const { model, Schema } = require("mongoose");

const companySchemaMongoose = new Schema(
  {
    buildings: {
      type: [ObjectId],
      ref: "Building"
    },

    name: String,

    address: String,

    CIN: Number,

    zipcode: String,

    contact: String,

    email: String,

    phone: Number,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Company", companySchemaMongoose);
