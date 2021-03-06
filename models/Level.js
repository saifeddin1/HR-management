const mongoose = require('mongoose');
const { Schema } = mongoose;

const LevelSchema = Schema(
    {
        title: {
            type: String,
            maxLength: 200,
            required: "This Field is Required"
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);


const Level = mongoose.model('Level', LevelSchema);
module.exports = Level;