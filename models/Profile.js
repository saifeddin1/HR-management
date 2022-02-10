const mongoose = require('mongoose');


const { Schema } = mongoose;



const profileSchema = Schema(
    {
        jobType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Contact", "Internship"]
        },
        workFrom: {
            type: String,
            enum: ["On-Site", "Remote", "Hybrid"]
        },
        seniorityLevel: {
            type: String,
            enum: ["Junior", "Senior", "Consultant"]
        },
        phone: Number,
        address: String,
        position: String,
        departement: String,
        proEmail: { type: String, required: false },
        image: String,

    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Profile, profileSchema };
