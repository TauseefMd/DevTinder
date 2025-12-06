const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;
    if (!token) {
      return res.status(401).send("Please Login!!");
    }
    const decodedData = await jwt.verify(token, process.env.SECRET_KEY);
    const id = decodedData._id;
    if (!id) {
      throw new Error("Invalid User Id!!!!!");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User does not Exist!!!!!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};

module.exports = { userAuth };
