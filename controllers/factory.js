const logger = require('../config/logger').logger


const getAll = (Model) =>

    async (req, res) => {
        try {
            const objects = await Model.find({})
            res.status(200).json({
                response: objects,
                message: objects?.length > 0 ? `${Model.modelName}s retrieved` : `No ${Model.modelName}s found`
            })
        } catch (e) {
            logger.error(`Error in getAll() function`)
            return res.status(400).send(e);
        }


    }


const getOne = (Model) =>
    async (req, res) => {
        try {
            const { id } = req.params;
            const object = await Model.findById(id);
            return !object
                ? res.status(404).json({ message: `${Model.modelName} Not Found` })
                : res.status(200).json(
                    {
                        response: object,
                        message: `${Model.modelName} retrieved`
                    }
                );
        } catch (e) {
            logger.error(`Error in getOne() function`)
            return res.status(400).send(e)
        }

    }

const createOne = (Model) =>
    async (req, res) => {

        logger.info("Create One");
        logger.info("Model :", Model.modelName);
        const object = new Model(req.body);
        logger.info("Object :", object);

        try {
            await object.save();
            console.log("Saved ");
            res.status(201).json(
                {
                    response: object,
                    message: `${Model.modelName} created Successfuly`
                }
            )

        } catch (e) {
            logger.error(`Error in createOne() function`)
            return res.status(400).send(e)
        }

    }

const updateOne = (Model) =>
    async (req, res) => {
        const updates = Object.keys(req.body);
        const id = req.params.id;
        try {
            const object = await Model.findById(id);
            if (!object) return res.sendStatus(404);
            updates.forEach(update => {
                object[update] = req.body[update];
            });
            await object.save();
            return res.json(
                {
                    response: object,
                    message: `${Model.modelName} updated Successfuly`
                }
            );

        } catch (e) {
            logger.error(`Error in updateOne() function`)
            return res.status(400).send(e);
        }

    }

const deleteOne = (Model) =>
    async (req, res) => {
        const id = req.params.id;
        try {
            const object = await Model.findByIdAndDelete(id);
            return !object ? res.send(404) : res.json(
                {
                    response: object,
                    message: `${Model.modelName} deleted Successfuly`
                }
            );
        } catch (e) {
            logger.error(`Error in deleteOne() function`)
            return res.status(400).send(e);
        }

    }

module.exports = {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
}
