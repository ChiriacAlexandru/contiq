const express = require('express');
const { body } = require('express-validator');
const BrandsController = require('../controllers/brandsController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Validation rules
const brandValidation = [
  body('nume')
    .trim()
    .notEmpty()
    .withMessage('Numele brand-ului este obligatoriu')
    .isLength({ min: 2, max: 255 })
    .withMessage('Numele brand-ului trebuie să aibă între 2 și 255 caractere'),
  
  body('cod')
    .trim()
    .notEmpty()
    .withMessage('Codul brand-ului este obligatoriu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Codul brand-ului trebuie să aibă între 2 și 50 caractere'),
  
  body('descriere')
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 })
    .withMessage('Descrierea nu poate avea mai mult de 1000 caractere'),
  
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Website-ul trebuie să fie o adresă URL validă'),
  
  body('contact_email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Email-ul de contact trebuie să fie valid'),
  
  body('contact_telefon')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[\d\s\-\(\)]{7,20}$/)
    .withMessage('Numărul de telefon nu este valid'),
  
  body('logo_path')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Calea către logo trebuie să fie o adresă URL validă'),
  
  body('activ')
    .optional()
    .isBoolean()
    .withMessage('Statusul activ trebuie să fie true sau false')
];

// Routes
router.get('/', authenticateToken, BrandsController.getBrands);
router.get('/active', authenticateToken, BrandsController.getActiveBrands);
router.get('/:id', authenticateToken, BrandsController.getBrand);
router.post('/', authenticateToken, brandValidation, BrandsController.createBrand);
router.put('/:id', authenticateToken, brandValidation, BrandsController.updateBrand);
router.delete('/:id', authenticateToken, BrandsController.deleteBrand);

module.exports = router;