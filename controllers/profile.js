const { Profile } = require('../models/Profile');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const mongoose = require('mongoose')

module.exports.getAllProfiles = factory.getAll(Profile);
module.exports.getOneProfile = factory.getOne(Profile);
module.exports.createNewProfile = factory.createOne(Profile);
module.exports.updateProfile = factory.updateOne(Profile);
module.exports.deleteProfile = factory.deleteOne(Profile);


