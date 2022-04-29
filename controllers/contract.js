const { Contract } = require('../models/Contract');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const { matchQuery } = require('../utils/matchQuery');
const { getCurrentUserId } = require('../utils/getCurrentUser');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const mongoose = require('mongoose')



module.exports.getAllContracts = factory.getAll(Contract);
module.exports.getOneContract = factory.getOne(Contract);
module.exports.createNewContract = factory.createOne(Contract);
module.exports.updateContract = factory.updateOne(Contract);
module.exports.deleteContract = factory.deleteOne(Contract);
module.exports.getEmployeeContracts = factory.getEmployeeThing(Contract);



module.exports.getEmployeeContractsWithSalary = async (req, res) => {
    // const userId = req.user?.id
    const userId = getCurrentUserId(req, res);
    logger.debug("⚡~ file: contract.js ~ line 19 ~ userId", userId)
    var query = matchQuery(userId);

    var aggregation = aggregationWithFacet(req, res)

    aggregation.unshift({
        '$match': {
            '$or': query
        }
    })
    let filterValue = ''
    if (req.query?.filter) {
        filterValue = req.query.filter
        console.log(filterValue)
        aggregation.unshift(
            {
                $match: {
                    $or: [
                        { status: { $regex: filterValue, $options: 'i' } },
                        { contractType: { $regex: filterValue, $options: 'i' } },
                        { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        { 'user.profile.fullname': { $regex: filterValue, $options: 'i' } },



                    ]
                }
            }
        )
    }

    logger.debug("Incomoing aggregation: ", aggregation);


    aggregation.unshift(

        {
            '$match': {
                enabled: true
            }
        }
    )


    try {
        const contracts = await Contract.aggregate(aggregation);

        logger.debug(contracts);
        return !contracts
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: contracts,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getcontractsSalary() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }

}

module.exports.getAllContractsWithSalaries = async (req, res) => {
    var aggregation = aggregationWithFacet(req, res)

    logger.debug("Incomoing aggregation: ", aggregation);
    let filterValue = ''
    if (req.query?.filter) {
        filterValue = req.query.filter
        console.log(filterValue)
        aggregation.unshift(
            {
                $match: {
                    $or: [
                        { status: { $regex: filterValue, $options: 'i' } },
                        { contractType: { $regex: filterValue, $options: 'i' } },
                        { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        { 'user.profile.fullname': { $regex: filterValue, $options: 'i' } },


                    ]
                }
            }
        )
    }
    aggregation.unshift(

        {
            '$match': {
                enabled: true
            }
        },

    )

    // getting user ref with contract
    aggregation.unshift(
        {
            '$lookup': {
                'from': 'files',
                'let': {
                    'contractUserId': '$userId' // Id of the current file
                },
                // 'localField': '_id',
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$contractUserId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            userRef: 1,
                            profile: {
                                fullname: 1
                            }
                        }
                    }
                ],
                'as': 'user'
            }
        },
        {
            "$unwind": {
                "path": "$user"
            }
        }
    )

    try {
        const contracts = await Contract.aggregate(aggregation);

        logger.debug(contracts);
        return !contracts
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: contracts,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    } catch (e) {
        logger.error(`Error in getAllcontractsSalary() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}

module.exports.updateContractWithSalaries = async (req, res) => {
    const { salary, ...contractFields } = req.body
    const { _id, createdAt, updatedAt, ...salaryFields } = salary
    const { contract_id } = req.params
    let query = {}

    try {

        for (var key in contractFields) {
            query[key] = req.body[key];
        }
        for (var key in salaryFields) {
            query["salary." + key] = req.body['salary'][key];
        }
        console.log("query", query);

        const contract = await Contract.updateOne({ _id: contract_id }, { $set: query })

        if (!contract) return res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
        return res.status(200).json(
            {
                response: contract,
                message: req.t("SUCCESS.RETRIEVED")

            }
        );
    } catch (e) {
        logger.error(`Error in updatecontractsSalary() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}

module.exports.getActiveContract = async (req, res) => {
    const userId = getCurrentUserId(req, res);

    try {
        const activeContract = await Contract.findOne({ userId: userId, status: 'active', enabled: true })
        return !activeContract
            ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
            : res.status(200).json(
                {
                    response: activeContract,
                    message: req.t("SUCCESS.RETRIEVED")

                }
            );
    }
    catch (e) {
        logger.error(`Error in getActiveContract() function: `, e.message)
        return res.status(400).json({ message: req.t("ERROR.BAD_REQUEST") })
    }
}

module.exports.getContractsByUserId = async (req, res) => {
    const userId = req.params.userId
    var aggregation = aggregationWithFacet(req, res);

    aggregation.unshift({
        $match: {
            userId: mongoose.Types.ObjectId(userId),
            enabled: true
        }
    })

    aggregation.unshift(
        {
            '$lookup': {
                'from': 'files',
                'let': {
                    'contractUserId': '$userId'
                },

                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$userId', '$$contractUserId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            userRef: 1,
                            profile: {
                                fullname: 1
                            }
                        }
                    }
                ],
                'as': 'user'
            }
        },
        {
            "$unwind": {
                "path": "$user"
            }
        }
    )

    let filterValue = ''
    if (req.query?.filter) {
        filterValue = req.query.filter
        console.log(filterValue)
        aggregation.unshift(
            {
                $match: {
                    $or: [
                        { status: { $regex: filterValue, $options: 'i' } },
                        { contractType: { $regex: filterValue, $options: 'i' } },
                        { 'user.userRef': { $regex: filterValue, $options: 'i' } },
                        { 'user.profile.fullname': { $regex: filterValue, $options: 'i' } },


                    ]
                }
            }
        )
    }
    try {


        const contractsByUserId = await Contract.aggregate(aggregation);

        return (!contractsByUserId || !contractsByUserId.length) ?
            res.status(404).json({
                message: req.t("ERROR.NOT_FOUND")

            })
            : res.status(200).json({
                response: contractsByUserId,
                message: req.t("SUCCESS.RETRIEVED")
            })
    } catch (e) {
        logger.debug("Error in getContractsbyId => ", e)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")

        });
    }
}