const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeSlotSchema = Schema(
    {
        startDate: Date,
        endDate: Date,
        timeSheet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeSheet'
        },
    },
    { timestamps: true }
);

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
