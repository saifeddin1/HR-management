const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeSlotSchema = Schema(
    {
        startDate: Date,
        endDate: Date,
        // timeSheet: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'TimeSheet'
        // },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = { TimeSlot, timeSlotSchema };
