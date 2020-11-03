const Joi = require("joi");

const schema = Joi.object().keys({
  email: Joi.string().allow(null, ""),
  userName: Joi.string().allow(null, ""),
  password: Joi.string()
    .regex(RegExp(/[a-zA-Z0-9]/))
    .required(),
});

module.exports = schema;
