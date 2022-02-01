var jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
    const decoded = jwt.verify(req.headers.authorization, 'topsecret', { algorithms: ['HS256'] })
    // console.log("user ID: ", decoded);
    // localStorage.setItem("user", decoded)
    req.user = decoded;
    jwt.verify(req.headers.authorization, 'topsecret', { algorithms: ['HS256'] })
    next();
}