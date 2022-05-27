const res = require('express/lib/response');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeSheetDeclarationSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,

        },
        month: {
            type: Number,
            enum: {
                values: [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12],
                message: "{VALUE} is not a valid month"
            }
        },
        status: {
            type: String,
            maxLength: 200,
            enum: { values: ["declared", "approved", "rejected"], message: "{VALUE} is not supported" },
            default: "declared",
        },
        declaredHours: {
            type: Number
        },
        extraHours: {
            type: Number
        },
        enabled: {
            type: Boolean,
            default: true,
        }

    },
    { timestamps: true }
);


const TimeSheetDeclaration = mongoose.model('TimeSheetDeclaration', TimeSheetDeclarationSchema);

module.exports = { TimeSheetDeclaration, TimeSheetDeclarationSchema };
