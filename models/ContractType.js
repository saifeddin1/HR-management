const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContractTypeSchema = Schema(
    {
        title: {
            type: String, maxLength: 200,
            required: "This Field is Required"
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);


const ContractType = mongoose.model('ContractType', ContractTypeSchema);
module.exports = ContractType;