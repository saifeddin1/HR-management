const router = require('express').Router();
const timeOffController = require('../../controllers/timeOff')

router.get('/employeeTimeoffHistory', timeOffController.employeeTimeoffHistory);
router.get('/', timeOffController.getAllTimeOffs);
router.post('/createTimeOffAsEmployee', timeOffController.createTimeOffAsEmployee);
router.post('/', timeOffController.createNewTimeOff);
router.get('/:id', timeOffController.getOneTimeOff);
// router.get('/employeeTimeoffDetails/:id', timeOffController.employeeTimeoffDetails);
router.put('/updateEmployeeTimeoff/:id', timeOffController.updateEmployeeTimeoff);
router.put('/updateStatus/:id', timeOffController.updateStatus);
router.put('/:id', timeOffController.updateTimeOff);
router.delete('/:id', timeOffController.deleteTimeOff);


module.exports = router;