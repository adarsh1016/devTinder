const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //logic for sending the connections request

    console.log("sending the connecton request");

    res.send(`${user.firstName} has sent you a connection request`);
  } catch (err) {
    res
      .status(400)
      .send("Error while sending connection request: " + err.message);
  }
});

module.exports = requestRouter;
