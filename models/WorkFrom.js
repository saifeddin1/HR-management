const mongoose = require('mongoose');
const { Schema } = mongoose;

const WorkFromSchema = Schema(
    {
        title: {
            type: String,
            maxLength: 200,
            required: "This Field is Required"
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);


const WorkFrom = mongoose.model('WorkFrom', WorkFromSchema);
module.exports = WorkFrom;