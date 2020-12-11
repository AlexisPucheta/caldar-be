const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const companySchema = Joi.object({
  buildings: Joi.array().items(Joi.objectId()),

  name: Joi.string().required(),

  address: Joi.string().required(),

  CIN: Joi.number().required(),

  zipcode: Joi.string().required(),

  contact: Joi.string().required(),

  email: Joi.string().required(),

  phone: Joi.number().required(),
});

module.exports = companySchema;
