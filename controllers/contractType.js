const ContractType = require('../models/ContractType');
const factory = require('./factory');
// const logger = require('../config/logger').logger;
// const { matchQuery } = require('../utils/matchQuery');
// const { getCurrentUserId } = require('../utils/getCurrentUser');
// const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
// const mongoose = require('mongoose')



module.exports.getAllContractTypes = factory.getAll(ContractType);
module.exports.getOneContractType = factory.getOne(ContractType);
module.exports.createNewContractType = factory.createOne(ContractType);
module.exports.updateContractType = factory.updateOne(ContractType);
module.exports.deleteContractType = factory.deleteOne(ContractType);
// module.exports.getEmployeeContractTypes = factory.getEmployeeThing(ContractType);
