const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const serviceSchema = Joi.object({
  boiler: Joi.objectId().required(),

  technician: Joi.objectId(),

  status: Joi.string().required(),

  priority: Joi.string(),

  type: Joi.string().required(),

  agreedDate: Joi.date().max("now"),

  openedDate: Joi.date(),

  closingDate: Joi.date(),

  details: Joi.string(),
});

module.exports = serviceSchema;
