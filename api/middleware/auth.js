const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const db = require("../database/connection");
const config = require("../config");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, config.jwt.key);

    await db.connect();
    const user = await Users.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Not authorized to access this resource" });
  }
};
module.exports = auth;
