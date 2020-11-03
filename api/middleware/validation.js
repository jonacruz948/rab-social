const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    console.log(error);
    if (!valid) {
      const message = error.details.map((i) => i.message).join(",");
      res.status(422).send({ result: 1, message });
    } else {
      next();
    }
  };
};

module.exports = validation;
