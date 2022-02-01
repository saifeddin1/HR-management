const { TimeOff } = require('../models/TimeOff');
const File = require('../models/File');
const factory = require('./factory');

module.exports.getAllTimeOffs = factory.getAll(TimeOff);
module.exports.getOneTimeOff = factory.getOne(TimeOff);
module.exports.createNewTimeOff = factory.createOne(TimeOff);
module.exports.updateTimeOff = factory.updateOne(TimeOff);
module.exports.deleteTimeOff = factory.deleteOne(TimeOff);
module.exports.employeeTimeoffHistory = factory.getEmployeeThing(TimeOff)


module.exports.updateEmployeeTimeoff = async (req, res) => {
    const { id } = req.params;
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
        console.log("starting updateEmployeeTimeoff");
        const userFile = await File.findOne({ userId: req.user?.userId });

        const object = await TimeOff.findOne({ file: userFile._id, _id: id });
        if (!object) return res.sendStatus(404);
        if (!(object.status === "Pending")) return res.status(400).json({ message: req.t("SUCCESS.FORBIDEN") });
        updates.forEach(update => {
            object[update] = req.body[update];
        });
        await object.save();
        console.log("saved obj");
        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.EDITED")
                }
            );
    } catch (e) {
        console.log(`Error in updateEmployeeTimeoff() function`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}


module.exports.createTimeOffAsEmployee = async (req, res) => {
    const validationErrors = []

    console.log("createTimeOffAsEmployee");
    const inputFields = Object.keys(req.body);

    const allowedFields = ["startDate", "offDays"]
    const isValidOperation = inputFields.every(input => {
        const isValid = allowedFields.includes(input);
        if (!isValid) validationErrors.push(input);
        return isValid;
    });

    if (!isValidOperation)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });

    const timeOffRequest = new TimeOff();
    inputFields.forEach(input => {
        timeOffRequest[input] = req.body[input];
    });

    const userFile = await File.findOne({ userId: req.user?.userId });
    timeOffRequest.file = userFile._id;
    console.log('created timoff! : ', timeOffRequest)

    try {
        await timeOffRequest.save();
        console.log("Saved ");
        res.status(201).json(
            {
                response: timeOffRequest,
                message: req.t("SUCCESS.ADDED")
            }
        )

    } catch (e) {
        console.log(`Error in createOne() function`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}

// for HR Agent
module.exports.updateStatus = async (req, res) => {
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
        return res.status(400).json({ message: req.t("ERROR.FORBIDDEN") });


    try {
        const object = await TimeOff.findOne({ _id: id });
        if (!object) return res.sendStatus(404);
        updates.forEach(update => {
            object[update] = req.body[update];
        });
        console.log("updated");
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
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}