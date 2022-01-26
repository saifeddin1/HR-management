const mongoose = require('mongoose');


const { Schema } = mongoose;

const CollaboratorSchema = Schema(
    {
        position: String,
        departement: String,
        proEmail: { type: String, unique: true },
        image: String,
    },
    { timestamps: true }
)

const profileSchema = Schema(
    {
        position: String,
        departement: String,
        proEmail: { type: String, unique: true },
        image: String,
        collaborators: [{ type: CollaboratorSchema, default: new Object() }]
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
