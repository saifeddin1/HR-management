const router = require('express').Router();
const fileController = require('../../controllers/file')

router.get('/', fileController.getAllFiles);
router.post('/', fileController.createNewFile);
router.get('/:id', fileController.getOneFile);
router.put('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);


module.exports = router;
















