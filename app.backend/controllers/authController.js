const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const { getConfig } = require('../config/env');
const config = getConfig();

const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const register = async (req, res) => {
  try {
    const { email, password, nume, userType = 'user' } = req.body;

    if (!email || !password || !nume) {
      return res.status(400).json({ error: 'Email, password și nume sunt obligatorii' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email-ul este deja înregistrat' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create(email, hashedPassword, nume, userType);

    res.status(201).json({
      message: 'Utilizator creat cu succes. Contul va fi activat după plată.',
      user: { id: user.id, email: user.email, activated: user.activated }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Tipul de utilizator nu este valid') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Eroare la înregistrare' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email și parola sunt obligatorii' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email sau parolă incorectă' });
    }

    if (!user.activated) {
      return res.status(403).json({ error: 'Contul nu este activat. Vă rugăm să efectuați plata abonamentului.' });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email sau parolă incorectă' });
    }

    const token = generateToken(user.id, user.type_name);

    res.json({
      message: 'Autentificare reușită',
      token,
      user: {
        id: user.id,
        email: user.email,
        userType: user.type_name,
        activated: user.activated
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Eroare la autentificare' });
  }
};

module.exports = {
  register,
  login,
  hashPassword,
  verifyPassword,
  generateToken
};