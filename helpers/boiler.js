const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const boilerSchema = Joi.object({
  building: Joi.objectId(),

  type: Joi.string().pattern(new RegExp("[ABCD]")).length(1).required(),

  serialNumber: Joi.number().required(),

  manufacturingDate: Joi.date().less("now").required(),

  installationDate: Joi.date().less("now"),

  status: Joi.string().lowercase().required(),
});

module.exports = boilerSchema;
