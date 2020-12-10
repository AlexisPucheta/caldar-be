const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const serviceSchema = Joi.object({
  boiler: Joi.objectId().required(),

  technician: Joi.objectId(),

  status: Joi.string()
    .valid("need assignment", "assigned", "on progress", "completed")
    .required(),

  priority: Joi.string().valid("high", "normal"),

  type: Joi.string().valid("eventually", "monthly").required(),

  agreedDate: Joi.date().max("now"),

  openedDate: Joi.date(),

  closingDate: Joi.date(),

  details: Joi.string(),
});

module.exports = serviceSchema;
