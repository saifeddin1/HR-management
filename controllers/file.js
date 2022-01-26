const File = require('../models/File');
const { Types } = require('mongoose');
const factory = require('./factory');
const logger = require('../config/logger').logger


module.exports.getAllFiles = factory.getAll(File);
module.exports.getOneFile = factory.getOne(File);
module.exports.createNewFile = factory.createOne(File);
module.exports.updateFile = factory.updateOne(File);
module.exports.deleteFile = factory.deleteOne(File);







module.exports.getAllFilesWithQuries = async (req, res) => {
    try {
        console.log("Method : getAllFilesWithQuries, message : onInit");
        var pageNumber = 0;
        if (req?.query?.page) {
            pageNumber = Number(req?.query?.page);
        }
        var limitNumber = 10;  // default value 10
        if (req?.query?.limit) {
            limitNumber = Number(req?.query?.limit);
        }
        console.log("Method : getAllFilesWithQuries, message : building aggregation ...");
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
                    $lookup:
                    {
                        from: 'contracts',//<collection to join>,
                        localField: '_id',
                        foreignField: 'file',
                        as: 'contracts'
                    },

                })
        }


        // {
        //     '$lookup': {
        //         'from': 'profiles',
        //         'let': {
        //             'fileId': '$_id' // Id of the current file
        //         },
        //         'pipeline': [
        //             {
        //                 '$match': {
        //                     '$expr': {
        //                         '$and': [
        //                             {
        //                                 '$eq': [
        //                                     '$file', '$$fileId'
        //                                 ]
        //                             }
        //                         ]
        //                     }
        //                 }
        //             },
        //             //  {
        //             //     '$project': {
        //             //         startDate: 1
        //             //     }
        //             // }
        //         ],
        //         'as': 'profiles'
        //     }
        // }

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
        console.log("aggregation : ", aggregation)

        const objects = await File.aggregate(aggregation)
        console.log("result : ", objects)

        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? `${File.modelName}s retrieved` : `No ${File.modelName}s found`
        })
    } catch (e) {
        logger.error(`Error in getAll() function`)
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

