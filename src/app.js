const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;

  try {
    const users = await User.find({ emailID: userEmail });
    if (users.length == 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length == 0) {
      res.status(404).send("No records found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    console.log(cookies);
    const { authToken } = cookies;
    if (!authToken) {
      throw new Error("No token provided");
    }
    const decodeMessage = await jwt.verify(authToken, "secretKey");
    const _id = decodeMessage._id;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error while fetching profile: " + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong..");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedUpdates = ["about", "gender", "age", "skills"];
    const isAllowed = Object.keys(data).every((key) =>
      allowedUpdates.includes(key)
    );
    if (!isAllowed) {
      throw new Error("Invalid updates provided");
    }
    if (req.body.skills.length > 5) {
      throw new Error("Skills should not exceed 5 items");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("Data updated succcessfuylly");
  } catch (err) {
    res.status(400).send("Something went wrong.." + err.message);
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
