const router = require('express').Router();

const apiVersion = '/api/v1'

router.use(`${apiVersion}/files`, require('./api/files'));
router.use(`${apiVersion}/contracts`, require('./api/contracts'));
router.use(`${apiVersion}/salaries`, require('./api/salaries'));
router.use(`${apiVersion}/interviews`, require('./api/interviews'));
router.use(`${apiVersion}/profiles`, require('./api/profiles'));
router.use(`${apiVersion}/timeOffs`, require('./api/timeOffs'));
router.use(`${apiVersion}/timeSheets`, require('./api/timeSheets'));
router.use(`${apiVersion}/timeSheetDeclarations`, require('./api/timeSheetDeclarations'));
router.use(`${apiVersion}/timeSlots`, require('./api/timeSlots'));
router.use(`${apiVersion}/notifications`, require('./api/notifications'));
router.use(`${apiVersion}/yearMonths`, require('./api/yearMonths'));
router.use(`${apiVersion}/users`, require('./api/users'));

module.exports = router;
