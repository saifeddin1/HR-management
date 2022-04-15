const router = require('express').Router();
const contractTypeController = require('../../controllers/contractType')


router.get('/', contractTypeController.getAllContractTypes);
router.post('/', contractTypeController.createNewContractType);
router.get('/:id', contractTypeController.getOneContractType);
router.put('/:id', contractTypeController.updateContractType);
router.delete('/:id', contractTypeController.deleteContractType);


module.exports = router;