const mongoose = require('mongoose');


const { Schema } = mongoose;


const timeSheetSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        date: {
            type: Date,
            default: Date.now
        },
        workingHours: Number,
        note: String,
        enabled: {
            type: Boolean,
            default: true,
        }

    },
    { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = { TimeSheet, timeSheetSchema };
