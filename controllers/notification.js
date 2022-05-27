const { Notification } = require('../models/Notification')
const factory = require('./factory');
const logger = require('../config/logger').logger;
const mongoose = require('mongoose')
const { matchQuery } = require('../utils/matchQuery');
const { aggregationWithFacet } = require('../utils/aggregationWithFacet');
const { getCurrentUserId } = require('../utils/getCurrentUser');


module.exports.getAllNotifications = factory.getAll(Notification);
module.exports.getOneNotification = factory.getOne(Notification);
// module.exports.createNewNotification = factory.createOne(Notification);
module.exports.updateNotification = factory.updateOne(Notification);
module.exports.deleteNotification = factory.deleteOne(Notification);
module.exports.getUserNotifications = factory.getEmployeeThing(Notification);

module.exports.createNewNotification = async (req, res) => {
    const notif = new Notification({ userId: mongoose.Types.ObjectId(req.body.userId), content: req.body.content })
    try {
        await notif.save()
        return res.json({
            response: notif,
            message: req.t("SUCCESS.CREATED")
        }
        )

    } catch (e) {
        logger.error(`Error in createNewNotification() function: ${e.message}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        })
    }
}

module.exports.getUnreadNotificationsCount = async (req, res) => {
    const userId = getCurrentUserId(req, res);
    query = {
        userId: userId,
        enabled: true,
        isRead: false
    }
    try {
        const unreadNotifs = await Notification.find(query);
        // console.log('\n******', unreadNotifs)
        if (!unreadNotifs) return res.status(404).json({
            message: req.t("ERROR.NOT_FOUND")
        })


        return res.status(200).json({
            response: unreadNotifs.length,
            message: req.t("SUCCESS.RETRIEVED")
        })
    } catch (error) {
        logger.error(`Error in getUnreadNotifs() function: ${error.message}`)
        return res.status(400).json({
            message: req.t("ERROR.BAD_REQUEST")
        })
    }
}