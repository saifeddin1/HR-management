const { TimeSheet } = require('../models/TimeSheet');
const { TimeSheetDeclaration } = require('../models/TimeSheetDeclaration');
const factory = require('./factory');
const { logger } = require('../config/logger')
const mongoose = require('mongoose');
const YearMonthCondition = require('../utils/YearMonthCondition');
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');

module.exports.getAllTimeSheets = factory.getAll(TimeSheet);
module.exports.getOneTimeSheet = factory.getOne(TimeSheet);
module.exports.createNewTimeSheet = factory.createOne(TimeSheet);
module.exports.updateTimeSheet = factory.updateOne(TimeSheet);
module.exports.deleteTimeSheet = factory.deleteOne(TimeSheet);
module.exports.getEmployeeTimeSheets = factory.getEmployeeThing(TimeSheet);

module.exports.updateTimeSheetForEmployee = async (req, res) => {
    // const userId = req.user.id;
    const userId = getCurrentUserId(req, res);
    const { timeSheetId } = req.params
    const validationErrors = []
    const updates = Object.keys(req.body);
    const allowed = ["workingHours", "note", "date", "extraHours"];
    const isValidOperation = updates.every(update => {
        const isValid = allowed.includes(update);
        if (!isValid) validationErrors.push(update);
        return isValid;
    });
    var yearMonth = req.body?.date?.split("T")[0].substr(0, 7);
    // var yearMonth = "2022-01"
    logger.info("\n\n🚀  module.exports.updateTimeSheetForEmployee= ~ yearMonth", yearMonth)


    if (!isValidOperation)
        return res.status(400).send({ message: req.t("ERROR.BAD_REQUEST") });

    var aggregation = [
        {
            '$match': {
                '$expr': {
                    '$and':
                        [
                            {
                                '$eq': [
                                    '$enabled', true
                                ]

                            },
                            {
                                '$eq': [
                                    '$userId', mongoose.Types.ObjectId(userId)
                                ]

                            },
                            {
                                '$in': [
                                    '$status', ['approved', 'declared']
                                ]
                            },

                            ...YearMonthCondition(yearMonth, '$updatedAt')
                        ]

                }
            }
        },

    ]



    logger.info("aggregation ", aggregation);
    try {
        const timeSheetDeclarationResult = await TimeSheetDeclaration.aggregate(aggregation);
        logger.info("found array", timeSheetDeclarationResult);
        if (timeSheetDeclarationResult?.length) {
            logger.info("Im here, array full :", timeSheetDeclarationResult);
            return res.status(400).json({ message: req.t("ERROR.ALREADY_EXISTS") })
        } else {
            // case empty array , we can modify or create timesheet
            logger.info("Im here, array empty");
            if (req.body.note.length > 200) res.status(400).json({ message: "Note should be less than 200 characters." })
            if (req.body.workingHours > 10 || req.body.workingHours < 8) res.status(400).json({ message: "Hours should be between 8 and 10 per day." })
            await TimeSheet.findByIdAndUpdate(timeSheetId, { note: req.body.note, workingHours: req.body.workingHours, date: req.body.date, extraHours: req.body.extraHours })
            return res.status(200).json({
                message: req.t("SUCCESS.EDITED"),
            })
        }


    } catch (e) {
        logger.info(`Error in updateTimeSheetForEmployee() function: ${e.message}`)
        return res.status(400).json({
            message: req.t("ERROR.UNAUTHORIZED")
        })
    }
}


module.exports.getCurrentTimesheet = async (req, res) => {
    const userId = getCurrentUserId(req, res);
    let date = req.params?.date
    logger.info("⚡ ~ file: timeSheet.js ~ line 104 ~ module.exports.getCurrentTimesheet= ~ date", date)

    try {
        const currentTimeSheet = await TimeSheet.findOne({ userId: userId, date: date });
        logger.info("currentTimeSheet", currentTimeSheet);
        if (!currentTimeSheet) {
            logger.info(`Not found with given date`)
            return res.status(404).json({
                message: req.t("ERROR.NOT_FOUND")
            })
        }
        return res.status(200).json({
            response: currentTimeSheet,
            message: req.t("SUCCESS.RETRIEVED"),
        })
    }
    catch (e) {
        logger.info(`Error in getCurrentTimesheet() function: ${e.message}`)
        return res.status(400).json({
            message: req.t("ERROR.UNAUTHORIZED")
        })
    }


}


module.exports.getMonthlyHours = async (req, res) => {

    var field = req.query?.field
    const userId = getCurrentUserId(req, res)
    var yearMonth = req.params?.date?.split("T")[0].substr(0, 7);
    console.log("📆📆 ~.getMonthlyWorkingHours= ~ yearMonth", yearMonth)
    var aggregation = [
        {
            '$match': {
                '$expr': {
                    '$and':
                        [
                            ...YearMonthCondition(yearMonth, '$date'),
                            {
                                userId: userId
                            },

                        ]

                }
            }
        },
        {
            '$group': {
                _id: null,
                user: { $first: userId },
                date: { $first: req.params.date },
                sum: {
                    $sum: `$${field}`
                }
            }
        }

    ]
    aggregation.unshift({
        '$match': {

            enabled: true
        }
    })
    try {

        const hours = await TimeSheet.aggregate(aggregation);
        console.log('\n\n hours', hours);
        if (!hours) return res.status(404).json({ message: req.t('ERROR.NOT_FOUND') })
        res.status(200).json({
            response: hours,
            message: req.t('SUCCESS.RETRIEVED')
        })

    } catch (e) {
        logger.info(`Error in get hours sum func() ${e}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        })
    }
}





module.exports.getMonthlyEmployeeTimesheets = async (req, res) => {
    const userId = getCurrentUserId(req, res)
    var yearMonth = req.params.yearMonth
    var aggregation = aggregationWithFacet(req, res)

    aggregation.unshift({
        "$match": {
            "$expr": {
                "$and": [
                    {
                        "$eq": [
                            {
                                "$substr": [
                                    {
                                        "$arrayElemAt": [
                                            {
                                                "$split": [
                                                    {
                                                        "$toString": "$date"
                                                    },
                                                    "T"
                                                ]
                                            },
                                            0
                                        ]
                                    },
                                    0,
                                    7
                                ]
                            },
                            yearMonth
                        ],

                    },
                    {
                        "$eq": [
                            "$userId",
                            mongoose.Types.ObjectId(userId)
                        ]
                    },
                ]
            }
        }
    })
    aggregation.unshift({
        '$match': {

            enabled: true
        }
    })
    try {
        const monthlyTimeSheet = await TimeSheet.aggregate(aggregation)
        console.log("⚡  ~ monthlyTimeSheet", monthlyTimeSheet[0]?.totalData)
        if (!monthlyTimeSheet || !monthlyTimeSheet.length) return res.status(404).json({ message: req.t('ERROR.NOT_FOUND') })

        return res.status(200).json({
            response: monthlyTimeSheet,
            message: req.t('SUCCESS.RETRIEVED')
        })
    } catch (error) {
        logger.debug(JSON.stringify(e))
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")

        });
    }
}


module.exports.getTimesheetsByUserId = async (req, res) => {
    const userId = req.params.userId;
    var aggregation = aggregationWithFacet(req, res);
    const yearMonth = req.params.yearMonth
    try {
        aggregation.unshift({
            "$match": {
                "$expr": {
                    "$and": [
                        {
                            "$eq": [
                                {
                                    "$substr": [
                                        {
                                            "$arrayElemAt": [
                                                {
                                                    "$split": [
                                                        {
                                                            "$toString": "$date"
                                                        },
                                                        "T"
                                                    ]
                                                },
                                                0
                                            ]
                                        },
                                        0,
                                        7
                                    ]
                                },
                                yearMonth
                            ],

                        },
                        {
                            "$eq": [
                                "$userId",
                                mongoose.Types.ObjectId(userId)
                            ]
                        },
                    ]
                }
            }
        })


        aggregation.unshift({
            '$match': {
                enabled: true
            }
        },
            {
                '$lookup': {
                    'from': 'files',
                    'let': {
                        'tsheetUserId': '$userId' // Id of the current file
                    },
                    // 'localField': '_id',
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        {
                                            '$eq': [
                                                '$userId', '$$tsheetUserId'
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            '$project': {
                                userRef: 1,

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


        // const employeeWith = await Model.find({ userId: mongoose.Types.ObjectId(userId) });
        const timesheetsById = await TimeSheet.aggregate(aggregation);
        !timesheetsById ?
            req.t("ERROR.NOT_FOUND")
            : res.status(200).json({
                response: timesheetsById,
                message: req.t("SUCCESS.RETRIEVED")
            })
    } catch (e) {
        logger.debug(JSON.stringify(e))
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")

        });
    }

}