const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Sachin",
    lastName: "Tendulkar",
    emailId: "sachin@gmail.com",
    password: "sachin@123",
  });

  try {
    await user.save();
    res.send("User added successfully!");
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
