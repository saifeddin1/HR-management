const logger = require('../config/logger').logger;
const mongoose = require('mongoose');

module.exports.matchQuery = (param) => {

    logger.debug(param);
    var query = [

        { userRef: { '$regex': param, '$options': 'i' } }
    ]
    var ObjectId = mongoose.Types.ObjectId;
    if (typeof param == "string" && ObjectId.isValid(param)) {// param is a valid objectId
        query.push({ _id: mongoose.Types.ObjectId(param) }, { userId: { '$eq': mongoose.Types.ObjectId(param) } },)
    }

    logger.debug("Build query: ", query);

    return query;
}