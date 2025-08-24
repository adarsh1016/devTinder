const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const { User } = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const validStatuses = ["interested", "ignored"];
      if (!validStatuses.includes(status)) {
        return res.status(400).send("Invalid status provided");
      }

      const receiverExist = await User.findById(toUserId);
      if (!receiverExist) {
        return res.status(404).send("User not found");
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnection) {
        return res.status(400).send("Connection request already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.send(` ${req.user.firstName} ${status} ${userExist.firstName}`);
    } catch (err) {
      res
        .status(400)
        .send("Error while sending connection request: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user._id;
      const { status, requestId } = req.params;

      const validStatuses = ["accepted", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status is not valid",
        });
      }

      if (loggedInUser.equals(requestId)) {
        return res
          .status(401)
          .send(`Sender is not allowed to approve the request`);
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({ message: "User not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.send(`Connection Request ${status}`);
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
