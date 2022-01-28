const { Interview } = require('../models/Interview');

const factory = require('./factory');

module.exports.getAllInterviews = factory.getAll(Interview);
module.exports.getOneInterview = factory.getOne(Interview);
module.exports.createNewInterview = factory.createOne(Interview);
module.exports.updateInterview = factory.updateOne(Interview);
module.exports.deleteInterview = factory.deleteOne(Interview);


module.exports.getInerviewsSorted = async (req, res) => {
    var pageNumber = 0;
    if (req?.query?.page) {
        pageNumber = Number(req?.query?.page);
    }
    var limitNumber = 10;  // default value 10
    if (req?.query?.limit) {
        limitNumber = Number(req?.query?.limit);
    }
    var sort = {}
    if (req?.query?.sortBy && req?.query?.orderBy) {
        sort[req.query.sortBy] = req.query.orderBy === 'desc' ? -1 : 1
    }

    console.log(sort.length);
    var aggregation = [
        {
            '$facet': {
                'totalData': [
                    {
                        '$sort': Object.keys(sort).length ? sort : { '_id': 1 }
                    },
                    {
                        '$skip': Math.floor(pageNumber * limitNumber),
                    },
                    {
                        '$limit': limitNumber,
                    },
                ],
                'totalCount': [
                    {
                        '$count': 'count'
                    }
                ]
            }
        }
    ]

    console.log("before try, aggrgegatiojn :", aggregation);

    try {

        const objects = await Interview.aggregate(aggregation)

        // const obj = await objects.find({ _id: "1111" });
        console.log("objects  :", objects[0]);

        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? `Interviews retrieved` : `No Interviews found`
        })
    } catch (e) {
        return res.status(400).send(e);
    }


}
