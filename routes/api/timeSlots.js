const router = require('express').Router();
const timeSlotController = require('../../controllers/timeSlot')

router.get('/', timeSlotController.getAllTimeSlots);
router.post('/', timeSlotController.createNewTimeSlot);
router.get('/:id', timeSlotController.getOneTimeSlot);
router.put('/:id', timeSlotController.updateTimeSlot);
router.delete('/:id', timeSlotController.deleteTimeSlot);


module.exports = router;


