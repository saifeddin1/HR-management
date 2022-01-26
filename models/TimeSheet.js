const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeSheetSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        date: Date, // nhar li houwa fih 
        workHours: Number,// 8 //4 
        note: String,
        // TODO
    },
    { timestamps: true }
);

const TimeSheet = mongoose.model('TimeSheet', timeSheetSchema);

module.exports = { TimeSheet, timeSheetSchema };
