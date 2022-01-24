const Profile = require('../models/Profile');



const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find({})
        res.status(200).send({ profiles })
    } catch (e) {
        return res.status(400).send(e)
    }

}

const getOneProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);
        return !profile ? res.status(404) : res.status(200).send(profile);
    } catch (e) {
        return res.status(400).send(e)
    }

}

const createNewProfile = async (req, res) => {
    const profile = new Profile(req.body);
    try {
        await profile.save()
        res.status(201).send({ profile })

    } catch (e) {
        return res.status(400).send(e)
    }

}

const updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const profile = await Profile.findById(id);
        if (!profile) return res.sendStatus(404);
        updates.forEach(update => {
            profile[update] = req.body[update];
        });
        await profile.save();
        return res.send(profile);

    } catch (e) {
        return res.status(400).send(e);
    }

}

const deleteProfile = async (req, res) => {
    const id = req.params.id;
    try {
        const profile = await Profile.findByIdAndDelete(id);
        return !profile ? res.send(404) : res.send({ message: "profile deleted!" })
    } catch (e) {
        return res.status(400).send(e);
    }

}

module.exports = {

    getAllProfiles,
    getOneProfile,
    createNewProfile,
    updateProfile,
    deleteProfile
}
