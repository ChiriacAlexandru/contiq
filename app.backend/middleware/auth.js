const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/env');

const config = getConfig();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      code: 'TOKEN_MISSING' 
    });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      const errorCode = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        code: errorCode 
      });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.userType !== 'administrator') {
    return res.status(403).json({ error: 'Acces interzis. Doar administratorii au acces la această funcționalitate.' });
  }
  next();
};

const requireAccountant = (req, res, next) => {
  if (req.user.userType !== 'contabil' && req.user.userType !== 'administrator') {
    return res.status(403).json({ error: 'Acces interzis. Doar contabilii și administratorii au acces la această funcționalitate.' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAccountant
};