const TimeSheet = require('../models/TimeSheet');



const getAllTimeSheets = async (req, res) => {
    try {
        const timeSheets = await TimeSheet.find({})
        res.status(200).send({ timeSheets })
    } catch (e) {
        return res.status(400).send(e)
    }

}

const getOneTimeSheet = async (req, res) => {
    try {
        const { id } = req.params;
        const timeSheet = await TimeSheet.findById(id);
        return !timeSheet ? res.status(404) : res.status(200).send(timeSheet);
    } catch (e) {
        return res.status(400).send(e)
    }

}

const createNewTimeSheet = async (req, res) => {
    const timeSheet = new TimeSheet(req.body);
    try {
        await timeSheet.save()
        res.status(201).send({ timeSheet })

    } catch (e) {
        return res.status(400).send(e)
    }

}

const updateTimeSheet = async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const timeSheet = await TimeSheet.findById(id);
        if (!timeSheet) return res.sendStatus(404);
        updates.forEach(update => {
            timeSheet[update] = req.body[update];
        });
        await timeSheet.save();
        return res.send(timeSheet);

    } catch (e) {
        return res.status(400).send(e);
    }

}

const deleteTimeSheet = async (req, res) => {
    const id = req.params.id;
    try {
        const timeSheet = await TimeSheet.findByIdAndDelete(id);
        return !timeSheet ? res.send(404) : res.send({ message: "timeSheet deleted!" })
    } catch (e) {
        return res.status(400).send(e);
    }

}

module.exports = {

    getAllTimeSheets,
    getOneTimeSheet,
    createNewTimeSheet,
    updateTimeSheet,
    deleteTimeSheet
}
