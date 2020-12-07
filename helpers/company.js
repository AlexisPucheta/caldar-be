const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const companySchema = Joi.object(
    {
        CIN: Joi.number().required(),

        name: Joi.string().required(),

        adress: Joi.string().required(),

        zipcode: Joi.string().required(),

        contact: Joi.string().required(),

        email: Joi.string().required(),

        phone: Joi.number().required(),

        building: Joi.array().items(Joi.objectId()),
    }
);

module.exports = companySchema