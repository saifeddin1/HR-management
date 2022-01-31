const router = require('express').Router();
const timeSheetController = require('../../controllers/timeSheet')

router.put('/updateTimeSheetForEmployee/:fileId/:timeSheetId', timeSheetController.updateTimeSheetForEmployee);
router.get('/', timeSheetController.getAllTimeSheets);
router.post('/', timeSheetController.createNewTimeSheet);
router.get('/:id', timeSheetController.getOneTimeSheet);
router.put('/:id', timeSheetController.updateTimeSheet);
router.delete('/:id', timeSheetController.deleteTimeSheet);


module.exports = router;