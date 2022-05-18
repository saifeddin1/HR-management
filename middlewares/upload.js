// const util = require("util");
// const multer = require("multer");
// const maxSize = 2 * 1024 * 1024;
// const GridFsStorage = require('multer-gridfs-storage')
// const Grid = require('gridfs-stream');
// // const connectDB = require("../config/mongoose");
// const mongoose = require('mongoose')


// const conn = mongoose.createConnection('mongodb+srv://sifo:django123@learnmongo.ce0cz.mongodb.net/hr?retryWrites=true&w=majority');

// let gfs;
// conn.once('open', () => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads')
// })

// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, __basedir + "/resources/static/assets/uploads/");
//     },
//     filename: (req, file, cb) => {
//         console.log(file?.originalname, "********************");
//         cb(null, file?.originalname);
//     },
// });
// let uploadFile = multer({
//     storage: storage,
//     limits: { fileSize: maxSize },
// }).single("file");
// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;