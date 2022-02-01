const { logger } = require('../config/logger')
const File = require('../models/File')
const { aggregationWithFacet } = require('../utils/aggregationWithFacet')

const getAll = (Model) =>

    async (req, res) => {
        try {
            const objects = await Model.find({})
            res.status(200).json({
                response: objects,
                message: objects?.length > 0 ? req.t("SUCCESS.RETRIEVED") : req.t("ERROR.NOT_FOUND")
            })
        } catch (e) {
            logger.error(`Error in getAll() function`)
            return res.status(400).json({
                message: req.t("ERROR.UNAUTHORIZED")
            });
        }


    }


const getOne = (Model) =>
    async (req, res) => {
        try {
            const { id } = req.params;
            const object = await Model.findById(id);
            return !object
                ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
                : res.status(200).json(
                    {
                        response: object,
                        message: req.t("SUCCESS.RETRIEVED")
                    }
                );
        } catch (e) {
            logger.error(`Error in getOne() function`)
            return res.status(400).json({
                message: req.t("ERROR.UNAUTHORIZED")
            })
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
                    message: req.t("SUCCESS.CREATED")
                }
            )

        } catch (e) {
            logger.error(`Error in createOne() function`)
            return res.status(400).json({
                message: req.t("ERROR.UNAUTHORIZED")
            })
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
                    message: req.t("SUCCESS.SAVED"),
                }
            );

        } catch (e) {
            logger.error(`Error in updateOne() function : ${e}`)
            return res.status(403).json({ message: req.t("ERROR.UNAUTHORIZED") });
        }

    }

const deleteOne = (Model) =>
    async (req, res) => {
        const id = req.params.id;
        try {
            // const object = await Model.findByIdAndDelete(id);
            const object = await Model.findById(id);
            object.enabled = false;
            await object.save()
            return !object ? res.send(404) : res.json(
                {
                    response: object,
                    message: req.t("SUCCESS.DELETED")
                }
            );
        } catch (e) {
            logger.error(`Error in deleteOne() function`)
            return res.status(400).json({
                message: req.t("ERROR.UNAUTHORIZED")
            });
        }

    }

const getEmployeeThing = (Model) =>
    async (req, res) => {
        const { userId } = req?.user;

        const userFile = await File.findOne({ userId: userId });

        var aggregation = aggregationWithFacet(req, res)
        aggregation.unshift(
            {
                '$match': {
                    file: userFile._id
                }
            }
        )
        logger.debug("before try, aggrgegatiojn :", aggregation);

        try {

            const employeeWith = await Model.aggregate(aggregation)

            logger.debug(`employeeWith${Model.modelName}`, employeeWith);

            res.status(200).json({
                response: employeeWith,
                message: employeeWith?.length > 0 ? req.t("SUCCESS.RETRIEVED") : req.t("ERROR.NOT_FOUND")
            })
        } catch (e) {
            return res.status(400).json({
                message: req.t("ERROR.UNAUTHORIZED")
            });
        }
    }


module.exports = {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    getEmployeeThing
}
