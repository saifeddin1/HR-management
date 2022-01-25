const mongoose = require('mongoose');


const { Schema } = mongoose;

const ContractSchema = Schema(
    {
        contractType: String,
        hoursNumber: Number,
        startDate: Date,
        endDate: Date,
    },
    { timestamps: true }
);

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract;
