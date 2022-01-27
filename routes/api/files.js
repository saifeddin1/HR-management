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
router.get('/employeeFileDetails/:id', fileController.getEmployeeFileDetails);
router.put('/employeeFileDetails/:id', fileController.updateEmployeeFileDetails);
router.delete('/employeeFileDetails/:id', fileController.deleteEmployeeFileDetails);
router.put('/updateEmployeeDetails/:id', fileController.updateEmployeeDetails);

module.exports = router;















