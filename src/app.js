const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

// ----- MIDDLEWARE -----
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ----- IMPORT ROUTER -----
const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

// ----- using ROUTER -----
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// ----- CONNECT TO DATABASE -----
connectDB()
  .then(() => {
    console.log("DB Connection Established...");

    // ----- LISTENING TO SERVER -----
    app.listen(process.env.PORT, () => {
      console.log(
        `server is successfully listening on port ${process.env.PORT}...`
      );
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed- ", err);
  });
