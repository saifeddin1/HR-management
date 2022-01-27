const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeOffSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        startDate: Date,
        offDays: Number,
        requestedOn: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: "Pending",
        }
    },
    { timestamps: true }
);

const TimeOff = mongoose.model('TimeOff', timeOffSchema);

module.exports = { TimeOff, timeOffSchema };
