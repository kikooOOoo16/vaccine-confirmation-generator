const express = require('express');
const router = express.Router();

const logsController = require('../controllers/logs');

const authMiddleware = require('../middleware/middleware');


router.get('/', authMiddleware, logsController.getLogs);

module.exports = router;