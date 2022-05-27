const mongoose = require('mongoose');
const { salarySchema } = require('../models/Salary')

const { Schema } = mongoose;

const ContractSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        salary: {
            type: salarySchema
        },
        status: {
            type: String,
            enum: { values: ['active', 'inactive'], message: "Value {VALUE} NOT SUPPORTED." },
            default: 'active'
        },
        timesheetType: {
            type: String,
            maxLength: 200,
            enum: ['ADMINISTRATIVE', 'NON ADMINISTRATIVE'],
            // required: "This field is required"
        },
        contractType: { type: String, maxLength: 200 },
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
