const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeSlotSchema = Schema(
    {
        start: Date,
        end: Date,
        description: String,
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = { TimeSlot, timeSlotSchema };
