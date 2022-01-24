const TimeOff = require('../models/TimeOff');



const getAllTimeOffs = async (req, res) => {
    try {
        const timeOffs = await TimeOff.find({})
        res.status(200).send({ timeOffs })
    } catch (e) {
        return res.status(400).send(e)
    }

}

const getOneTimeOff = async (req, res) => {
    try {
        const { id } = req.params;
        const timeOff = await TimeOff.findById(id);
        return !timeOff ? res.status(404) : res.status(200).send(timeOff);
    } catch (e) {
        return res.status(400).send(e)
    }

}

const createNewTimeOff = async (req, res) => {
    const timeOff = new TimeOff(req.body);
    try {
        await timeOff.save()
        res.status(201).send({ timeOff })

    } catch (e) {
        return res.status(400).send(e)
    }

}

const updateTimeOff = async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const timeOff = await TimeOff.findById(id);
        if (!timeOff) return res.sendStatus(404);
        updates.forEach(update => {
            timeOff[update] = req.body[update];
        });
        await timeOff.save();
        return res.send(timeOff);

    } catch (e) {
        return res.status(400).send(e);
    }

}

const deleteTimeOff = async (req, res) => {
    const id = req.params.id;
    try {
        const timeOff = await TimeOff.findByIdAndDelete(id);
        return !timeOff ? res.send(404) : res.send({ message: "timeOff deleted!" })
    } catch (e) {
        return res.status(400).send(e);
    }

}

module.exports = {

    getAllTimeOffs,
    getOneTimeOff,
    createNewTimeOff,
    updateTimeOff,
    deleteTimeOff
}
