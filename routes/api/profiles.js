const router = require('express').Router();
const profileController = require('../../controllers/profile')

router.get('/', profileController.getAllProfiles);
router.post('/', profileController.createNewProfile);
router.get('/:id', profileController.getOneProfile);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);


module.exports = router;
















