const { Interview } = require('../models/Interview');
const factory = require('./factory');

module.exports.getAllInterviews = factory.getAll(Interview);
module.exports.getOneInterview = factory.getOne(Interview);
module.exports.createNewInterview = factory.createOne(Interview);
module.exports.updateInterview = factory.updateOne(Interview);
module.exports.deleteInterview = factory.deleteOne(Interview);
module.exports.getEmployeeInterviews = factory.getEmployeeThing(Interview);


