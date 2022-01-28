const mongoose = require('mongoose');


const { Schema } = mongoose;

const ContractSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
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
