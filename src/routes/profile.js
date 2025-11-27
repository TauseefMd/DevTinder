const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowed = validateEditProfileData(req);
    if (!isAllowed) {
      throw new Error("Invalid Edit Request!!!");
    }
    const user = req.user;
    Object.keys(req.body).forEach((field) => (user[field] = req.body[field]));
    await user.save();
    res.send({
      message: `${user.firstName}, your profile is updated!!!`,
      user: user,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { newPassword, reEnterPassword } = req.body;
    if (newPassword !== reEnterPassword) {
      throw new Error("Password didn't match!!!");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Please enter a strong password");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Password updated successfully!!!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
