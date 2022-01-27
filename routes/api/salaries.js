const router = require('express').Router();
const salaryController = require('../../controllers/salary')

router.get('/', salaryController.getAllSalarys);
router.post('/', salaryController.createNewSalary);
router.get('/:id', salaryController.getOneSalary);
router.put('/:id', salaryController.updateSalary);
router.delete('/:id', salaryController.deleteSalary);


module.exports = router;
