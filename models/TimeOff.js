const mongoose = require('mongoose');
const { makeRef } = require('../utils/makeRef')


const { Schema } = mongoose;

const timeOffSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        ref: {
            type: String, maxLength: 200,
            default: `Timeoff-${makeRef(3)}`
        },
        startDateSpecs: {
            date: Date,
            from: {
                type: String,
                maxLength: 200,
                enum: { values: ['morning', 'afternoon'], message: "{VALUE} is not supported, try : morning or afternoon" }
            }
        },
        endDateSpecs: {
            date: Date,
            to: {
                type: String,
                maxLength: 200,
                enum: { values: ['morning', 'afternoon'], message: "{VALUE} is not supported, try : morning or afternoon" }
            }
        },
        status: {
            type: String,
            maxLength: 200,
            default: "Pending",
            enum: { values: ['Pending', 'Approved', 'Rejected'], message: "{VALUE} is not supported. Value should be in ['Pending', 'Approved', 'Rejected'] " }
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);


const TimeOff = mongoose.model('TimeOff', timeOffSchema);

module.exports = { TimeOff, timeOffSchema };
