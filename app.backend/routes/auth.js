const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/security');

// Apply rate limiting to all auth routes
router.use(authLimiter);

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

module.exports = router;