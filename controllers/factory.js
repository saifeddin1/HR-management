const getAll = (Model) =>

    async (req, res) => {
        try {
            const objects = await Model.find({})
            res.status(200).json({
                response: objects,
                message: objects?.length > 0 ? `${Model.modelName}s retrieved` : `No ${Model.modelName}s found`
            })
        } catch (error) {
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
            return res.status(400).send(e)
        }

    }

const createOne = (Model) =>
    async (req, res) => {
        const object = new Model(req.body);
        try {
            await object.save()
            res.status(201).json(
                {
                    response: object,
                    message: `${Model.modelName} created Successfuly`
                }
            )

        } catch (e) {
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
