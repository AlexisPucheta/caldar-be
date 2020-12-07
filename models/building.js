const { ObjectId } = require("mongodb");
const { model, Schema } = require("mongoose");

const buildingSchemaMongoose = new Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },

        name: String,

        address: String,

        zipcode: String,

        contact: String,

        phone: Number,

        email: String,

        obs: String,

        boilers: [ObjectId],
    },
    { _id: true, timestamps: true }
);

module.exports = model("Building", buildingSchemaMongoose);