const express = require('express');
const router = express.Router();
const { getProfile, updateUserDetails, updateCompanyData } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserDetails, validateCompanyData } = require('../middleware/validation');
const { userLimiter } = require('../middleware/security');

// Apply rate limiting to all user routes
router.use(userLimiter);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile/details', authenticateToken, validateUserDetails, updateUserDetails);
router.put('/profile/company', authenticateToken, validateCompanyData, updateCompanyData);

module.exports = router;