const { Contract } = require('../models/Contract');
const factory = require('./factory');


module.exports.getAllContracts = factory.getAll(Contract);
module.exports.getOneContract = factory.getOne(Contract);
module.exports.createNewContract = factory.createOne(Contract);
module.exports.updateContract = factory.updateOne(Contract);
module.exports.deleteContract = factory.deleteOne(Contract);
module.exports.getEmployeeContracts = factory.getEmployeeThing(Contract);
