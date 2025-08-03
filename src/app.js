const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./model/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Adarsh",
    lastName: "Jaiswal",
    password: "adarsh@1234",
  });

  try {
    await user.save();
    res.send("User added successfullt..");
  } catch (err) {
    res.status(400).send("eroor while adding user: ");
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
