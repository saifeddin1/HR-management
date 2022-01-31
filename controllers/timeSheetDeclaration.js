const { TimeSheetDeclaration } = require('../models/TimeSheetDeclaration');
const factory = require('./factory');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { logger } = require('../config/logger');
const mongoose = require('mongoose');


module.exports.getAllTimeSheetDeclarations = factory.getAll(TimeSheetDeclaration);
module.exports.getOneTimeSheetDeclaration = factory.getOne(TimeSheetDeclaration);
module.exports.createNewTimeSheetDeclaration = factory.createOne(TimeSheetDeclaration);
module.exports.updateTimeSheetDeclaration = factory.updateOne(TimeSheetDeclaration);
module.exports.deleteTimeSheetDeclaration = factory.deleteOne(TimeSheetDeclaration);




module.exports.getEmployeeDeclarations = async (req, res) => {
    var { param } = req.params;

    var aggregation = aggregationWithFacet(req, res);
    aggregation.unshift(
        {
            '$match': { file: mongoose.Types.ObjectId(param) }
        }
    )

    aggregation.unshift(
        {
            '$lookup': {
                'from': 'timesheets',
                'let': {
                    'currId': '$file', // get the local fild "file" in t-sheet-declaration
                    'currMonth': '$month'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$file', '$$currId'
                                        ]
                                    },
                                    { "$eq": [{ "$month": "$date" }, "$$currMonth"] }
                                ]
                            }
                        },

                    },
                    {
                        '$project': {
                            date: 1,
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
            message: employeeDeclarations?.length > 0 ? req.t("SUCESS.RETRIEVED") : req.t("ERROR.NOT_FOUND")
        })
    } catch (e) {
        logger.error(`Error in getEmployeeDeclarations() function`)
        return res.status(400).json({
            message: req.t("ERROR.UNAUTHORIZED")
        });
    }

}

module.exports.updateDeclarationStatus = async (req, res) => {
    const { id } = req.params;
    // const { user } = req?.query
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
        const object = await TimeSheetDeclaration.findOne({ _id: id });
        if (!object) return res.sendStatus(404);
        updates.forEach(update => {
            object[update] = req.body[update];
        });
        console.log("updated, obj; ", object);
        await object.save();
        console.log("saved");

        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.EDITED")
                }
            );
    } catch (e) {
        return res.status(400).json({
            message: req.t("ERROR.UNAUTHORIZED")
        });
    }
}