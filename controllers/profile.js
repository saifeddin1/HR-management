const {Profile} = require('../models/Profile');
const factory = require('./factory');

module.exports.getAllProfiles = factory.getAll(Profile);
module.exports.getOneProfile = factory.getOne(Profile);
module.exports.createNewProfile = factory.createOne(Profile);
module.exports.updateProfile = factory.updateOne(Profile);
module.exports.deleteProfile = factory.deleteOne(Profile);

