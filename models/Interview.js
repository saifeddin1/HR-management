const mongoose = require('mongoose');


const { Schema } = mongoose;

const interviewSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        dateLastInterview: Date,
        fileLastInterview: String,
        history: String,
        certifications: String,
        trainingsExpectations: [{ training: { type: String, required: false } }]

    },
    { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = { Interview, interviewSchema };
