const router = require('express').Router();
const contractController = require('../../controllers/contract')

router.get('/employeeContracts', contractController.getEmployeeContracts);
router.get('/employeeContractsWithSalary', contractController.getEmployeeContractsWithSalary);
router.get('/getAllContractsWithSalaries', contractController.getAllContractsWithSalaries);
router.get('/getContractsByUserId/:userId', contractController.getContractsByUserId);
router.put('/updateContractWithSalaries/:contract_id', contractController.updateContractWithSalaries);
router.get('/getActiveContract', contractController.getActiveContract);
router.get('/getAllActiveContracts', contractController.getAllActiveContracts);
router.get('/', contractController.getAllContracts);
router.post('/', contractController.createNewContract);
router.get('/:id', contractController.getOneContract);
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);


module.exports = router;
