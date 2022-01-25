const router = require('express').Router();
const contractController = require('../../controllers/contract')

// console.log('yheeeeeeeeee' +  contractController.getAllContracts);
router.get('/', contractController.getAllContracts);
router.post('/', contractController.createNewContract);
router.get('/:id', contractController.getOneContract);
router.put('/:id', contractController.updateContract);
router.delete('/:id', contractController.deleteContract);


module.exports = router;
