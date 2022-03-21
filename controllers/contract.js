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

    var aggregation = [
        {
            '$match': {
                '$or': query
            }
        }
    ]

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
    var aggregation = aggregationWithFacet()

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
