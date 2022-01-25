const mongoose = require('mongoose');


const { Schema } = mongoose;

const profileSchema = Schema(
    {
        position: String,
        departement: String,
        proEmail: { type: String, unique: true },
        image: String

    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
