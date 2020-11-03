const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    city: {
      type: String,
      minLength: 7,
    },
    state: {
      type: String,
      minLength: 7,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 8, function (err, result) {
      user.password = result;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.generateAuthToken = function () {
  // Generate an auth token for the user
  return new Promise((accept, reject) => {
    const user = this;
    const token = jwt.sign({ _id: user._id }, config.jwt.key);
    user.tokens = user.tokens.concat({ token });
    user.save(function (err, success) {
      if (err) return reject(err);
      return accept(token);
    });
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  return new Promise((accept, reject) => {
    User.findOne({ email }, function (err, user) {
      if (!user) {
        reject("invalid credentials");
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) return accept(user);
          return reject("invalid credentials");
        });
      }
    });
  });
};

userSchema.statics.findByEmail = function (email) {
  return new Promise((accept, reject) => {
    User.findOne({ email: email }, function (err, user) {
      if (!user) {
        reject("invalid credentials");
      }
      return accept(user);
    });
  });
};

const User = mongoose.model("users", userSchema);

module.exports = User;
