const mongoose = require('mongoose');


const { Schema } = mongoose;

const timeOffSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        // startDate: {
        //     type: Date,
        //     required: "Start date is required"
        // },
        // offDays: {
        //     type: Number,
        //     required: "Number of days off is required",
        // },
        startDateSpecs: {
            date: Date,
            from: {
                type: String,
                enum: { values: ['morning', 'afternoon'], message: "{VALUE} is not supported, try : morning or afternoon" }
            }
        },
        endDateSpecs: {
            date: Date,
            to: {
                type: String,
                enum: { values: ['morning', 'afternoon'], message: "{VALUE} is not supported, try : morning or afternoon" }
            }
        },
        status: {
            type: String,
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

// timeOffSchema.methods.toJSON = function () {
//     var obj = this.toObject()
//     delete obj.file
//     delete obj.status
//     return obj
// }

const TimeOff = mongoose.model('TimeOff', timeOffSchema);

module.exports = { TimeOff, timeOffSchema };
