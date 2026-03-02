const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, attendanceController.getAttendance);
router.post('/mark', authMiddleware, roleMiddleware(['admin']), attendanceController.markAttendance);
router.get('/analytics', authMiddleware, attendanceController.getAnalytics);
router.get('/weekly', authMiddleware, attendanceController.getWeeklySummary);

module.exports = router;
