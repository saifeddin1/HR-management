const { Contract } = require('../models/Contract');
const factory = require('./factory');
const logger = require('../config/logger').logger;
const { matchQuery } = require('../utils/matchQuery');

module.exports.getAllContracts = factory.getAll(Contract);
module.exports.getOneContract = factory.getOne(Contract);
module.exports.createNewContract = factory.createOne(Contract);
module.exports.updateContract = factory.updateOne(Contract);
module.exports.deleteContract = factory.deleteOne(Contract);
module.exports.getEmployeeContracts = factory.getEmployeeThing(Contract);



module.exports.getEmployeeContractsWithSalary = async (req, res) => {
    const userId = req.user?.id

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
            '$lookup': {
                'from': 'salaries',
                'let': {
                    'contractId': '$_id'
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$contract', '$$contractId'
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        '$project': {
                            seniorityDate: 1,
                            annualCompensation: 1
                        }
                    }
                ],
                'as': 'salaries'
            }
        },
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
        return res.status(400).json({ message: req.t("ERROR.UNAUTHORIZED") })
    }

}