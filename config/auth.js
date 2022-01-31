var jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
    jwt.verify(req.headers.authorization, 'topsecret', { algorithms: ['HS256'] })
    next();
}