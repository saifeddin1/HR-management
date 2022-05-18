const mongoose = require('mongoose');


const { Schema } = mongoose;

const timetableSchema = Schema(
    {
        day: {
            type: String,
            maxLength: 200,
            enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        },
        startedAt: Date,
        endedAt: Date,
        title: { type: String, maxLength: 200 },
        description: { type: String, maxLength: 200 },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = { Timetable, timetableSchema };
