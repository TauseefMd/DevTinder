const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter a valid emailId : " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter strong password : " + value);
        }
      },
    },
    age: {
      type: String,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        messae: `{VALUE is not a valid gender type}`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a valid photo url : " + value);
        }
      },
    },
    about: {
      type: String,
      default: "Hey there! I am using Dev Tinder....",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Donot use Arrow function here -> Arrow function will not work here
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "7h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHashed = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHashed
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
