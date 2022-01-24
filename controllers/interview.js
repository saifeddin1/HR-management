const Interview = require('../models/Interview');



const getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({})
        res.status(200).send({ interviews })
    } catch (e) {
        return res.status(400).send(e)
    }

}

const getOneInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Interview.findById(id);
        return !interview ? res.status(404) : res.status(200).send(interview);
    } catch (e) {
        return res.status(400).send(e)
    }

}

const createNewInterview = async (req, res) => {
    const interview = new Interview(req.body);
    try {
        await interview.save()
        res.status(201).send({ interview })

    } catch (e) {
        return res.status(400).send(e)
    }

}

const updateInterview = async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const interview = await Interview.findById(id);
        if (!interview) return res.sendStatus(404);
        updates.forEach(update => {
            interview[update] = req.body[update];
        });
        await interview.save();
        return res.send(interview);

    } catch (e) {
        return res.status(400).send(e);
    }

}

const deleteInterview = async (req, res) => {
    const id = req.params.id;
    try {
        const interview = await Interview.findByIdAndDelete(id);
        return !interview ? res.send(404) : res.send({ message: "interview deleted!" })
    } catch (e) {
        return res.status(400).send(e);
    }

}

module.exports = {

    getAllInterviews,
    getOneInterview,
    createNewInterview,
    updateInterview,
    deleteInterview
}
