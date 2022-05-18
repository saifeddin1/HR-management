const { logger } = require('../config/logger')
const mongoose = require('mongoose')
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { TimeSheet } = require('../models/TimeSheet');
const { TimeOff } = require('../models/TimeOff');
const { Contract } = require('../models/Contract');
const { Interview } = require('../models/Interview');
const File = require('../models/File');
const YearMonth = require('../models/YearMonth');
const { TimeSheetDeclaration } = require('../models/TimeSheetDeclaration');


const getAll = (Model) =>

    async (req, res) => {
        try {
            var aggregation = aggregationWithFacet(req, res);
            aggregation.unshift({
                $match: {
                    enabled: true
                }
            })

            var filterValue = ''
            if (req.query?.filter) {
                filterValue = req.query.filter
                console.log(filterValue)

                switch (Model) {
                    case Interview:
                        query = [
                            { status: { $regex: filterValue, $options: 'i' } },
                            { title: { $regex: filterValue, $options: 'i' } },
                        ]
                        break;
                    case Contract:
                        query = [
                            { status: { $regex: filterValue, $options: 'i' } },
                            { contractType: { $regex: filterValue, $options: 'i' } },
                            { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        ]
                    case File:
                        query = [
                            { userRef: { $regex: filterValue, $options: 'i' } },
                            { 'profile.fullname': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.phone': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.address': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.position': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.departement': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.proEmail': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.workFrom': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.seniorityLevel': { $regex: filterValue, $options: 'i' } },

                        ]
                    case TimeOff:
                        query = [
                            { ref: { $regex: filterValue, $options: 'i' } },
                            { status: { $regex: filterValue, $options: 'i' } },
                            { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                            { 'startDateSpecs.from': { $regex: filterValue, $options: 'i' } },
                            { 'endDateSpecs.to': { $regex: filterValue, $options: 'i' } },
                        ]

                    default:
                        break;
                }

                aggregation.unshift(
                    {
                        $match: {
                            $or: query
                        }
                    }
                )
            }
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
            if (Model === Contract) {
                if (new Date(req.body.endDate) <= new Date()) {
                    console.log(' endDate in the past ☣️');
                    return res.status(400).json({
                        message: "End date can't be in the past."
                    })
                }
                if (new Date(req.body.endDate) <= new Date(req.body.startDate)) {
                    console.log(' endDate should be greater than start Date ☣️');
                    return res.status(400).json({
                        message: "End Date should be greater than start Date."
                    })
                }
                if ((req.body.hoursNumber < 40 || req.body.hoursNumber > 48)) {
                    console.log('40 < hours number < 48');
                    return res.status(400).json({
                        message: "Hours Number should be between 40 and 48."
                    })
                }

            }
            if (Model === Interview) {
                if (new Date(req.body.date) < new Date()) {
                    console.log(' Date in the past ☣️');
                    return res.status(400).json({
                        message: "Date can't be in the past."
                    })
                }
            }
            if (Model === TimeSheetDeclaration) {
                const exists = await TimeSheetDeclaration
                    .findOne({
                        userId: req.body.userId,
                        month: req.body.month,
                        status: 'declared',
                        enabled: true
                    })
                console.log(exists);
                if (exists) {
                    return res.status(400).json({
                        message: "Current Month Have Already Been Declared."
                    })
                }
            }
            if (Model == File) {
                if (req.body?.timeOffBalance < 0 || req.body?.timeOffBalance > 30) {
                    return res.status(400).json({ message: "Timeoff Balance should be in 0 .. 30 ." })
                }

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


            if (Model == File) {
                if (req.body?.timeOffBalance < 0 || req.body?.timeOffBalance > 30) {
                    return res.status(400).json({ message: "Timeoff Balance should be in 0 .. 30 ." })
                }
            }
            // if (Model === TimeOff) {
            //     if (new Date(req.body.startDateSpecs?.date) < new Date()) {
            //         return res.status(400).json({ message: "Start Date can't be in the past." });
            //     }
            // }
            if (Model === YearMonth) {

                const existingYearMonth = await YearMonth.findOne({ title: req.body.title, enabled: true })
                if (existingYearMonth) {
                    return res.status(400).json({ message: "Year-Month Combination already exists." })
                }

                const { title } = req.body
                if (title?.length < 6 || title?.length > 7 || title.split('-').length !== 2) return res.status(400).json({
                    message: req.t("ERROR.BAD_REQUEST")
                })

                var year = title.split('-')[0]
                var month = title.split('-')[1]

                if (month === "00" || month === "0") return res.status(400).json({
                    message: req.t("ERROR.BAD_REQUEST")
                })

                var months = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

                if (months.includes(month)) {
                    month = "0" + month
                }
                // change 2000 to the company creation year for example 
                /// and 2022 for the current year 


                if (year.length !== 4 || year < "2000" || year > "2022" || month > "12" || month === "0") {

                    return res.status(400).json({
                        message: req.t("ERROR.BAD_REQUEST")
                    })

                }
            }
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
            return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") });
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
            let query = []

            var filterValue = ''
            if (req.query?.filter) {
                filterValue = req.query.filter
                console.log(filterValue)

                switch (Model) {
                    case Interview:
                        query = [
                            { status: { $regex: filterValue, $options: 'i' } },
                            { title: { $regex: filterValue, $options: 'i' } },
                        ]
                        break;
                    case Contract:
                        query = [
                            { status: { $regex: filterValue, $options: 'i' } },
                            { contractType: { $regex: filterValue, $options: 'i' } },
                            { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        ]
                    case File:
                        query = [
                            { userRef: { $regex: filterValue, $options: 'i' } },
                            { 'profile.fullname': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.phone': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.address': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.position': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.departement': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.proEmail': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.workFrom': { $regex: filterValue, $options: 'i' }, },
                            { 'profile.seniorityLevel': { $regex: filterValue, $options: 'i' } },


                        ]
                    case TimeOff:
                        query = [
                            { ref: { $regex: filterValue, $options: 'i' } },
                            { status: { $regex: filterValue, $options: 'i' } },
                            { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                            { 'startDateSpecs.from': { $regex: filterValue, $options: 'i' } },
                            { 'endDateSpecs.to': { $regex: filterValue, $options: 'i' } },

                        ]
                    default:
                        break;
                }

                aggregation.unshift(
                    {
                        $match: {
                            $or: query
                        }
                    }
                )
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
