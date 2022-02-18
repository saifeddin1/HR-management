const { TimeOff } = require('../models/TimeOff');
const File = require('../models/File');
const factory = require('./factory');
const mongoose = require('mongoose');
const { logger } = require('../config/logger');
const { getCurrentUserId } = require('../utils/getCurrentUser');

module.exports.getAllTimeOffs = factory.getAll(TimeOff);
module.exports.getOneTimeOff = factory.getOne(TimeOff);
module.exports.createNewTimeOff = factory.createOne(TimeOff);
module.exports.updateTimeOff = factory.updateOne(TimeOff);
module.exports.deleteTimeOff = factory.deleteOne(TimeOff);
module.exports.employeeTimeoffHistory = factory.getEmployeeThing(TimeOff)


module.exports.updateEmployeeTimeoff = async (req, res) => {
    const timeOffId = req.params.id;
    // const userId = req.user?.id
    const userId = getCurrentUserId(req, res);

    const validationErrors = []
    const updates = Object.keys(req.body);
    const allowedFields = ["startDate", "offDays"]
    const isValidOperation = updates.every(update => {
        const isValid = allowedFields.includes(update);
        if (!isValid) validationErrors.push(update);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(400).json({ message: req.t("ERROR.FORBIDDEN") });


    try {
        logger.info("starting updateEmployeeTimeoff");
        // const userFile = await File.findOne({ userId: req.user?.id });

        const timeOff = await TimeOff.findOne({ userId: mongoose.Types.ObjectId(userId), _id: timeOffId });
        if (!timeOff) return res.sendStatus(404);
        if (!(timeOff.status === "Pending")) return res.status(400).json({ message: req.t("ERROR.FORBIDDEN") });
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

    logger.info("createTimeOffAsEmployee");
    const inputFields = Object.keys(req.body);

    const allowedFields = ["startDate", "offDays"]
    const isValidOperation = inputFields.every(input => {
        const isValid = allowedFields.includes(input);
        if (!isValid) validationErrors.push(input);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(400).json({ message: req.t("ERROR.FORBIDDEN") });

    const timeOffRequest = new TimeOff();
    inputFields.forEach(input => {
        if (new Date(req.body['startDate']) < new Date() || (req.body['offDays'] < 1 || req.body['offDays'] > 22)) return res.status(400).json({ message: req.t("ERROR.FORBIDDEN") });
        timeOffRequest[input] = req.body[input];
    });

    timeOffRequest.userId = mongoose.Types.ObjectId(userId);
    logger.info('created timoff! : ', timeOffRequest)

    try {

        const userFile = await File.updateOne({ userId: userId }, { $inc: { timeOffBalance: -req.body['offDays'] } });

        console.log("⚡  userFile after substraction: ", userFile)
        await timeOffRequest.save();
        logger.info("Saved ");
        res.status(201).json(
            {
                response: timeOffRequest,
                message: req.t("SUCCESS.ADDED")
            }
        )

    } catch (e) {
        logger.info(`Error in createOne() function: ${e.message}`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
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
        logger.info("saved");

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