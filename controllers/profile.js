const { Profile } = require('../models/Profile');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const mongoose = require('mongoose')

module.exports.getAllProfiles = factory.getAll(Profile);
module.exports.getOneProfile = factory.getOne(Profile);
module.exports.createNewProfile = factory.createOne(Profile);
module.exports.updateProfile = factory.updateOne(Profile);
module.exports.deleteProfile = factory.deleteOne(Profile);


module.exports.getOneProfilesWithQueries = async (req, res) => {
    logger.info("Method : getOneProfilesWithQuries, message : onInit");
    const { id } = req.params;


    logger.info("Method : getOneProfilesWithQuries, message : building aggregation ...");
    var aggregation = [
        { '$match': { _id: mongoose.Types.ObjectId(id) } }
    ]

    console.log("agg1");
    if (req?.query?.withCollaborators) {
        aggregation.unshift(
            {
                $lookup:
                {
                    from: 'profiles',//<collection to join>,
                    localField: '_id',
                    foreignField: 'collaborators',
                    as: 'collaborators'
                },

            })
    }

    logger.info("aggregation : ", aggregation)
    try {
        const object = await Profile.aggregate(aggregation);

        console.log(object);

        res.status(200).json({
            response: object,
            message: object?.length ? `Profiles retrieved` : `No Profiles found`
        })
    } catch (e) {
        logger.error(`Error in getOneProfilesWithQueries() function`)
        return res.status(400).send(JSON.stringify(e));
    }
}

module.exports.getAllProfilesWithQuries = async (req, res) => {
    try {
        logger.info("Method : getAllProfilesWithQuries, message : onInit");
        var pageNumber = 0;
        if (req?.query?.page) {
            pageNumber = Number(req?.query?.page);
        }
        var limitNumber = 10;  // default value 10
        if (req?.query?.limit) {
            limitNumber = Number(req?.query?.limit);
        }
        logger.info("Method : getAllProfilesWithQuries, message : building aggregation ...");
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

        if (req?.query?.withCollaborators) {
            aggregation.unshift(
                {
                    $lookup:
                    {
                        from: 'profiles',//<collection to join>,
                        localField: '_id',
                        foreignField: 'collaborators',
                        as: 'collaborators'
                    },

                })
        }

        logger.info("aggregation : ", aggregation)

        const objects = await Profile.aggregate(aggregation)
        console.log("result : ", objects)

        res.status(200).json({
            response: objects,
            message: objects?.length ? `Profiles retrieved` : `No Profiles found`
        })
    } catch (e) {
        logger.error(`Error in getAllWithQueries() function`)
        return res.status(400).send(JSON.stringify(e));
    }
}






// 