var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });


// module.exports.auth = (req, res, next) => {

//     const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET, { algorithms: ["HS256"] })
//     req.user = decoded;
//     jwt.verify(req.headers.authorization, process.env.JWT_SECRET, { algorithms: ['HS256'] })
//     next();
// }


module.exports.auth = (req, res, next) => {
    // const accessToken = req.headers["x-access-token"];
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    req.user = decoded.user;
    console.log("⚡ req.user", req.user)
    jwt.verify(accessToken, process.env.JWT_SECRET)
    next();
}