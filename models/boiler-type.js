const { model } = require("mongoose");

module.exports = mongoose => {
    const boilerType = mongoose.model(
        "boiler type",
        mongoose.Schema(
            {
                id: Number,
                type: String,
            }
        )
    )
    return boilerType
};