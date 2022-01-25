const mongoose = require('mongoose');


const { Schema } = mongoose;

const fileSchema = Schema(
    {
        userRef: String,
        userId: String,
        contracts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract'
        }],
        timeSheets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeSheet'
        }],
        timeOffs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeOff'
        }],
        profiles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        }],
        interviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interview'
        }],


    },
    { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
