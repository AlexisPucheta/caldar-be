const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const boilerSchema = Joi.object({
  companyId: Joi.objectId(),

  buildingId: Joi.objectId(),

  type: Joi.objectId().required(),

  serialNumber: Joi.number().required(),

  manufacturingDate: Joi.date().required(),

  instalationDate: Joi.date(),

  location: Joi.string().required(),

  status: Joi.string(),
});

module.exports = boilerSchema;
