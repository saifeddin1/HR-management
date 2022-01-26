const {TimeSlot} = require('../models/TimeSlot');

const factory = require('./factory');

module.exports.getAllTimeSlots = factory.getAll(TimeSlot);
module.exports.getOneTimeSlot = factory.getOne(TimeSlot);
module.exports.createNewTimeSlot = factory.createOne(TimeSlot);
module.exports.updateTimeSlot = factory.updateOne(TimeSlot);
module.exports.deleteTimeSlot = factory.deleteOne(TimeSlot);
