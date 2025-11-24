const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = req.body;
    if (data.skills && data.skills.length > 10) {
      throw new Error("you can add a maximum of 10 skills.");
    }

    // Creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userData = await User.findOne({ emailId: emailId });
    if (!userData) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await userData.validatePassword(password);
    if (isPasswordValid) {
      const token = await userData.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

// Get User by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.send("No user found having mail id : " + req.body.emailId);
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong!! " + error.message);
  }
});

// Feed API - Get /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const allUser = await User.find();
    res.send(allUser);
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

// Delete a user from database
app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);
    res.send("User deleted successfully!!!");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

// Update data of the user
// API Level validation - donot allow user to update userId, emailId, firstName and add limit to number skills
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedUpdates = ["age", "gender", "photoUrl", "about", "skills"];
    const isValidUpdate = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isValidUpdate) {
      throw new Error(
        "Update could not be completed as the requested change is not allowed."
      );
    }
    if (data.skills && data.skills.length > 10) {
      throw new Error("you can add a maximum of 10 skills.");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully!!!");
  } catch (error) {
    res.status(400).send("Error updating the user: " + error.message);
  }
});

// Update the user with email ID

connectDB()
  .then(() => {
    console.log("Successfully connected to Database....");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000.......");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!!!");
    console.log(err);
  });
