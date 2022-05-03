const mongoose = require('mongoose');


const { Schema } = mongoose;



const profileSchema = Schema(
    {
        fullname: { type: String, maxLength: 200 },

        workFrom: {
            type: String,
            maxLength: 200,
            enum: ["On-Site", "Remote", "Hybrid"]
        },
        seniorityLevel: {
            type: String,
            maxLength: 200,
            enum: ["Junior", "Senior", "Consultant"]
        },
        phone: Number,
        address: { type: String, maxLength: 200 },
        position: { type: String, maxLength: 200 },
        departement: { type: String, maxLength: 200 },
        proEmail: { type: String, maxLength: 200, match: [/.+\@.+\..+/, "Valid email required"], },
        image: { type: String, maxLength: 200 },
        description: { type: String, maxLength: 400 }

    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = { Profile, profileSchema };
