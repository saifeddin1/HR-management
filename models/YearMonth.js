const mongoose = require('mongoose');
const { Schema } = mongoose;

const YearMonthSchema = Schema(
    {
        title: String,
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);


const YearMonth = mongoose.model('YearMonth', YearMonthSchema);

module.exports = YearMonth;