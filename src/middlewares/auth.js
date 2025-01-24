const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // ----- READING COOKIE -----
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    // ----- VALIDATING TOKEN -----
    const decryptMessage = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    const { _id } = decryptMessage;

    // ----- FETCHING USER -----
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }

    req.user = user; // Attach user to request object for use in subsequent handlers
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).send(`Authentication Error: ${err.message}`);
  }
};

module.exports = { userAuth };
