const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestmodel = require("../model/connectionRequest");
const { User } = require("../model/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestmodel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    const data = connectionRequest.map((row) => row.fromUserId);
    res.status(200).send({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestmodel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.send(data);
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestmodel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId._id);
      hideUserFromFeed.add(req.toUserId._id);
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send(`Error: ${err.message}`);
  }
});

module.exports = userRouter;
