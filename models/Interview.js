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
            default: 'new'
        },
        date: Date,
        title: { type: String, maxLength: 200 },
        files: String,
        test: {
            url: { type: String, maxLength: 200 },
            title: { type: String, maxLength: 200 },
            description: { type: String, maxLength: 400 },
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = { Interview, interviewSchema };
