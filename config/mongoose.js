const mongoose = require('mongoose');
const { logger } = require('../config/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.error(e.message);
    logger.info(
      '%s MongoDB connection error. Please make sure MongoDB is running.',
    );
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
