const File = require('../models/File');
const { Types } = require('mongoose');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const mongoose = require('mongoose')
const { matchQuery } = require('../utils/matchQuery');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { getCurrentUserId } = require('../utils/getCurrentUser');


module.exports.getAllFiles = factory.getAll(File);
module.exports.getOneFile = factory.getOne(File);
module.exports.createNewFile = factory.createOne(File);
module.exports.updateFile = factory.updateOne(File);
module.exports.deleteFile = factory.deleteOne(File);


// same as getEmployees 
module.exports.getCollaborators = async (req, res) => {
    // const userId = req.user?.id;
    const userId = getCurrentUserId(req, res);
    console.log("⚡ ~ file: file.js ~ line 22 ~ module.exports.getCollaborators= ~ userId", userId)

    var aggregation = aggregationWithFacet(req, res);
    logger.info("req.userid", userId);
    var query = [

        { userRef: { '$ne': userId } }
    ]
    var ObjectId = require('mongoose').Types.ObjectId;
    if (typeof userId == "string" && ObjectId.isValid(userId)) {// userId is a valid objectId
        query.push({ userId: { '$ne': mongoose.Types.ObjectId(userId) } },)
    }
    aggregation.unshift(
        {
            '$match': {
                '$and': query
            }
        }
    )
    try {

        logger.info("aggregation : ", aggregation)

        const objects = await File.aggregate(aggregation) // 
        logger.info("result : ", objects)


        res.status(200).json({
            response: objects,
            message: objects?.length ? req.t("SUCCESS.RETRIEVED") : req.t("ERROR.NOT_FOUND")
        })
    } catch (e) {
        logger.error(`Error in getAllWithQueries() function : ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }



}


// Manage employees files for admin 
//   Working ✅
module.exports.updateEmployeeFileDetails = async (req, res) => {
    const updates = Object.keys(req.body);
    // const userId = req?.user?.id;
    const userId = getCurrentUserId(req, res);

    var query = {};
    try {

        for (var key in req.body) {
            if (req.body[key] && req.body[key].length) {
                query["profile." + key] = req.body[key];
            }
        }
        console.log("\n\n req body : ", req.body, "\n\n")
        const object = await File.updateOne({ userId: mongoose.Types.ObjectId(userId) }, { $set: query });
        logger.info('found object! : ', object)
        if (!object) return res.sendStatus(404);
        logger.info('saved object! : ', object)
        return res.json(
            {
                response: object,
                message: req.t("SUCCESS.EDITED")
            }
        );

    } catch (e) {
        logger.error(`Error in updateEmployeeFileDetails() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }
}

// Working ✅
module.exports.getEmployeeFileDetails = async (req, res) => {
    // const userId = req.user?.id
    const userId = getCurrentUserId(req, res);


    var query = matchQuery(userId);

    var aggregation = [
        {
            '$match': {
                '$or': query
            }
        }
    ]

    logger.debug("Incomoing aggregation: ", aggregation);

    if (req?.query?.full) {
        aggregation.unshift(
            {
                '$lookup': {
                    'from': 'contracts',
                    // 'let': {
                    //     'fileId': '$_id' // Id of the current file
                    // },
                    'pipeline': [
                        {
                            '$match': {
                                '$or': query
                            }
                        },
                        {
                            '$project': {
                                contractType: 1,
                                hoursNumber: 1,
                                startDate: 1
                            }
                        }
                    ],
                    'as': 'contracts'
                }
            },
            {
                '$lookup': {
                    'from': 'timesheets',
                    'let': {
                        'fileId': '$_id' // Id of the current file
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$file', '$$fileId'
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            '$project': {
                                today: 1,
                                week: 1,
                                tasks: 1,
                                note: 1,
                            }
                        }
                    ],
                    'as': 'timesheet'
                }
            },
            {
                '$lookup': {
                    'from': 'timeoffs',
                    'let': {
                        'fileId': '$_id' // Id of the current file
                    },
                    // 'localField': '_id',
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$file', '$$fileId'
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            '$project': {
                                startDate: 1,
                                offDays: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                status: 1,
                            }
                        }
                    ],
                    'as': 'timeoff_requests'
                }
            }
        )
    }

    try {
        const object = await File.aggregate(aggregation);

        logger.debug(object);
        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getEmployeeFileDetails() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") })
    }

}

// Working ✅
module.exports.deleteEmployeeFileDetails = async (req, res) => {
    // const userId = req?.user?.id;
    const userId = getCurrentUserId(req, res);

    try {
        // const object = await File.aggregate(aggregation).deleteOne();
        const object = await File.findOne({ userId: mongoose.Types.ObjectId(userId) });
        logger.info(object);
        object.enabled ? object.enabled = false : res.status(403).json({ message: req.t("ERROR.FORBIDDEN") });
        object.save();
        return !object ? res.send(404) : res.json(
            {
                response: object,
                message: req.t("SUCCESS.DELETED")
            }
        );
    } catch (e) {
        logger.error(`Error in deleteEmployeeFileDetails() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}


module.exports.getAllFilesWithQuries = async (req, res) => {
    // const userId = req.user.id
    const userId = getCurrentUserId(req, res);

    try {
        var aggregation = aggregationWithFacet(req, res);


        if (req?.query?.withContracts) {
            aggregation.unshift(
                // { '$match': { enabled: true } },
                {
                    '$lookup': {
                        'from': 'contracts',
                        'let': {
                            'user': '$userId' // Id of the current file
                        },
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$and': [
                                            {
                                                '$eq': [
                                                    '$userId', '$$user'
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                '$project': {
                                    contractType: 1,
                                    hoursNumber: 1,
                                    startDate: 1
                                }
                            }
                        ],
                        'as': 'contracts'
                    }
                })
        }


        logger.info("aggregation : ", aggregation)

        const objects = await File.aggregate(aggregation)
        logger.info("result : ", objects);

        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? req.t("SUCCESS.RETRIEVED") : req.t("ERROR.NOT_FOUND")
        })
    } catch (e) {
        logger.error(`Error in getAllWithQueries() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }
}



