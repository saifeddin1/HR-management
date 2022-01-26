const mongoose = require('mongoose');


const { Schema } = mongoose;

const salarySchema = Schema(
    {
        contract: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contract'
        },
        seniorityDate: String,
        annualCompensation: [{ annual: Number, effective: Number, gross: Number, bonus: Number }]
    },
    { timestamps: true }
);

const Salary = mongoose.model('Salary', salarySchema);

module.exports = { Salary, salarySchema };
