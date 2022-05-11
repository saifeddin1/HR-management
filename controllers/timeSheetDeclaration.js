const { TimeSheetDeclaration } = require('../models/TimeSheetDeclaration');
const factory = require('./factory');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { logger } = require('../config/logger');
const mongoose = require('mongoose');
const File = require('../models/File')
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { getMonthlyHours } = require('./timeSheet');



module.exports.getOneTimeSheetDeclaration = factory.getOne(TimeSheetDeclaration);
module.exports.createNewTimeSheetDeclaration = factory.createOne(TimeSheetDeclaration);
module.exports.updateTimeSheetDeclaration = factory.updateOne(TimeSheetDeclaration);
// module.exports.deleteTimeSheetDeclaration = factory.deleteOne(TimeSheetDeclaration);

module.exports.deleteTimeSheetDeclaration = async (req, res) => {
    const id = req.params.id;
    try {
        const CanceledDeclaration = await TimeSheetDeclaration.findByIdAndDelete(id)
        return !CanceledDeclaration ? res.send(404) : res.json(
            {
                response: CanceledDeclaration,
                message: req.t("SUCCESS.DELETED")
            }
        );
    } catch (e) {
        logger.error(`Error in deleteOne() function: ${e}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        });
    }


}



module.exports.getAllTimeSheetDeclarations = async (req, res) => {
    var aggregation = aggregationWithFacet(req, res)

    let filterValue = ''
    if (req.query?.filter) {
        filterValue = req.query.filter
        console.log(filterValue);
        aggregation.unshift(
            {
                $match: {
                    $or: [
                        { status: { $regex: filterValue, $options: 'i' } },
                        { month: { $regex: filterValue, $options: 'i' } },
                        { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        { 'user.profile.fullname': { $regex: filterValue, $options: 'i' } },


                    ]
                }
            }
        )
    }
    aggregation.unshift(

        {
            '$match': {
                enabled: true,
                status: {
                    '$nin': ["approved", "rejected"]
                }
            }
        },

    )

    // getting user ref with contract
    aggregation.unshift(
        {
            '$lookup': {
                'from': 'files',
                'let': {
                    'contractUserId': '$userId' // Id of the current file
                },
                // 'localField': '_id',
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$contractUserId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            userRef: 1,
                            profile: {
                                fullname: 1
                            }
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
        const declarations = await TimeSheetDeclaration.aggregate(aggregation);

        // logger.debug(declarations);
        return !declarations || !declarations.length
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: declarations,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getAlldeclarations() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}

module.exports.getApprovedRejected = async (req, res) => {
    var aggregation = aggregationWithFacet(req, res)

    let filterValue = ''
    if (req.query?.filter) {
        filterValue = req.query.filter
        console.log(filterValue);
        aggregation.unshift(
            {
                $match: {
                    $or: [
                        { status: { $regex: filterValue, $options: 'i' } },
                        { month: { $regex: filterValue, $options: 'i' } },
                        { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        { 'user.profile.fullname': { $regex: filterValue, $options: 'i' } },


                    ]
                }
            }
        )
    }
    aggregation.unshift(

        {
            '$match': {
                enabled: true,
                status: {
                    '$nin': ["declared"]
                }
            }
        },

    )

    // getting user ref with contract
    aggregation.unshift(
        {
            '$lookup': {
                'from': 'files',
                'let': {
                    'contractUserId': '$userId' // Id of the current file
                },
                // 'localField': '_id',
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$contractUserId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            userRef: 1,
                            profile: {
                                fullname: 1
                            }
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
        const declarations = await TimeSheetDeclaration.aggregate(aggregation);

        // logger.debug(declarations);
        return !declarations || !declarations.length
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: declarations,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getAlldeclarations() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}

module.exports.createDeclarationAsEmployee = async (req, res) => {
    logger.info("createDeclarationAsEmployee");
    // const userId = req.user?.id
    const userId = getCurrentUserId(req, res);

    const declararation = new TimeSheetDeclaration();
    // const userFile = await File.findOne({  });
    declararation.userId = mongoose.Types.ObjectId(userId);
    logger.info('created declararation! : ', declararation)

    try {
        await declararation.save();
        logger.info("Saved ");
        res.status(201).json(
            {
                response: declararation,
                message: req.t("SUCCESS.CREATED")
            }
        )

    } catch (e) {
        logger.info(`Error in createDeclarationAsEmployee() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }


}

module.exports.getEmployeeDeclarations = async (req, res) => {
    const userId = getCurrentUserId(req, res);

    var aggregation = aggregationWithFacet(req, res);

    aggregation.unshift(
        {
            '$match': { userId: mongoose.Types.ObjectId(userId) }
        }
    )
    aggregation.unshift(
        {
            '$lookup': {
                'from': 'timesheets',
                'let': {
                    'currId': '$userId', // get the local fild "file" in t-sheet-declaration
                    'currMonth': '$month'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$currId'
                                        ]
                                    },
                                    // { "$eq": [{ "$month": "$date" }, "$$currMonth"] }
                                ]
                            }
                        },

                    },
                    {
                        '$project': {
                            date: 1,
                            note: 1
                        }
                    }
                ],
                'as': 'timesheets'
            }
        }
    )
    try {

        logger.info("aggregation : ", aggregation)

        const employeeDeclarations = await TimeSheetDeclaration.aggregate(aggregation) // 
        logger.debug("result : ", employeeDeclarations)
        res.status(200).json({
            response: employeeDeclarations,
            message: employeeDeclarations?.length > 0 ? req.t("SUCCESS.RETRIEVED") : req.t("ERROR.NOT_FOUND")
        })
    } catch (e) {
        logger.error(`Error in getEmployeeDeclarations() function`)
        return res.status(400).json({
            message: req.t("ERROR.UNAUTHORIZED")
        });
    }

}


module.exports.getCurrentDeclaration = async (req, res) => {
    const { month } = req.params;
    const userId = getCurrentUserId(req, res)
    try {

        const currentDeclaration = await TimeSheetDeclaration.findOne({ userId: userId, month: month, enabled: true });
        return !currentDeclaration
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: currentDeclaration,
                    message: req.t("SUCCESS.RETRIEVED")
                }
            );
    } catch (e) {
        return res.status(400).json({
            message: req.t("ERROR.UNAUTHORIZED")
        });
    }


}

module.exports.updateDeclarationStatus = async (req, res) => {
    const { id } = req.params
    // const userId = getCurrentUserId(req, res)
    console.log(req.body);
    if (!req.body.status) return res.status(404).json({ message: req.t("BAD_REQUEST") })
    try {
        const declaration = await TimeSheetDeclaration.findByIdAndUpdate(mongoose.Types.ObjectId(id), { status: req.body.status })
        console.log("⚡ ~ updateDeclarationStatus= ~ declaration", declaration)
        if (!declaration) return res.status(404).json({ message: req.t("NOT_FOUND") })

        return res.status(200).json({
            response: declaration,
            message: req.t("SUCCESS.EDITED")
        })

    } catch (error) {
        console.log(`Error in update declaration method!=> ${error.message}`);
        return res.status(400).json({
            message: req.t("BAD_REQUEST")
        })
    }
}