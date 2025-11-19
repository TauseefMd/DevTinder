const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
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
    console.log(allUser);
    res.send(allUser);
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

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
