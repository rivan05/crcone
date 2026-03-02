const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/pending-users', authMiddleware, roleMiddleware(['admin']), adminController.getPendingUsers);
router.post('/approve-user', authMiddleware, roleMiddleware(['admin']), adminController.approveUser);
router.get('/history', authMiddleware, roleMiddleware(['admin']), adminController.getHistory);

module.exports = router;
