const router = require('express').Router();
const timeSheetDeclarationController = require('../../controllers/timeSheetDeclaration')

router.get('/getEmployeeDeclarations/:param', timeSheetDeclarationController.getEmployeeDeclarations);
router.get('/', timeSheetDeclarationController.getAllTimeSheetDeclarations);
router.post('/', timeSheetDeclarationController.createNewTimeSheetDeclaration);
router.get('/:id', timeSheetDeclarationController.getOneTimeSheetDeclaration);
router.put('/updateStatus/:id', timeSheetDeclarationController.updateDeclarationStatus);
router.put('/:id', timeSheetDeclarationController.updateTimeSheetDeclaration);
router.delete('/:id', timeSheetDeclarationController.deleteTimeSheetDeclaration);


module.exports = router;