var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const logger = require('./logger').logger

dotenv.config({ path: '.env' });

module.exports.auth = (req, res, next) => {
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    req.user = decoded;
    logger.info("🔥🔥 req.user🔥🔥", req.user)
    jwt.verify(accessToken, process.env.JWT_SECRET)
    next();
}