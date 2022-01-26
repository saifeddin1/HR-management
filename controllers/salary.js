const {Salary} = require('../models/Salary');
const factory = require('./factory');

module.exports.getAllSalarys = factory.getAll(Salary);
module.exports.getOneSalary = factory.getOne(Salary);
module.exports.createNewSalary = factory.createOne(Salary);
module.exports.updateSalary = factory.updateOne(Salary);
module.exports.deleteSalary = factory.deleteOne(Salary);

