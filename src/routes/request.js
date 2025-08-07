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

      const userExist = await User.findById(toUserId);
      if (!userExist) {
        return res.status(404).send("User not found");
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          {
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: "interested",
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
            status: "interested",
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

module.exports = requestRouter;
