const express=require("express");
const app = express();

app.use("/admin", (req, res, next) => {
    console.log("handling admin authentication");
    const token = "xyz";
    const isAuthenticated = token === "xyz";
    if (!isAuthenticated) {
        return res.status(401).send("Unauthorized");
    }
    next();
});

app.get("/admin/getAllData", (req, res) => {
    res.send("Admin Data are sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("User deleted successfully");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
