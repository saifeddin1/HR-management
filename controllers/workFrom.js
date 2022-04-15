const WorkFrom = require('../models/WorkFrom');
const factory = require('./factory');

module.exports.getAllWorkFroms = factory.getAll(WorkFrom);
module.exports.getOneWorkFrom = factory.getOne(WorkFrom);
module.exports.createNewWorkFrom = factory.createOne(WorkFrom);
module.exports.updateWorkFrom = factory.updateOne(WorkFrom);
module.exports.deleteWorkFrom = factory.deleteOne(WorkFrom);