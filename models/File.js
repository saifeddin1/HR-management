const mongoose = require('mongoose');
const { ContractSchema } = require('./Contract')
const { timeSheetSchema } = require('./TimeSheet')
const { Schema } = mongoose;

const fileSchema = Schema(
    {
        userRef: String,
        userId: String
    },
    { timestamps: true }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
