const router = require('express').Router();
const workFromController = require('../../controllers/workFrom')


router.get('/', workFromController.getAllWorkFroms);
router.post('/', workFromController.createNewWorkFrom);
router.get('/:id', workFromController.getOneWorkFrom);
router.put('/:id', workFromController.updateWorkFrom);
router.delete('/:id', workFromController.deleteWorkFrom);


module.exports = router;