const { TimeOff } = require('../models/TimeOff');
const File = require('../models/File');
const factory = require('./factory');
const mongoose = require('mongoose');
const { logger } = require('../config/logger');
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { TimeSheet } = require('../models/TimeSheet');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');

// module.exports.getAllTimeOffs = factory.getAll(TimeOff);
module.exports.getOneTimeOff = factory.getOne(TimeOff);
module.exports.createNewTimeOff = factory.createOne(TimeOff);
module.exports.updateTimeOff = factory.updateOne(TimeOff);
module.exports.deleteTimeOff = factory.deleteOne(TimeOff);
module.exports.employeeTimeoffHistory = factory.getEmployeeThing(TimeOff)

module.exports.getAllTimeOffs = async (req, res) => {
    console.log("\n", req.query);
    var aggregation = aggregationWithFacet(req, res)

    logger.debug("Incomoing aggregation getAllTimeOffs: ", aggregation);
    aggregation.unshift(
        {
            '$match': {
                enabled: true
            }
        }
    )

    aggregation.unshift(
        {
            '$lookup': {
                'from': 'files',
                'let': {
                    'localUserId': '$userId' // Id of the current file
                },
                // 'localField': '_id',
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$localUserId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            userRef: 1
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


    if (req.query?.filter) {
        filterValue = req.query.filter
        console.log(filterValue)
        aggregation.unshift(
            {
                $match: {
                    $or: [
                        { ref: { $regex: filterValue, $options: 'i' } },
                        { status: { $regex: filterValue, $options: 'i' } },
                        { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        { 'startDateSpecs.from': { $regex: filterValue, $options: 'i' } },
                        { 'endDateSpecs.to': { $regex: filterValue, $options: 'i' } },
                    ]
                }
            }
        )
    }

    try {
        const timeoffs = await TimeOff.aggregate(aggregation);

        // logger.debug(timeoffs);
        return !timeoffs
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: timeoffs,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getAllTimeOffs() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}


module.exports.updateEmployeeTimeoff = async (req, res) => {
    const timeOffId = req.params.id;
    // const userId = req.user?.id
    const userId = getCurrentUserId(req, res);

    const validationErrors = []
    const updates = Object.keys(req.body);
    const allowedFields = ["startDateSpecs", "endDateSpecs"]
    const isValidOperation = updates.every(update => {
        const isValid = allowedFields.includes(update);
        if (!isValid) validationErrors.push(update);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });


    try {
        logger.info("starting updateEmployeeTimeoff");
        // const userFile = await File.findOne({ userId: req.user?.id });

        const timeOff = await TimeOff.findOne({ userId: mongoose.Types.ObjectId(userId), _id: timeOffId });
        if (!timeOff) return res.sendStatus(404);
        if (!(timeOff.status === "Pending")) return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
        updates.forEach(update => {
            timeOff[update] = req.body[update];
        });
        await timeOff.save();
        logger.info("saved obj");
        return !timeOff
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: timeOff,
                    message: req.t("SUCCESS.EDITED")
                }
            );
    } catch (e) {
        logger.info(`Error in updateEmployeeTimeoff() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}


module.exports.createTimeOffAsEmployee = async (req, res) => {
    const validationErrors = []
    // const userId = req.user.id;
    const userId = getCurrentUserId(req, res);

    logger.info("starting createTimeOffAsEmployee");
    const inputFields = Object.keys(req.body);
    console.log(inputFields);
    const allowedFields = ["startDateSpecs", "endDateSpecs"]
    const isValidOperation = inputFields.every(input => {
        const isValid = allowedFields.includes(input);
        if (!isValid) validationErrors.push(input);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });

    if (new Date(req.body.startDateSpecs?.date) < new Date()) {
        return res.status(400).json({ message: "Start Date can't be in the past." });
    }

    if (new Date(req.body.startDateSpecs?.date) > new Date(req.body.endDateSpecs.date)) {
        return res.status(400).json({ message: "End Date sould come after  Start Date." });
    }

    let offDays = new Date(req.body.endDateSpecs.date).getDate() - new Date(req.body.startDateSpecs.date).getDate()
    console.log("\n??? ~   module.exports.createTimeOffAsEmployee= ~ offDays", offDays)

    const userFile = await File.findOne({ userId: userId });
    console.log("\n", userFile);

    if (offDays > userFile.timeOffBalance) {
        return res.status(400).json({ message: "You Timeoff balance is very low." })
    }

    console.log("\n???timeOffBalance after", userFile.timeOffBalance)

    const timeOffRequest = new TimeOff();
    inputFields.forEach(input => {
        timeOffRequest[input] = req.body[input];
    });

    timeOffRequest.userId = mongoose.Types.ObjectId(userId);
    // logger.info('created timoff! : ', timeOffRequest)
    const existingTimeoff = await TimeOff.findOne({ userId: userId, startDateSpecs: timeOffRequest.startDateSpecs, endDateSpecs: timeOffRequest.endDateSpecs, enabled: true })
    const pendingTimeoff = await TimeOff.findOne({ userId: userId, status: 'Pending', enabled: true })
    // console.log(pendingTimeoff);
    if (existingTimeoff || pendingTimeoff) {
        res.status(409).json({ message: req.t("ERROR.ALREADY_EXISTS") });
    } else {

        try {
            userFile.timeOffBalance -= offDays;

            await userFile.save()
            await timeOffRequest.save();

            // logger.info("???  userFile after substraction: ", userFile)
            logger.info("Saved ");
            res.status(201).json(
                {
                    response: timeOffRequest,
                    message: req.t("SUCCESS.CREATED")
                }
            )
        } catch (e) {
            logger.info(`Error in createOne() function: ${e.message}`)
            return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
        }
    }

}

// for HR Agent
module.exports.updateStatus = async (req, res) => {
    const timeOffId = req.params.id;
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
        return res.status(400).json({ message: req.t("ERROR.FORBIDDEN") });

    try {
        const object = await TimeOff.findOne({ _id: timeOffId });
        if (!object) return res.sendStatus(404);


        updates.forEach(update => {
            object[update] = req.body[update];
        });
        logger.info("updated");
        await object.save();
        let offDays = new Date(object.endDateSpecs.date).getDate() - new Date(object.startDateSpecs.date).getDate()
        logger.info("saved");
        if (object.status === 'Approved') {
            console.log('is approveddddddddddd \n');
            await TimeSheet.updateMany({

                userId: object?.userId,
                date: {
                    "$gte": object.startDateSpecs.date,
                    // always we have an extra day in timeoff
                    "$lt": new Date(new Date(object.startDateSpecs.date).getTime() - 1000 * 3600 * 24 * (-offDays))
                }

            }, { $set: { isDayOff: true } })
        }
        if (object.status === 'Rejected') {
            console.log('is rejected \n');
            await TimeSheet.updateMany({

                userId: object?.userId,
                date: {
                    "$gte": object.startDateSpecs.date,
                    // always we have an extra day in timeoff
                    "$lt": new Date(new Date(object.startDateSpecs.date).getTime() - 1000 * 3600 * 24 * (-offDays))
                }

            }, { $set: { isDayOff: false } })
        }
        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.EDITED")
                }
            );
    } catch (e) {
        logger.info(`Error in updateTimeOffStatus() function: ${e.message}`)

        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}