const User = require('../models/User');

const activateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ 
        error: 'ID utilizator invalid',
        code: 'INVALID_USER_ID' 
      });
    }
    const updatedUser = await User.activate(userId);

    if (!updatedUser) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost găsit' });
    }

    res.json({
      message: 'Utilizator activat cu succes',
      user: updatedUser
    });
  } catch (error) {
    console.error('User activation error:', error);
    res.status(500).json({ error: 'Eroare la activarea utilizatorului' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Eroare la încărcarea utilizatorilor' });
  }
};

module.exports = {
  activateUser,
  getAllUsers
};