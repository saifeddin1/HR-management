const { TimeSheetDeclaration } = require('../models/TimeSheetDeclaration');
const factory = require('./factory');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { logger } = require('../config/logger');
const mongoose = require('mongoose');
const File = require('../models/File')
const { getCurrentUserId } = require('../utils/getCurrentUser');

module.exports.getAllTimeSheetDeclarations = factory.getAll(TimeSheetDeclaration);
module.exports.getOneTimeSheetDeclaration = factory.getOne(TimeSheetDeclaration);
module.exports.createNewTimeSheetDeclaration = factory.createOne(TimeSheetDeclaration);
module.exports.updateTimeSheetDeclaration = factory.updateOne(TimeSheetDeclaration);
module.exports.deleteTimeSheetDeclaration = factory.deleteOne(TimeSheetDeclaration);


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

module.exports.updateDeclarationStatus = async (req, res) => {
    // const userId = req.user.id
    const userId = getCurrentUserId(req, res);

    const { declarationId } = req.params;
    const validationErrors = []
    const updates = Object.keys(req.body);
    const allowed = ["status"];
    const isValidOperation = updates.every(update => {
        const isValid = allowed.includes(update);
        if (!isValid) validationErrors.push(update);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(403).send({ message: req.t("ERROR.FORBIDDEN") });

    try {
        const declaration = await TimeSheetDeclaration.findOne({ _id: declarationId, userId: mongoose.Types.ObjectId(userId) });
        if (!declaration) return res.status(404).json({ message: req.t("ERROR.NOT_FOUND") });
        updates.forEach(update => {
            declaration[update] = req.body[update];
        });
        logger.info("updated, obj; ", declaration);
        await declaration.save();
        logger.info("saved");

        return !declaration
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: declaration,
                    message: req.t("SUCCESS.EDITED")
                }
            );
    } catch (e) {
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