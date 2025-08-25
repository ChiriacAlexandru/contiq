const express = require('express');
const router = express.Router();
const { activateUser, getAllUsers } = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.put('/activate-user/:userId', authenticateToken, requireAdmin, activateUser);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);

module.exports = router;