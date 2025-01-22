const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

const router = express.Router();

// ----- VIEW PROFILE -----
router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send(user); // Send user data as JSON
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// ----- EDIT PROFILE -----
router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;
    // console.log(loggedInUser);

    // Update fields
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // console.log(loggedInUser);

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

// ----- FORGOT PASSWORD -----
router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    res.send("password updated");
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

module.exports = router;
