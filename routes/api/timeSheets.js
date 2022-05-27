const router = require('express').Router();
const timeSheetController = require('../../controllers/timeSheet')

router.put('/updateTimeSheetForEmployee/:timeSheetId', timeSheetController.updateTimeSheetForEmployee);
router.get('/getCurrentTimesheet/:date', timeSheetController.getCurrentTimesheet);
router.get('/getEmployeeTimeSheets', timeSheetController.getEmployeeTimeSheets);
router.get('/getMonthlyHours/:date', timeSheetController.getMonthlyHours);
router.get('/getMonthlyEmployeeTimesheets/:yearMonth', timeSheetController.getMonthlyEmployeeTimesheets);
router.get('/getTimesheetsByUserId/:yearMonth/:userId', timeSheetController.getTimesheetsByUserId);
router.get('/', timeSheetController.getAllTimeSheets);
router.post('/', timeSheetController.createNewTimeSheet);
router.get('/:id', timeSheetController.getOneTimeSheet);
router.put('/:id', timeSheetController.updateTimeSheet);
router.delete('/:id', timeSheetController.deleteTimeSheet);


module.exports = router;  