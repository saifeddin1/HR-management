const res = require('express/lib/response');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeSheetDeclarationSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            unique: true
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
            enum: ["declared", "approved", "rejected"],
            default: "declared",
        },
        enabled: {
            type: Boolean,
            default: true,
        }

    },
    { timestamps: true }
);


// TimeSheetDeclarationSchema.pre('save', async function (next) {
//     if (this.status === "Declared") {
//         next(new Error('Cannot update active declarations'));
//     } else {
//         next();
//     }
// })



const TimeSheetDeclaration = mongoose.model('TimeSheetDeclaration', TimeSheetDeclarationSchema);

module.exports = { TimeSheetDeclaration, TimeSheetDeclarationSchema };
