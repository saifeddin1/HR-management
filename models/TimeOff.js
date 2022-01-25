const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeOffSchema = Schema(
    {
        startDate: Date,
        endDate: Date,
        status: String
    },
    { timestamps: true }
);

const TimeOff = mongoose.model('TimeOff', timeOffSchema);

module.exports = TimeOff;
