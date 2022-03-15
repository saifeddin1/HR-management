const { Interview } = require('../models/Interview');
const factory = require('./factory');

module.exports.getAllInterviews = factory.getAll(Interview);
module.exports.getOneInterview = factory.getOne(Interview);
module.exports.createNewInterview = factory.createOne(Interview);
module.exports.updateInterview = factory.updateOne(Interview);
module.exports.deleteInterview = factory.deleteOne(Interview);
module.exports.getEmployeeInterviews = factory.getEmployeeThing(Interview);

const uploadFile = require("../middlewares/upload");
module.exports.upload = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file?.originalname,
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file?.originalname}. ${err}`,
        });
    }
};
module.exports.getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }
        let fileInfos = [];
        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
        });
        res.status(200).send(fileInfos);
    });
};
module.exports.download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};
