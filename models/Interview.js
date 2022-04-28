const mongoose = require('mongoose');


const { Schema } = mongoose;

const interviewSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        status: {
            type: String,
            enum: { values: ['new', 'confirmed', 'canceled'], message: 'Unknown value {VALUE}.' },
            default: 'confirmed'
        },
        date: Date,
        title: String,
        files: String,
        test: [{
            url: String,
            title: String,
            description: String,
        }],
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = { Interview, interviewSchema };
