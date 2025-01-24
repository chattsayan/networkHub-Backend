const mongoose = require("mongoose");

// creating connection b/w mongo db & Node
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

module.exports = connectDB;
