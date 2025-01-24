const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/email/sendEmail");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.params;

    // Validating the Status
    const allowedStatus = ["ignore", "interested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid Status Type: ${status}` });
    }

    // Checking if toUserId Exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Checking for Existing Connection Requests
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .send({ message: "Connection request already exists" });
    }

    // Creating a New Connection Request
    const connectRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectRequest.save();

    // ----- SEND EMAIL -----
    const emailRes = await sendEmail.run(
      `${req.user.firstName} sent you a connect request`,
      `${req.user.firstName} is ${status} in you.`
    );
    // console.log(emailRes);

    res.status(201).json({
      message: "Connection request sent successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // getting loggedIn user
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Validating the Status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // Validating the requestId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({ message: `Connection request ${status}`, data });
    } catch (err) {
      res.status(400).json({ message: "Connection request not found" });
    }
  }
);

module.exports = router;
