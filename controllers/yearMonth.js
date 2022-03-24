const YearMonth = require('../models/YearMonth');
const { TimeSheet } = require('../models/TimeSheet');

const factory = require('./factory');
const mongoose = require('mongoose')


module.exports.getAllYearMonths = factory.getAll(YearMonth);
module.exports.getOneYearMonth = factory.getOne(YearMonth);
// module.exports.createNewYearMonth = factory.createOne(YearMonth);
module.exports.updateYearMonth = factory.updateOne(YearMonth);
module.exports.deleteYearMonth = factory.deleteOne(YearMonth);

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports.createNewYearMonth = async (req, res) => {
    const { userId } = req.params
    console.log("\n**** ", req.body, " *********\n");
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

    if (year.length !== 4 || year < "2000" || year > "2022" || month > "12" || month === "0") return res.status(400).json({
        message: req.t("ERROR.BAD_REQUEST")
    })

    let daysCount = daysInMonth(month, year);
    const newYearMonth = new YearMonth({ title: `${year}-${month}` });
    console.log("newYearMonth :", newYearMonth);
    const existingYearMonth = await YearMonth.find({ title: newYearMonth.title })
    try {
        if (!existingYearMonth || !existingYearMonth.length) {
            await newYearMonth.save()
        }
        var timesheets = []
        for (var i = 0; i < daysCount; i++) {
            timesheets.push(TimeSheet.create({
                userId: mongoose.Types.ObjectId(userId),
                date: new Date(year, month - 1, i + 2),
                workingHours: 0,
                note: ''
            }))
        }


        console.log("Saved :", {
            newYearMonth: newYearMonth,
            timesheets: timesheets
        });
        res.status(201).json(
            {
                response: {
                    newYearMonth: newYearMonth,
                    timesheets: timesheets
                },
                message: req.t("SUCCESS.CREATED")
            }
        )

    } catch (e) {
        console.log(`Error in createOne() function: ${e.message}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        })
    }
}

// module.exports.getDistinctYearMonths = async (req, res) => {
//     try {
//         var yearMonthItems;
//         await YearMonth.distinct('_id', (err, docs){
//             if (!docs || !(docs.length)) { return res.status(404).json({ message: req.t("ERROR.NOT_FOUND") }) }
//             yearMonthItems = docs
//         })
//         res.status(200).json({
//             response: objects,
//             message: req.t("SUCCESS.RETRIEVED")
//         })
//     } catch (e) {
//         logger.error(`Error in getAll() function`)
//         return res.status(400).json({
//             message: req.t("ERROR.BAD_REQUEST")
//         });
//     }

// }