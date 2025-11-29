const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recevived", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: logedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((connectionRequest) => {
      if (
        loggedInUser._id.toString() ===
        connectionRequest.fromUserId._id.toString()
      ) {
        return connectionRequest.toUserId;
      } else {
        return connectionRequest.fromUserId;
      }
    });

    res.json({
      message: "Connections fetched seccessfully!!",
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error getting connection request!!",
      error: error.message,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pageNum = req.query.pageNum;
    const limit = req.query.limit;
    const skip = (pageNum - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feed data fetched successfully!!!",
      data: feedData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error getting feed!!",
      error: error.message,
    });
  }
});

module.exports = userRouter;
