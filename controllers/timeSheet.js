const { TimeSheet } = require('../models/TimeSheet');
const { TimeSheetDeclaration } = require('../models/TimeSheetDeclaration');
const factory = require('./factory');
const { logger } = require('../config/logger')
const mongoose = require('mongoose');
const YearMonthCondition = require('../utils/YearMonthCondition');
const { getCurrentUserId } = require('../utils/getCurrentUser');

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
    const allowed = ["workingHours", "note", "date"];
    const isValidOperation = updates.every(update => {
        const isValid = allowed.includes(update);
        if (!isValid) validationErrors.push(update);
        return isValid;
    });
    var yearMonth = req.body?.date?.split("T")[0].substr(0, 7);
    // var yearMonth = "2022-01"
    console.log("\n\n🚀  module.exports.updateTimeSheetForEmployee= ~ yearMonth", yearMonth)


    if (!isValidOperation)
        return res.status(403).send({ message: req.t("ERROR.FORBIDDEN") });

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

                            ...YearMonthCondition(yearMonth)
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
            // case array full :
            // we have timesheet declaration with status ['declared, "accpteed"] in the chosen month
            // return BAD REQUEST
            logger.info("Im here, array full :", timeSheetDeclarationResult);
            return res.status(400).json({ message: req.t("ERROR.ALREADY_EXISTS") })
        } else {
            // case empty array , we can modify or create timesheet
            logger.info("Im here, array empty");

            await TimeSheet.findByIdAndUpdate(timeSheetId, { note: req.body.note, workingHours: req.body.workingHours, date: req.body.date })
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
    console.log("⚡ ~ file: timeSheet.js ~ line 104 ~ module.exports.getCurrentTimesheet= ~ date", date)

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
