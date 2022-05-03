const mongoose = require('mongoose');


const { Schema } = mongoose;

const NotificationSchema = Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        content: {
            type: String,
            maxLength: 200,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        enabled: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Notification, NotificationSchema };
