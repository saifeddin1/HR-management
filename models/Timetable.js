const mongoose = require('mongoose');


const { Schema } = mongoose;

const timetableSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        day: {
            type: String,
            enum: ["monday", "tuesday"]
        },
        title: String, // Matiere text ... ddaedfaedaza
        description: String, // description
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = { Timetable, timetableSchema };
