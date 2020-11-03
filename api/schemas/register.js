const Joi = require("joi");

const schema = Joi.object().keys({
  fullName: Joi.string().max(30).required(),
  userName: Joi.string().min(5).max(30).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .regex(RegExp(/[a-zA-Z0-9]/))
    .required()
    .min(8),
  city: Joi.string(),
  state: Joi.string(),
});

module.exports = schema;
