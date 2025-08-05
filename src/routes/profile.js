const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access the user from the request object
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while fetching profile: " + err.message);
  }
});

module.exports = profileRouter;
