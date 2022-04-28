const { logger } = require('../config/logger')
const mongoose = require('mongoose')
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { TimeSheet } = require('../models/TimeSheet');
const { TimeOff } = require('../models/TimeOff');
const { Contract } = require('../models/Contract');
const { Interview } = require('../models/Interview');
const File = require('../models/File');


const getAll = (Model) =>

    async (req, res) => {
        try {
            var aggregation = aggregationWithFacet(req, res);
            aggregation.unshift({
                $match: {
                    enabled: true
                }
            })
            console.log(Model)
            const objects = await Model.aggregate(aggregation)
            if (!objects || !objects.length) return res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            res.status(200).json({
                response: objects,
                message: req.t("SUCCESS.RETRIEVED")
            })
        } catch (e) {
            logger.error(`Error in getAll() function`, e)
            return res.status(400).json({
                message: req.t("ERROR.BAD_REQUEST")
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
                message: req.t("ERROR.BAD_REQUEST")
            })
        }

    }

const createOne = (Model) =>
    async (req, res) => {

        logger.info("Create One");
        logger.info("Model :", Model.modelName);
        console.log("\n**** ", req.body, " *********\n");
        const object = new Model(req.body);
        logger.info("Object :", object);

        try {
            const active = await Contract.findOne({ userId: object.userId, status: 'active', enabled: true })
            if (Model === Contract && active) {
                console.log('\n Found active contract  ');
                active.status = 'inactive'
                active.save()
                console.log('changed! :', active)

            }
            await object.save();
            logger.info("Saved :", object);
            res.status(201).json(
                {
                    response: object,
                    message: req.t("SUCCESS.CREATED")
                }
            )

        } catch (e) {
            logger.error(`Error in createOne() function: ${e.message}`)
            return res.status(400).json({
                message: req.t("ERROR.BAD_REQUEST")
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

            if (Model === TimeOff && object.status === 'Approved') {
                let offDays = new Date(object.endDateSpecs.date).getDate() - new Date(object.startDateSpecs.date).getDate()
                console.log(offDays);
                // console.log(new Date(object.startDateSpecs.date));
                // console.log(new Date(object.endDateSpecs.date));
                console.log('Model is Timeoff, disbaling related t-sheets', object);
                await TimeSheet.updateMany({
                    userId: object?.userId,
                    date: {
                        "$gte": object.startDateSpecs.date,
                        "$lte": new Date(new Date(object.startDateSpecs.date).getTime() - 1000 * 3600 * 24 * (-offDays))
                    }

                }, { $set: { isDayOff: true } })
            }
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
            logger.error(`Error in deleteOne() function: ${e}`)
            return res.status(400).json({
                message: req.t("ERROR.BAD_REQUEST")
            });
        }

    }

const getEmployeeThing = (Model) =>
    async (req, res) => {

        const userId = getCurrentUserId(req, res);
        var aggregation = aggregationWithFacet(req, res);

        try {
            aggregation.unshift({
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    enabled: true
                }
            })
            if (Model === Interview) {
                var filterValue = ''
                if (req.query?.filter) {
                    filterValue = req.query.filter
                    console.log(filterValue)
                    aggregation.unshift(
                        {
                            $match: {
                                $or: [
                                    { status: { $regex: filterValue, $options: 'i' } },
                                    { title: { $regex: filterValue, $options: 'i' } },

                                ]
                            }
                        }
                    )
                }
            }
            logger.info("Entered Get Employee" + Model.modelName);

            // const employeeWith = await Model.find({ userId: mongoose.Types.ObjectId(userId) });
            const employeeWith = await Model.aggregate(aggregation);
            logger.info(`employeeWith${Model.modelName}`, employeeWith);
            !employeeWith ?
                req.t("ERROR.NOT_FOUND")
                : res.status(200).json({
                    response: employeeWith,
                    message: req.t("SUCCESS.RETRIEVED")
                })
        } catch (e) {
            logger.debug(JSON.stringify(e))
            return res.status(400).json({
                message: req.t("ERROR.BAD_REQUEST")

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
