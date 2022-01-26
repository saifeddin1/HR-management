const mongoose = require('mongoose');


const { Schema } = mongoose;

const timetableSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        startDate: Date,
        endDate: Date
    },
    { timestamps: true }
);

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = { Timetable, timetableSchema };
