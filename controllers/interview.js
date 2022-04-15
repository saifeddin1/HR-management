const { Interview } = require('../models/Interview');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const mongoose = require('mongoose')

// module.exports.getAllInterviews = factory.getAll(Interview);
module.exports.getOneInterview = factory.getOne(Interview);
module.exports.createNewInterview = factory.createOne(Interview);
module.exports.updateInterview = factory.updateOne(Interview);
module.exports.deleteInterview = factory.deleteOne(Interview);
module.exports.getEmployeeInterviews = factory.getEmployeeThing(Interview);



module.exports.getAllInterviews = async (req, res) => {
    var aggregation = aggregationWithFacet()

    logger.debug("Incomoing aggregation interviews: ", aggregation);
    aggregation.unshift(
        {
            '$match': {
                enabled: true
            }
        }
    )

    aggregation.unshift(
        {
            '$lookup': {
                'from': 'files',
                'let': {
                    'localUserId': '$userId' // Id of the current file
                },
                // 'localField': '_id',
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$localUserId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            userRef: 1
                        }
                    }
                ],
                'as': 'user'
            }
        },
        {
            "$unwind": {
                "path": "$user"
            }
        }
    )

    try {
        const interviews = await Interview.aggregate(aggregation);

        logger.debug(interviews);
        return !interviews
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: interviews,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getAllinterviews() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}


module.exports.getUpcomingInterviews = async (req, res) => {
    const userId = getCurrentUserId(req, res);
    const currentDate = new Date();

    var aggregation = aggregationWithFacet(req, res);
    aggregation.unshift({
        '$match': {
            userId: mongoose.Types.ObjectId(userId),
            date: { '$gte': currentDate },
            enabled: true
        }
    })
    try {
        const upcomingInterviews = await Interview.aggregate(aggregation);


        return !upcomingInterviews
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: upcomingInterviews,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in upcomingInterviews() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}








const uploadFile = require("../middlewares/upload");
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { Mongoose } = require('mongoose');
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
