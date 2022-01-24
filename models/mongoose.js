const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB setup.
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useNewUrlParser', true);
    // mongoose.set('useUnifiedTopology', true);
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (e) {
    console.error(e.message);
    console.log(
      '%s MongoDB connection error. Please make sure MongoDB is running.',
    );
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
