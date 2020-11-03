const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
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
    tags: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;