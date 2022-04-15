const mongoose = require('mongoose');
const { Schema } = mongoose;

const YearMonthSchema = Schema(
    {
        title: {
            type: String,
            required: "This Field is Required"
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);


const YearMonth = mongoose.model('YearMonth', YearMonthSchema);

module.exports = YearMonth;