const Contract = require('../models/Contract');



const getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.find({})
        res.status(200).send({ contracts })
    } catch (e) {
        return res.status(400).send(e)
    }

}

const getOneContract = async (req, res) => {
    try {
        const { id } = req.params;
        const contract = await Contract.findById(id);
        return !contract ? res.status(404) : res.status(200).send(contract);
    } catch (e) {
        return res.status(400).send(e)
    }

}

const createNewContract = async (req, res) => {
    const contract = new Contract(req.body);
    try {
        await contract.save()
        res.status(201).send({ contract })

    } catch (e) {
        return res.status(400).send(e)
    }

}

const updateContract = async (req, res) => {
    const updates = Object.keys(req.body);
    const id = req.params.id;
    try {
        const contract = await Contract.findById(id);
        if (!contract) return res.sendStatus(404);
        updates.forEach(update => {
            contract[update] = req.body[update];
        });
        await contract.save();
        return res.send(contract);

    } catch (e) {
        return res.status(400).send(e);
    }

}

const deleteContract = async (req, res) => {
    const id = req.params.id;
    try {
        const contract = await Contract.findByIdAndDelete(id);
        return !contract ? res.send(404) : res.send({ message: "contract deleted!" })
    } catch (e) {
        return res.status(400).send(e);
    }

}

module.exports = {

    getAllContracts,
    getOneContract,
    createNewContract,
    updateContract,
    deleteContract
}
