const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeSheetSchema = Schema(
    {
        startDate: Date,
        endDate: Date
    },
    { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = TimeSheet;
