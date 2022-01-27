const router = require('express').Router();
const timeOffController = require('../../controllers/timeOff')

router.get('/', timeOffController.getAllTimeOffs);
router.post('/', timeOffController.createNewTimeOff);
router.get('/:id', timeOffController.getOneTimeOff);
router.get('/employeeTimeoffHistory/:id', timeOffController.employeeTimeoffHistory);
router.get('/employeeTimeoffDetails/:id', timeOffController.employeeTimeoffDetails);
router.put('/updateEmployeeTimeoff/:id', timeOffController.updateEmployeeTimeoff);
router.delete('/deleteEmployeeTimeoff/:id', timeOffController.deleteEmployeeTimeoff);
router.put('/:id', timeOffController.updateTimeOff);
router.delete('/:id', timeOffController.deleteTimeOff);


module.exports = router;