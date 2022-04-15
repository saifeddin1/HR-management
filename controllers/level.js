const Level = require('../models/Level');
const factory = require('./factory');

module.exports.getAllLevels = factory.getAll(Level);
module.exports.getOneLevel = factory.getOne(Level);
module.exports.createNewLevel = factory.createOne(Level);
module.exports.updateLevel = factory.updateOne(Level);
module.exports.deleteLevel = factory.deleteOne(Level);