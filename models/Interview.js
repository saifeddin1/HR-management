const mongoose = require('mongoose');


const { Schema } = mongoose;

const interviewSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        date: Date,
        title: String,
        files: String,
        test: [{
            url: String, // coding game for exemple
            title: String, // test angualr node js
            description: String, // ce test est ......
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
