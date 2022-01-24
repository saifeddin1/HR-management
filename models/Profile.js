const mongoose = require('mongoose');


const { Schema } = mongoose;

const profileSchema = Schema(
    {
        position: String,
        departement: String,
        proEmail: { type: String, unique: true },
        image: String,
        createdAt: {
            type: Date,
            default: Date.now()
        },
        UpdatedAt: Date
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
