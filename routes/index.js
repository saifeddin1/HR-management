const router = require('express').Router();

const apiVersion = '/api/v1'

router.use(`${apiVersion}/contracts`, require('./api/contracts'));
router.use(`${apiVersion}/interviews`, require('./api/interviews'));
router.use(`${apiVersion}/profiles`, require('./api/profiles'));
router.use(`${apiVersion}/timeOffs`, require('./api/timeOffs'));
router.use(`${apiVersion}/timeSheets`, require('./api/timeSheets'));
router.use(`${apiVersion}/users`, require('./api/users'));

module.exports = router;
