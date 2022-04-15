const router = require('express').Router();
const interviewController = require('../../controllers/interview')

router.get('/employeeInterviews', interviewController.getEmployeeInterviews);
router.post("/upload", interviewController.upload);
router.get("/files", interviewController.getListFiles);
router.get("/upcomingInterviews", interviewController.getUpcomingInterviews);
router.get("/files/:name", interviewController.download);
router.get('/', interviewController.getAllInterviews);
router.post('/', interviewController.createNewInterview);
router.get('/:id', interviewController.getOneInterview);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;