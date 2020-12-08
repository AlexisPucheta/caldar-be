const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const companySchema = Joi.object({
  cin: Joi.number().required(),

  name: Joi.string().required(),

  address: Joi.string().required(),

  zipcode: Joi.string().required(),

  contact: Joi.string().required(),

  email: Joi.string().email().required(),

  phone: Joi.number().required(),

  buildings: Joi.array().items(Joi.objectId()),
});

module.exports = companySchema;
