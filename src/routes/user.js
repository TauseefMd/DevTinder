const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

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
      message: "Error etting connection request!!",
      error: error.message,
    });
  }
});

module.exports = userRouter;
