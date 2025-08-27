const express = require('express');
const { body } = require('express-validator');
const SuppliersController = require('../controllers/suppliersController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Validation rules
const supplierValidation = [
  body('nume')
    .trim()
    .notEmpty()
    .withMessage('Numele furnizorului este obligatoriu')
    .isLength({ min: 2, max: 255 })
    .withMessage('Numele furnizorului trebuie să aibă între 2 și 255 caractere'),
  
  body('cod')
    .trim()
    .notEmpty()
    .withMessage('Codul furnizorului este obligatoriu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Codul furnizorului trebuie să aibă între 2 și 50 caractere'),
  
  body('cui')
    .optional({ checkFalsy: true })
    .matches(/^RO[\d]{2,10}$/)
    .withMessage('CUI-ul trebuie să aibă formatul RO urmat de 2-10 cifre'),
  
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Email-ul trebuie să fie valid'),
  
  body('telefon')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[\d\s\-\(\)]{7,20}$/)
    .withMessage('Numărul de telefon nu este valid'),
  
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('Website-ul trebuie să fie o adresă URL validă'),
  
  body('reprezentant_email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Email-ul reprezentantului trebuie să fie valid'),
  
  body('reprezentant_telefon')
    .optional({ checkFalsy: true })
    .matches(/^[\+]?[\d\s\-\(\)]{7,20}$/)
    .withMessage('Telefonul reprezentantului nu este valid'),
  
  body('cod_postal')
    .optional({ checkFalsy: true })
    .matches(/^[\d]{6}$/)
    .withMessage('Codul poștal trebuie să aibă 6 cifre'),
  
  body('termeni_plata')
    .optional({ checkFalsy: true })
    .isIn(['cash', 'transfer', 'card', 'credit'])
    .withMessage('Termenii de plată nu sunt valizi'),
  
  body('zile_plata')
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 365 })
    .withMessage('Zilele de plată trebuie să fie între 0 și 365'),
  
  body('rating')
    .optional({ checkFalsy: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating-ul trebuie să fie între 1 și 5'),
  
  body('activ')
    .optional()
    .isBoolean()
    .withMessage('Statusul activ trebuie să fie true sau false')
];

// Routes
router.get('/', authenticateToken, SuppliersController.getSuppliers);
router.get('/active', authenticateToken, SuppliersController.getActiveSuppliers);
router.get('/:id', authenticateToken, SuppliersController.getSupplier);
router.post('/', authenticateToken, supplierValidation, SuppliersController.createSupplier);
router.put('/:id', authenticateToken, supplierValidation, SuppliersController.updateSupplier);
router.delete('/:id', authenticateToken, SuppliersController.deleteSupplier);

module.exports = router;