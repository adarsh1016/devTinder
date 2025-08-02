//middleware is a function that has access to the request object (req), the response object (res), and the next middleware function in the request-response cycle.

const adminAuth = (req, res, next) => {
    console.log("handling admin authentication");
    const token = "xyz";
    const isAuthenticated = token === "xyz";
    if (!isAuthenticated) {
        return res.status(401).send("Unauthorized");
    }
    next();
};

module.exports = {adminAuth};