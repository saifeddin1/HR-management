const mongoose = require('mongoose');


const { Schema } = mongoose;


const timeSheetSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        // task: String,
        today: {
            type: Date,
            default: Date.now
        },
        fullDayHours: Number,
        halfDayHours: Number,
        tasks: [{
            taskName: String,
            taskDescription: String,
            workingHours: Number,
        }],
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
