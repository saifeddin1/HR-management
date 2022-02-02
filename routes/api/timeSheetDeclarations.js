const router = require('express').Router();
const timeSheetDeclarationController = require('../../controllers/timeSheetDeclaration')

router.get('/getEmployeeDeclarations', timeSheetDeclarationController.getEmployeeDeclarations);
router.put('/updateStatus/:declarationId', timeSheetDeclarationController.updateDeclarationStatus);
router.get('/', timeSheetDeclarationController.getAllTimeSheetDeclarations);
router.post('/createDeclarationAsEmployee', timeSheetDeclarationController.createDeclarationAsEmployee);
router.post('/', timeSheetDeclarationController.createNewTimeSheetDeclaration);
router.get('/:id', timeSheetDeclarationController.getOneTimeSheetDeclaration);
router.put('/:id', timeSheetDeclarationController.updateTimeSheetDeclaration);
router.delete('/:id', timeSheetDeclarationController.deleteTimeSheetDeclaration);


module.exports = router;