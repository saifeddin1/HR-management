const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeOffSchema = Schema(
    {

        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        startDate: Date,
        endDate: Date,
        status: String
    },
    { timestamps: true }
);

const TimeOff = mongoose.model('TimeOff', timeOffSchema);

module.exports = { TimeOff, timeOffSchema };
