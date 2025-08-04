const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;
    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }
    const token = await jwt.sign({ _id: user._id }, "secretKey");
    res.cookie("authToken", token);
    res.send("Login successfully");
  } catch (err) {
    res.status(400).send("Error while logging in: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // Access the user from the request object
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while fetching profile: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = req.user; // Access the user from the request object
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }
    // Here you would typically add logic to send a connection request
    res.send(`Connection request sent to ${targetUser.firstName}`);
  } catch (err) {
    res
      .status(400)
      .send("Error while sending connection request: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to the database successfully..");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Unable to connect to the database!!");
  });
