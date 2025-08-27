const express = require('express');
const { body } = require('express-validator');
const ProductsController = require('../controllers/productsController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Validation rules
const productValidation = [
  body('nume')
    .trim()
    .notEmpty()
    .withMessage('Numele produsului este obligatoriu')
    .isLength({ min: 2, max: 255 })
    .withMessage('Numele produsului trebuie să aibă între 2 și 255 caractere'),
  
  body('cod')
    .trim()
    .notEmpty()
    .withMessage('Codul produsului este obligatoriu')
    .isLength({ min: 2, max: 100 })
    .withMessage('Codul produsului trebuie să aibă între 2 și 100 caractere'),
  
  body('pret_vanzare')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Prețul de vânzare trebuie să fie un număr pozitiv'),
  
  body('pret_achizitie')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Prețul de achiziție trebuie să fie un număr pozitiv'),
  
  body('stoc_actual')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Stocul actual trebuie să fie un număr întreg pozitiv'),
  
  body('stoc_minim')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Stocul minim trebuie să fie un număr întreg pozitiv'),
  
  body('category_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('ID-ul categoriei trebuie să fie un număr întreg pozitiv'),
  
  body('brand_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('ID-ul brand-ului trebuie să fie un număr întreg pozitiv'),
  
  body('supplier_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('ID-ul furnizorului trebuie să fie un număr întreg pozitiv'),
  
  body('unitate_masura')
    .optional({ checkFalsy: true })
    .isIn(['buc', 'kg', 'm', 'l', 'set', 'pereche'])
    .withMessage('Unitatea de măsură nu este validă'),
  
  body('status')
    .optional({ checkFalsy: true })
    .isIn(['activ', 'inactiv', 'stoc_redus', 'epuizat'])
    .withMessage('Statusul nu este valid')
];

// Routes
router.get('/', authenticateToken, ProductsController.getProducts);
router.get('/statistics', authenticateToken, ProductsController.getStatistics);
router.get('/related-data', authenticateToken, ProductsController.getRelatedData);
router.get('/:id', authenticateToken, ProductsController.getProduct);
router.post('/', authenticateToken, productValidation, ProductsController.createProduct);
router.put('/:id', authenticateToken, productValidation, ProductsController.updateProduct);
router.delete('/:id', authenticateToken, ProductsController.deleteProduct);
router.post('/bulk-status', authenticateToken, ProductsController.bulkUpdateStatus);

module.exports = router;