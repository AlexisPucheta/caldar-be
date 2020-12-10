const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const technicianSchema = Joi.object({
  services: Joi.array().items(Joi.objectId()),

  fullname: Joi.string().required(),

  email: Joi.string().email().required(),

  phone: Joi.number().required(),

  address: Joi.string().required(),

  dateOfBirth: Joi.date().less("now").required(),

  knowledge: Joi.array().items(Joi.string().uppercase()),

  obs: Joi.string(),
});

module.exports = technicianSchema;
