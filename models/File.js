const mongoose = require('mongoose');
const { ContractSchema } = require('./Contract');
const { profileSchema } = require('./Profile');
const { timeSheetSchema } = require('./TimeSheet')
const { Schema } = mongoose;

const fileSchema = Schema(
    {
        userRef: String,
        userId: String,
        timeOffBalance: Number,
        profile: {
            type: profileSchema,
        }
    },
    { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
