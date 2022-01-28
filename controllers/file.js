const File = require('../models/File');
const Profile = require('../models/Profile');
const { Types } = require('mongoose');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const { aggregate } = require('../models/File');
const mongoose = require('mongoose')

module.exports.getAllFiles = factory.getAll(File);
module.exports.getOneFile = factory.getOne(File);
module.exports.createNewFile = factory.createOne(File);
module.exports.updateFile = factory.updateOne(File);
module.exports.deleteFile = factory.deleteOne(File);



// same as getEmployees 
module.exports.getCollaborators = async (req, res) => {
    var pageNumber = 0;
    if (req?.query?.page) {
        pageNumber = Number(req?.query?.page);
    }
    var limitNumber = 10;  // default value 10
    if (req?.query?.limit) {
        limitNumber = Number(req?.query?.limit);
    }
    logger.info("Method : getAllFilesWithQuries, message : building aggregation ...");
    var aggregation = [
        {
            '$facet': {
                'totalData': [
                    {
                        '$sort': { '_id': 1 }, //asc 1 // desc-1
                    },
                    {
                        '$skip': Math.floor(pageNumber * limitNumber),
                    },
                    {
                        '$limit': limitNumber,
                    },
                ],
                'totalCount': [
                    {
                        '$count': 'count'
                    }
                ]
            }
        }
    ]
    const { param } = req.params
    logger.debug(param);
    var query = [
        { userId: { '$ne': param } },
        { userRef: { '$ne': param } }
    ]
    var ObjectId = mongoose.Types.ObjectId;
    if (typeof param == "string" && ObjectId.isValid(param)) {// param is a valid objectId
        query.push({ _id: { '$ne': mongoose.Types.ObjectId(param) } })
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

        const objects = await File.aggregate(aggregation)
        logger.info("result : ", objects)
        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? `${File.modelName}s retrieved` : `No ${File.modelName}s found`
        })
    } catch (e) {
        logger.error(`Error in getAllWithQueries() function`)
        return res.status(400).send(JSON.stringify(e));
    }



}



// Manage employees files for admin 
//   Working ✅
module.exports.updateEmployeeFileDetails = async (req, res) => {
    const updates = Object.keys(req.body);

    const { id } = req?.params;
    const userId = req?.query?.userId;
    // const { param } = req.params
    // logger.debug(param);
    // var query = [
    //     { userId: { '$eq': param } },
    //     { userRef: { '$regex': param, '$options': 'i' } }
    // ]
    // var ObjectId = require('mongoose').Types.ObjectId;
    // if (typeof param == "string" && ObjectId.isValid(param)) {// param is a valid objectId
    //     query.push({ _id: mongoose.Types.ObjectId(param) })
    // }

    // var aggregation = [
    //     {
    //         '$match': {
    //             '$or': query
    //         }
    //     }
    // ]
    try {
        const object = await File.findOne({ _id: id, userId: userId });
        // const object = objects[0];
        console.log('found object! : ', object)
        if (!object) return res.sendStatus(404);
        updates.forEach(update => {
            console.log('key : ', update)
            object[update] = req.body[update];
        });

        console.log('updated object! : ', object)

        await object.save();

        console.log('saved object! : ', object)

        return res.json(
            {
                response: object,
                message: `File for employee-${userId} updated Successfuly`
            }
        );

    } catch (e) {
        logger.error(`Error in updateEmployeeFileDetails() function: ${e}`)
        return res.status(400).send(e);
    }
}

// Working ✅
module.exports.getEmployeeFileDetails = async (req, res) => {
    const { param } = req.params
    logger.debug(param);
    var query = [
        { userId: { '$eq': param } },
        { userRef: { '$regex': param, '$options': 'i' } }
    ]
    var ObjectId = require('mongoose').Types.ObjectId;
    if (typeof param == "string" && ObjectId.isValid(param)) {// param is a valid objectId
        query.push({ _id: mongoose.Types.ObjectId(param) })
    }

    var aggregation = [
        {
            '$match': {
                '$or': query
            }
        }
    ]

    if (req?.query?.full) {
        aggregation.unshift(
            {
                '$lookup': {
                    'from': 'contracts',
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
                    'from': 'profiles',
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
                                position: 1,
                                departement: 1,
                                departement: 1,
                                image: 1
                            }
                        }
                    ],
                    'as': 'profile'
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
            ? res.status(404).json({ message: `File Not Found` })
            : res.status(200).json(
                {
                    response: object,
                    message: `Employee-${param} ${object.length ? 'retrieved' : 'Not found'}`

                }
            );
    } catch (e) {
        logger.error(`Error in getEmployeeFileDetails() function`)
        return res.status(400).send(e)
    }

}

// Working ✅
module.exports.deleteEmployeeFileDetails = async (req, res) => {
    const { id } = req?.params;
    const userId = req?.query?.userId;
    // const { param } = req.params
    // logger.debug(param);
    // var query = [
    //     { userId: { '$eq': param } },
    //     { userRef: { '$regex': param, '$options': 'i' } }
    // ]
    // var ObjectId = require('mongoose').Types.ObjectId;
    // if (typeof param == "string" && ObjectId.isValid(param)) {// param is a valid objectId
    //     query.push({ _id: mongoose.Types.ObjectId(param) })
    // }

    // var aggregation = [
    //     {
    //         '$match': {
    //             '$or': query
    //         }
    //     }
    // ]
    try {
        // const object = await File.aggregate(aggregation).deleteOne();
        const object = await File.findOne({ _id: id, userId: userId });
        console.log(object);
        object.enabled = false;
        object.save();
        return !object ? res.send(404) : res.json(
            {
                response: object,
                message: `File deleted Successfuly`
            }
        );
    } catch (e) {
        logger.error(`Error in deleteEmployeeFileDetails() function`)
        return res.status(400).send(e);
    }

}


module.exports.getAllFilesWithQuries = async (req, res) => {
    try {
        logger.info("Method : getAllFilesWithQuries, message : onInit");
        var pageNumber = 0;
        if (req?.query?.page) {
            pageNumber = Number(req?.query?.page);
        }
        var limitNumber = 10;  // default value 10
        if (req?.query?.limit) {
            limitNumber = Number(req?.query?.limit);
        }
        logger.info("Method : getAllFilesWithQuries, message : building aggregation ...");
        var aggregation = [
            {
                '$facet': {
                    'totalData': [
                        {
                            '$sort': { '_id': 1 }, //asc 1 // desc-1
                        },
                        {
                            '$skip': Math.floor(pageNumber * limitNumber),
                        },
                        {
                            '$limit': limitNumber,
                        },
                    ],
                    'totalCount': [
                        {
                            '$count': 'count'
                        }
                    ]
                }
            }
        ]

        if (req?.query?.withContracts) {
            aggregation.unshift(
                { '$match': { enabled: true } },
                {
                    '$lookup': {
                        'from': 'contracts',
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
        logger.info("result : ", objects)
        // const obj = await objects.find({ _id: "1111" });
        // logger.info("hgeeeeeeeeeeeey", obj);

        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? `${File.modelName}s retrieved` : `No ${File.modelName}s found`
        })
    } catch (e) {
        logger.error(`Error in getAllWithQueries() function`)
        return res.status(400).send(JSON.stringify(e));
    }
}


// tatiaia/:fileId
module.exports.getAllFilesWithContractsByFileId = async (req, res) => {
    try {
        const { fileId } = req.params
        const objects = await File.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(fileId)
                }
            },
            {
                $lookup:
                {
                    from: 'contracts',//<collection to join>,
                    localField: '_id',
                    foreignField: 'file',
                    as: 'contracts'
                }
            }
        ])
        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? `${Model.modelName}s retrieved` : `No ${Model.modelName}s found`
        })
    } catch (e) {
        logger.error(`Error in getAll() function`)
        return res.status(400).send(e);
    }
}

