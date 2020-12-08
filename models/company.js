const { ObjectId} = require("mongodb");
const { model, Schema } = require("mongoose");

const CompanySchemaMongoose = new Schema(
  {
    building: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Building'
    },

    name: String,

    adress: String,

    CIN: Number,

    zipcode: String,

    contact: String,

    email: String,

    phone: Number,
  },
  { _id: true, timestamps: true }
);

module.exports = model("Company", CompanySchemaMongoose);
