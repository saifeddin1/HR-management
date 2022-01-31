const { TimeOff } = require('../models/TimeOff');
const factory = require('./factory');

module.exports.getAllTimeOffs = factory.getAll(TimeOff);
module.exports.getOneTimeOff = factory.getOne(TimeOff);
module.exports.createNewTimeOff = factory.createOne(TimeOff);
module.exports.updateTimeOff = factory.updateOne(TimeOff);
module.exports.deleteTimeOff = factory.deleteOne(TimeOff);

module.exports.employeeTimeoffHistory = async (req, res) => {
    const { id } = req.params;
    try {
        console.log("starting employeeTimeoff");
        const objects = await TimeOff.find({ file: id });
        console.log("obj:", objects);
        return !objects
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: objects,
                    message: req.t("SUCESS.RETRIEVED")
                }
            );
    } catch (e) {
        console.log(`Error in employeeTimeoff() function`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}

module.exports.employeeTimeoffDetails = async (req, res) => {
    const { id } = req.params;
    const { t_off_id } = req?.query
    try {
        console.log("starting employeeTimeoffDetails");
        const object = await TimeOff.findOne({ file: id, _id: t_off_id });
        console.log("obj:", object);
        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCESS.RETRIEVED")
                }
            );
    } catch (e) {
        console.log(`Error in employeeTimeoffDetails() function`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}

module.exports.updateEmployeeTimeoff = async (req, res) => {
    const { id } = req.params;
    const { t_off_id } = req?.query
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
        const object = await TimeOff.findOne({ file: id, _id: t_off_id });
        if (!object) return res.sendStatus(404);
        if (!(object.status === "Pending")) return res.status(400).json({ message: req.t("SUCESS.FORBIDEN") });
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
                    message: req.t("SUCESS.EDITED")
                }
            );
    } catch (e) {
        console.log(`Error in updateEmployeeTimeoff() function`)
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") });
    }

}

module.exports.deleteEmployeeTimeoff = async (req, res) => {
    const { id } = req.params;
    const { t_off_id } = req?.query
    try {
        console.log("starting deleteEmployeeTimeoff");
        const object = await TimeOff.findOne({ file: id, _id: t_off_id }).deleteOne();

        return !object
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: object,
                    message: req.t("SUCCESS.DELETED")
                }
            );
    } catch (e) {
        console.log(`Error in deleteEmployeeTimeoff() function`)
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

    const object = new TimeOff();
    inputFields.forEach(input => {
        object[input] = req.body[input];
    });
    console.log('created timoff! : ', object)

    try {
        await object.save();
        console.log("Saved ");
        res.status(201).json(
            {
                response: object,
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