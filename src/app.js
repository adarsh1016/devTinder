const express=require("express");
const app = express();
const {adminAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send("Admin Data are sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("User deleted successfully");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
