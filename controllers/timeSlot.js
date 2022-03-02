const { TimeSlot } = require('../models/TimeSlot');
const { getCurrentUserId } = require('../utils/getCurrentUser');

const factory = require('./factory');

module.exports.getAllTimeSlots = factory.getAll(TimeSlot);
module.exports.getOneTimeSlot = factory.getOne(TimeSlot);
module.exports.createNewTimeSlot = factory.createOne(TimeSlot);
module.exports.updateTimeSlot = factory.updateOne(TimeSlot);
module.exports.deleteTimeSlot = factory.deleteOne(TimeSlot);
module.exports.getEmployeeTimeslots = factory.getEmployeeThing(TimeSlot)



// module.exports.getWeekTimeslots = async (req, res) => {
//     const userId = getCurrentUserId();
//     const { dateParam } = req.params;

//     try {
//         const weekTimeSlots = await TimeSheetDeclaration.findOne({ userId: userId, month: month, enabled: true });
//         return !currentDeclaration
//             ? res.status(404).json({ message: req.t("ERROR.NOT_FOUND") })
//             : res.status(200).json(
//                 {
//                     response: currentDeclaration,
//                     message: req.t("SUCCESS.RETRIEVED")
//                 }
//             );
//     } catch (e) {
//         return res.status(400).json({
//             message: req.t("ERROR.UNAUTHORIZED")
//         });
//     }
// }