const express = require('express');
const router = express.Router();
const { getProfile, updateUserDetails, updateCompanyData } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserDetails, validateCompanyData } = require('../middleware/validation');

router.get('/profile', authenticateToken, getProfile);
router.put('/profile/details', authenticateToken, validateUserDetails, updateUserDetails);
router.put('/profile/company', authenticateToken, validateCompanyData, updateCompanyData);

module.exports = router;