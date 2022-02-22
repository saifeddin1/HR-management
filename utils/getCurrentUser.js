const logger = require('../config/logger').logger

module.exports.getCurrentUserId = (req, res) => {
    logger.info('😁😁😁😁', req.user)
    return req.user._id
}