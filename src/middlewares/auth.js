//middleware is a function that has access to the request object (req), the response object (res), and the next middleware function in the request-response cycle.
const jwt = require("jsonwebtoken");
const { User } = require("../model/user");
const userAuth = async (req, res, next) => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      throw new Error("No token provided");
    }
    const decodedDataObject = await jwt.verify(authToken, "secretKey");
    const { _id } = decodedDataObject;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user to request object
    next(); // Call the route handler
  } catch (err) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

module.exports = { userAuth };
