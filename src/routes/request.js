const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status!!!!!");
      }

      const validateToUserId = await User.findById(toUserId);
      if (!validateToUserId) {
        throw new Error("User not valid!!!!!");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Already request sent!!!");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await newConnectionRequest.save();

      res.json({
        message:
          user.firstName +
          " sent the " +
          status +
          " request to " +
          validateToUserId.firstName +
          "!!!!!",
        data,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Failed to send the request", Error: error.message });
    }
  }
);

module.exports = requestRouter;
