const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const boilerSchema = Joi.object({
  building: Joi.objectId().allow(""),

  type: Joi.string().length(1).required(),

  serialNumber: Joi.number().required(),

  manufacturingDate: Joi.date().less("now").required(),

  installationDate: Joi.date().less("now").allow(""),

  obs: Joi.string().allow(""),

  status: Joi.string()
    .lowercase()
    .valid("working", "need repair", "reserved", "available")
    .required(),
});

module.exports = boilerSchema;
