const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const CompanyData = require('../models/CompanyData');

const getProfile = async (req, res) => {
  try {
    const profile = await User.getProfile(req.user.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Profilul nu a fost găsit' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Eroare la încărcarea profilului' });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const updated = await UserDetails.update(req.user.userId, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Detaliile utilizatorului nu au fost găsite' });
    }

    res.json({ message: 'Profil actualizat cu succes', details: updated });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Eroare la actualizarea profilului' });
  }
};

const updateCompanyData = async (req, res) => {
  try {
    const result = await CompanyData.createOrUpdate(req.user.userId, req.body);

    res.json({ message: 'Date firmă actualizate cu succes', company: result });
  } catch (error) {
    console.error('Company update error:', error);
    res.status(500).json({ error: 'Eroare la actualizarea datelor firmei' });
  }
};

module.exports = {
  getProfile,
  updateUserDetails,
  updateCompanyData
};