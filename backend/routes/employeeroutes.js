const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, employeeController.getEmployees);
router.post('/', authMiddleware, roleMiddleware(['admin']), employeeController.addEmployee);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), employeeController.updateEmployee);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), employeeController.deleteEmployee);

module.exports = router;
