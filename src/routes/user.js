const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/requests/recevived", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: logedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills"
    );

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error recieving user request!!",
      error: error.message,
    });
  }
});

module.exports = userRouter;
