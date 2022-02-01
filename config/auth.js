var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });


module.exports.auth = (req, res, next) => {
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    req.user = decoded;
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    next();
}