const mongoose = require('mongoose');


const { Schema } = mongoose;



const profileSchema = Schema(
    {
        file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        },
        position: String,
        departement: String,
        proEmail: { type: String, required: false },
        image: String,
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile'
            }
        ]
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Profile, profileSchema };
