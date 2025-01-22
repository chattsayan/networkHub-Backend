const mongoose = require("mongoose");

// creating connection b/w mongo db & Node
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sayan:XE65NbqpdasC3sa7@cluster0.rrkxe.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
