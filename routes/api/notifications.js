const router = require('express').Router();
const notificationController = require('../../controllers/notification')

// Manage connected employee file details 
// router.get('/getAllWithQueries', notificationController.getAllNotificationsWithQuries);
// router.get('/employeeNotificationDetails', notificationController.getEmployeeNotificationDetails);
// router.get('/getCollaborators', notificationController.getCollaborators);
// router.put('/employeeNotificationDetails', notificationController.updateEmployeeNotificationDetails);
// router.delete('/employeeNotificationDetails', notificationController.deleteEmployeeNotificationDetails);

//  Default factory CRUD endpoints

router.get('/getUserNotifications', notificationController.getUserNotifications);
router.get('/', notificationController.getAllNotifications);
router.post('/', notificationController.createNewNotification);
router.get('/:id', notificationController.getOneNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);


module.exports = router;















