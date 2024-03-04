const express = require('express');
const router = express.Router();

const userActionLogsController = require('../controllers/user-action-logs.controller');

const authMiddleware = require('../middleware/middleware');

router.get('/', authMiddleware, userActionLogsController.getLogs);

module.exports = router;
