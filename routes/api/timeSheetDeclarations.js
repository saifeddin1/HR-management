const router = require('express').Router();
const timeSheetDeclarationController = require('../../controllers/timeSheetDeclaration')

router.get('/getEmployeeDeclarations', timeSheetDeclarationController.getEmployeeDeclarations);
router.get('/getCurrentDeclaration/:month', timeSheetDeclarationController.getCurrentDeclaration);
router.get('/getApprovedRejected', timeSheetDeclarationController.getApprovedRejected);

router.get('/:id', timeSheetDeclarationController.getOneTimeSheetDeclaration);
router.get('/', timeSheetDeclarationController.getAllTimeSheetDeclarations);
router.post('/createDeclarationAsEmployee', timeSheetDeclarationController.createDeclarationAsEmployee);
router.post('/', timeSheetDeclarationController.createNewTimeSheetDeclaration);
router.put('/updateStatus/:id', timeSheetDeclarationController.updateDeclarationStatus);
router.put('/:id', timeSheetDeclarationController.updateTimeSheetDeclaration);
// router.put('/updateStatus/:declarationId', timeSheetDeclarationController.updateDeclarationStatus);
router.delete('/:id', timeSheetDeclarationController.deleteTimeSheetDeclaration);


module.exports = router;