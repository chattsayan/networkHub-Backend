const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

// ----- SIGNUP -----
router.post("/signup", async (req, res) => {
  try {
    // the moment user signup below things to happen:
    // (1). Validation of User, without which not to proceed
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    // (2). Encrypt Password using bcrypt library
    const encryptPassword = await bcrypt.hash(password, 10);

    // (3). then only store user into DB
    // creating new user
    // const user = new User(req.body); - using previously
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res
      .status(201)
      .json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send(`SignUp Error: ${err.message}`);
  }
});

// ----- LOGIN -----
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid Credentials.");
    }

    // user.password is the hash parameter
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // create a JWT token
      // const token = jwt.sign({ _id: user._id }, "DEV@Tinder$123", { expiresIn: "1h" });
      const token = await user.getJWT();
      // console.log(token);

      // add the token to cookie and send response back to the user
      // res.cookie("token", "cjsdcbkje3qi989qfiuncwi8qiun");
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      // res.status(200).send("Login Successful!!!");
      res.status(200).send(user);
    } else {
      throw new Error("Invalid Credentials.");
    }
  } catch (err) {
    res.status(401).send(`Login Error: ${err.message}`);
  }
});

// ----- LOGOUT -----
router.post("/logout", async (req, res) => {
  // chain method
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successful");
});

module.exports = router;
