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
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

// fileSchema.pre('save', async function (next, req, res) {
//     const file = this;
//     if (!file.enabled) {
//         res.status(400).sent('Disabled')
//     }
//     next();
// });

const File = mongoose.model('File', fileSchema);

module.exports = File;
