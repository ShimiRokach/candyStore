const Joi = require('joi');

module.exports.productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required()
});

module.exports.categorySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required()
});