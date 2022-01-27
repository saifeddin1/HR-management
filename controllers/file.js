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



// Not Working ❌ update profile as employee
module.exports.updateEmployeeDetails = async (req, res) => {
    const validationErrors = [];
    const updates = Object.keys(req.body);
    const allowedUpdates = ['proEmail', 'image'];
    const isValidOperation = updates.every(update => {
        const isValid = allowedUpdates.includes(update);
        if (!isValid) validationErrors.push(update);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(400).send({ error: `Invalid updates: ${validationErrors.join(',')}` });

    const id = req.params.id;

    try {

        console.log('params id : ', id)
        const employeeFile = await Profile.findOne({ file: id });

        logger.info(' employeeFile : ', employeeFile)

        if (!employeeFile) return res.sendStatus(404);
        updates.forEach(update => {
            employeeFile[update] = req.body[update];
        });
        logger.info('updated employeeFile! : ', employeeFile)
        await employeeFile.save();

        logger.info('saved employeeFile! : ', employeeFile)
    } catch (e) {
        return res.status(400).send(e);
    }

}

// Manage employees files for admin 
//   Working ✅
module.exports.updateEmployeeFileDetails = async (req, res) => {
    const updates = Object.keys(req.body);

    const { id } = req?.params;
    const userId = req?.query?.userId;

    try {
        const object = await File.findOne({ _id: id, userId: userId });
        logger.info('found object! : ', object)
        if (!object) return res.sendStatus(404);
        updates.forEach(update => {
            logger.info('key : ', update)
            object[update] = req.body[update];
        });

        logger.info('updated object! : ', object)

        await object.save();

        logger.info('saved object! : ', object)

        return res.json(
            {
                response: object,
                message: `File for employee-${userId} updated Successfuly`
            }
        );

    } catch (e) {
        logger.error(`Error in updateEmployeeFileDetails() function`)
        return res.status(400).send(e);
    }
}

// Working ✅
module.exports.getEmployeeFileDetails = async (req, res) => {
    const { id } = req.params;
    const userId = req?.query?.userId;
    var aggregation = [
        { '$match': { _id: mongoose.Types.ObjectId(id), userId: userId } }
    ]

    if (req?.query?.withContracts) {
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
                                workingHours: 1,
                                workDay: 1,
                                week: 1,
                                task: 1,
                                note: 1,
                            }
                        }
                    ],
                    'as': 'timesheet'
                }
            }
        )
    }

    try {
        const object = await File.aggregate(aggregation);

        logger.info(object);
        return !object
            ? res.status(404).json({ message: `File Not Found` })
            : res.status(200).json(
                {
                    response: object,
                    message: `File for employee-${userId} ${object.length ? 'retrieved' : 'Not found'}`

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
    try {
        const object = await File.find({ _id: id, userId: userId }).deleteOne();

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
        if (req?.query?.withProfiles) {
            aggregation.unshift(
                {
                    $lookup:
                    {
                        from: 'profiles',//<collection to join>,
                        localField: '_id',
                        foreignField: 'file',
                        as: 'profiles'
                    },

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

