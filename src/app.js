const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const app = express();

app.use(express.json());

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
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfullt..");
  } catch (err) {
    res.status(400).send("eroor while adding user: ");
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
