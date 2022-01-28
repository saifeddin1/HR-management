const router = require('express').Router();
const fileController = require('../../controllers/file')

router.get('/getAllWithQueries', fileController.getAllFilesWithQuries);
// Default CRUD endpoints
router.get('/', fileController.getAllFiles);
router.post('/', fileController.createNewFile);
router.get('/:id', fileController.getOneFile);
router.put('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);

// Manage specific employee file details 
router.get('/employeeFileDetails/:param', fileController.getEmployeeFileDetails);
router.get('/getCollaborators/:param', fileController.getCollaborators);
router.put('/employeeFileDetails/:id', fileController.updateEmployeeFileDetails);
router.delete('/employeeFileDetails/:id', fileController.deleteEmployeeFileDetails);
router.put('/updateEmployeeDetails/:id', fileController.updateEmployeeDetails);


module.exports = router;















