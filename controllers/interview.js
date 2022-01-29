const { Interview } = require('../models/Interview');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');

const factory = require('./factory');

module.exports.getAllInterviews = factory.getAll(Interview);
module.exports.getOneInterview = factory.getOne(Interview);
module.exports.createNewInterview = factory.createOne(Interview);
module.exports.updateInterview = factory.updateOne(Interview);
module.exports.deleteInterview = factory.deleteOne(Interview);


module.exports.getInerviewsSorted = async (req, res) => {
    var aggregation = aggregationWithFacet(req, res)
    console.log("before try, aggrgegatiojn :", aggregation);

    try {

        const objects = await Interview.aggregate(aggregation)

        console.log("objects  :", objects[0]);

        res.status(200).json({
            response: objects,
            message: objects?.length > 0 ? `Interviews retrieved` : `No Interviews found`
        })
    } catch (e) {
        return res.status(400).send(e);
    }


}
