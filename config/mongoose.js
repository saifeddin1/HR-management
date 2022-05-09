// const mongoose = require('mongoose');
// const { logger } = require('../config/logger');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGOMONGODB_URI);
//   } catch (e) {
//     console.error(e.message);
//     logger.info(
//       '%s MongoDB connection error. Please make sure MongoDB is running.',
//     );
//     // Exit process with failure
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connection Router");
  console.log("MongoDB connected!");
  console.log(`Your port is ${process.env.PORT}`);
});

exports.connection = connection;
