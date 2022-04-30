const mongoose = require('mongoose');


const { Schema } = mongoose;

const salarySchema = Schema(
    {

        seniority: Number,
        annualCompensation: {
            annual: { type: Number, min: [5, 'Minimum 5'], max: 999999 },
            effective: { type: Number, min: [5, 'Minimum 5'], max: 999999 }
            , gross: { type: Number, min: [5, 'Minimum 5'], max: 999999 }
            , bonus: { type: Number, min: [5, 'Minimum 5'], max: 999999 }
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Salary = mongoose.model('Salary', salarySchema);

module.exports = { Salary, salarySchema };
