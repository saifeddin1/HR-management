const mongoose = require('mongoose');


const { Schema } = mongoose;


const timeSheetSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        date: {
            type: Date,
            default: Date.now
        },
        workingHours: Number, 
        week: {
            startDate: Date,
            endDate: Date
        },
        note: String,

    },
    { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = { TimeSheet, timeSheetSchema };
