const File = require('../models/File');
const { Types } = require('mongoose');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const mongoose = require('mongoose')
const { matchQuery } = require('../utils/matchQuery');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { getCurrentUserId } = require('../utils/getCurrentUser');


// module.exports.getAllFiles = factory.getAll(File);
module.exports.getOneFile = factory.getOne(File);
module.exports.createNewFile = factory.createOne(File);
module.exports.updateFile = factory.updateOne(File);
module.exports.deleteFile = factory.deleteOne(File);


module.exports.getAllFiles =
    async (req, res) => {

        let filterValue = ''
        var aggregation = aggregationWithFacet(req, res);
        aggregation.unshift({
            $match: {
                enabled: true
            }
        })

        if (req.query?.filter) {
            filterValue = req.query.filter
            console.log(filterValue)
            aggregation.unshift(
                {
                    $match: {
                        $or: [
                            { userRef: { $regex: filterValue, $options: 'i' } },


                            { 'profile.fullname': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.phone': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.address': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.position': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.departement': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.proEmail': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.workFrom': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.seniorityLevel': { $regex: filterValue, $options: 'i' } },

                        ]
                    }
                }
            )
        }
        try {
            const files = await File.aggregate(aggregation)
            if (!files || !files.length) return res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            res.status(200).json({
                response: files,
                message: req.t("SUCCESS.RETRIEVED")
            })
        } catch (e) {
            logger.error(`Error in getAllFiles() function`, e)
            return res.status(400).json({
                message: req.t("ERROR.BAD_REQUEST")
            });
        }


    }


// same as getEmployees 
module.exports.getCollaborators = async (req, res) => {
    // const userId = req.user?.id;
    const userId = getCurrentUserId(req, res);
    logger.info("⚡ ~ file: file.js ~ line 22 ~ module.exports.getCollaborators= ~ userId", userId)

    var aggregation = aggregationWithFacet(req, res);
    logger.info("req.userid", userId);
    var query = [

        {
            userRef: {

                '$not': { '$regex': 'ESTUDENT', '$options': 'i' }

            },
            enabled: true,

        }
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
    const allowed_updates = ['phone', 'address', 'proEmail', 'description', 'fullname']
    const userId = getCurrentUserId(req, res);
    const fileId = req.params.fileId
    // logger.info("$$$$$ req body : ", req.body, "$$$$$")
    var query = {};
    try {

        // for nested profile fileds
        for (var key of allowed_updates) {
            // make sure key is not undefined and/or an empty string
            if (req.body['profile'][key] && req.body['profile'][key].length) {
                query["profile." + key] = req.body['profile'][key];
            }
        }
        logger.info("$$$$ Query:", query)
        // const object = await File.updateOne({ userId: mongoose.Types.ObjectId(userId) }, { $set: query });
        const object = await File.findByIdAndUpdate({ _id: fileId }, { $set: query });
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

module.exports.updateEmployeeFileAsAdmin = async (req, res) => {
    const file_id = req.params.file_id;
    const { _id, createdAt, updatedAt, ...profile_fields } = req.body.profile
    if (req.body?.timeOffBalance < 0 || req.body?.timeOffBalance > 30) {
        return res.status(400).json({ message: "Timeoff Balance should be in 0 .. 30 ." })
    }


    var query = { userRef: req.body.userRef, timeOffBalance: req.body.timeOffBalance };
    console.log("\n\n\n req body:", req.body)
    try {

        // for nested profile fileds
        for (var key in profile_fields) {
            if (req.body['profile'][key] && req.body['profile'][key].length) {
                query["profile." + key] = req.body['profile'][key];
            }
        }
        console.log("\n\n\n Query:", query)
        // const file = await File.updateOne({ _id: mongoose.Types.ObjectId(file_id) }, { $set: query });
        const file = await File.findByIdAndUpdate({ _id: file_id }, { $set: query });

        logger.info('found file! : ', file)
        if (!file) return res.sendStatus(404);
        logger.info('saved file! : ', file)
        return res.json(
            {
                response: file,
                message: req.t("SUCCESS.EDITED")
            }
        );

    } catch (e) {
        logger.error(`Error in updateEmployeeFileAsAdmin() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
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
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
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
        object.enabled ? object.enabled = false : res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
        object.save();
        return !object ? res.send(404) : res.json(
            {
                response: object,
                message: req.t("SUCCESS.DELETED")
            }
        );
    } catch (e) {
        logger.error(`Error in deleteEmployeeFileDetails() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
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
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
    }
}

module.exports.getOneByUserId = async (req, res) => {
    const paramUserId = req.params?.userId;

    try {
        const oneFile = await File.findOne({ userId: paramUserId })
        return !oneFile
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: oneFile,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getEmployeeFileDetails() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }

}
