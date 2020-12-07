const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const boilerSchema = Joi.object({
  building: Joi.objectId(),

  type: Joi.string().pattern(new RegExp("[ABCD]")).required().length(1),

  serialNumber: Joi.number().required(),

  manufacturingDate: Joi.date().required().less("now"),

  instalationDate: Joi.date().less("now"),

  status: Joi.string().required().lowercase(),
});

module.exports = boilerSchema;
