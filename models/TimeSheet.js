const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeSheetSchema = Schema(
    {
        startDate: Date,
        endDate: Date,
        createdAt: {
            type: Date,
            default: Date.now()
        },
        UpdatedAt: String
    },
    { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = TimeSheet;
