const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const buildingSchema = Joi.object({
  company: Joi.objectId().allow(""),

  name: Joi.string().required(),

  address: Joi.string().required(),

  zipcode: Joi.string().required(),

  contact: Joi.string().required(),

  phone: Joi.number().required(),

  email: Joi.string().email().required(),

  obs: Joi.string().allow(null, ""),

  boilers: Joi.array().items(Joi.objectId()),
});

module.exports = buildingSchema;
