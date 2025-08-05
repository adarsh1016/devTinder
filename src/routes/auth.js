const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { User } = require("../model/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //Validate the request
    validateSignUpData(req);

    //Encrypt the password
    const { firstName, lastName, emailID, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
    });

    //Save the user to the database
    await user.save();
    res.send("User added successfullt..");
  } catch (err) {
    res.status(400).send("eroor while adding user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;
    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    const token = await user.getJWT();
    res.cookie("authToken", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send("Login successfully");
  } catch (err) {
    res.status(400).send("Error while logging in: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("authToken", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});

module.exports = authRouter;
