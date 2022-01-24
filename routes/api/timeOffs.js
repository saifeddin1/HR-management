const router = require('express').Router();
const timeOffController = require('../../controllers/timeOff')

router.get('/', timeOffController.getAllTimeOffs);
router.post('/', timeOffController.createNewTimeOff);
router.get('/:id', timeOffController.getOneTimeOff);
router.put('/:id', timeOffController.updateTimeOff);
router.delete('/:id', timeOffController.deleteTimeOff);


module.exports = router;