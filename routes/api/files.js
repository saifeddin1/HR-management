const router = require('express').Router();
const fileController = require('../../controllers/file')

// Manage connected employee file details 
router.get('/getAllWithQueries', fileController.getAllFilesWithQuries);
router.get('/employeeFileDetails', fileController.getEmployeeFileDetails);
router.get('/getCollaborators', fileController.getCollaborators);
router.put('/employeeFileDetails', fileController.updateEmployeeFileDetails);
router.delete('/employeeFileDetails', fileController.deleteEmployeeFileDetails);

// Default factory CRUD endpoints
router.get('/', fileController.getAllFiles);
router.post('/', fileController.createNewFile);
router.get('/:id', fileController.getOneFile);
router.put('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);


module.exports = router;















