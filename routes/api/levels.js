const router = require('express').Router();
const levelController = require('../../controllers/level')


router.get('/', levelController.getAllLevels);
router.post('/', levelController.createNewLevel);
router.get('/:id', levelController.getOneLevel);
router.put('/:id', levelController.updateLevel);
router.delete('/:id', levelController.deleteLevel);


module.exports = router;