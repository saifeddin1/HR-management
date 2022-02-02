const mongoose = require('mongoose');
// const { salarySchema } = require('./salarySchema')

const { Schema } = mongoose;

const ContractSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        // salary: {
        //     type: salarySchema
        // },
        contractType: String,
        hoursNumber: Number,
        startDate: Date,
        endDate: Date,
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = { Contract, ContractSchema };
