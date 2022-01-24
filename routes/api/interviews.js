const router = require('express').Router();
const interviewController = require('../../controllers/interview')

router.get('/', interviewController.getAllInterviews);
router.post('/', interviewController.createNewInterview);
router.get('/:id', interviewController.getOneInterview);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);


module.exports = router;