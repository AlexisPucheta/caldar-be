const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const boilerTypeSchema = Joi.object({
  boilerType: Joi.string().uppercase().length(1).required(),

  stdMaintainance: Joi.number().required(),

  technicians: Joi.array().items(Joi.objectId()),

  obs: Joi.string().allow(null, ""),
});

module.exports = boilerTypeSchema;
