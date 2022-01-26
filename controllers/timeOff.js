const { TimeOff } = require('../models/TimeOff');
const factory = require('./factory');

module.exports.getAllTimeOffs = factory.getAll(TimeOff);
module.exports.getOneTimeOff = factory.getOne(TimeOff);
module.exports.createNewTimeOff = factory.createOne(TimeOff);
module.exports.updateTimeOff = factory.updateOne(TimeOff);
module.exports.deleteTimeOff = factory.deleteOne(TimeOff);
