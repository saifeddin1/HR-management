const mongoose = require('mongoose');


const { Schema } = mongoose;

const timetableSchema = Schema(
    {
        day: {
            type: String,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        },
        startedAt: Date,
        endedAt: Date,
        title: String,
        description: String,
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = { Timetable, timetableSchema };
