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
        status: {
            type: String,
            default: "Pending",
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
