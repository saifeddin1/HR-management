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
            ? res.status(404).json({ message: `TimeOff Not Found` })
            : res.status(200).json(
                {
                    response: objects,
                    message: `TimeOff retrieved`
                }
            );
    } catch (e) {
        logger.error(`Error in employeeTimeoff() function`)
        return res.status(400).send(e)
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
            ? res.status(404).json({ message: `TimeOff Not Found` })
            : res.status(200).json(
                {
                    response: object,
                    message: `TimeOff retrieved`
                }
            );
    } catch (e) {
        logger.error(`Error in employeeTimeoffDetails() function`)
        return res.status(400).send(e)
    }

}

module.exports.updateEmployeeTimeoff = async (req, res) => {
    const { id } = req.params;
    const { t_off_id } = req?.query
    const updates = Object.keys(req.body);
    try {
        console.log("starting updateEmployeeTimeoff");
        const object = await TimeOff.findOne({ file: id, _id: t_off_id });
        if (!object) return res.sendStatus(404);
        updates.forEach(update => {
            object[update] = req.body[update];
        });
        await object.save();
        console.log("saved obj");
        return !object
            ? res.status(404).json({ message: `TimeOff Not Found` })
            : res.status(200).json(
                {
                    response: object,
                    message: `TimeOff updated`
                }
            );
    } catch (e) {
        logger.error(`Error in updateEmployeeTimeoff() function`)
        return res.status(400).send(e)
    }

}

module.exports.deleteEmployeeTimeoff = async (req, res) => {
    const { id } = req.params;
    const { t_off_id } = req?.query
    try {
        console.log("starting deleteEmployeeTimeoff");
        const object = await TimeOff.findOne({ file: id, _id: t_off_id }).deleteOne();

        return !object
            ? res.status(404).json({ message: `TimeOff Not Found` })
            : res.status(200).json(
                {
                    response: object,
                    message: `TimeOff deleted`
                }
            );
    } catch (e) {
        logger.error(`Error in deleteEmployeeTimeoff() function`)
        return res.status(400).send(e)
    }

}
