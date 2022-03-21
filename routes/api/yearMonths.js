const router = require('express').Router();
const yearMonthController = require('../../controllers/yearMonth')

router.get('/', yearMonthController.getAllYearMonths);
router.post('/:userId', yearMonthController.createNewYearMonth);
router.get('/:id', yearMonthController.getOneYearMonth);
router.put('/:id', yearMonthController.updateYearMonth);
router.delete('/:id', yearMonthController.deleteYearMonth);


module.exports = router;