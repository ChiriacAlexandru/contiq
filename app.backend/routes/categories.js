const express = require('express');
const { body } = require('express-validator');
const CategoriesController = require('../controllers/categoriesController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Validation rules
const categoryValidation = [
  body('nume')
    .trim()
    .notEmpty()
    .withMessage('Numele categoriei este obligatoriu')
    .isLength({ min: 2, max: 255 })
    .withMessage('Numele categoriei trebuie să aibă între 2 și 255 caractere'),
  
  body('cod')
    .trim()
    .notEmpty()
    .withMessage('Codul categoriei este obligatoriu')
    .isLength({ min: 2, max: 50 })
    .withMessage('Codul categoriei trebuie să aibă între 2 și 50 caractere'),
  
  body('descriere')
    .optional({ checkFalsy: true })
    .isLength({ max: 1000 })
    .withMessage('Descrierea nu poate avea mai mult de 1000 caractere'),
  
  body('parinte_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('ID-ul categoriei părinte trebuie să fie un număr întreg pozitiv'),
  
  body('ordinea')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Ordinea trebuie să fie un număr întreg pozitiv'),
  
  body('activ')
    .optional()
    .isBoolean()
    .withMessage('Statusul activ trebuie să fie true sau false')
];

// Routes
router.get('/', authenticateToken, CategoriesController.getCategories);
router.get('/parent', authenticateToken, CategoriesController.getParentCategories);
router.get('/:id', authenticateToken, CategoriesController.getCategory);
router.post('/', authenticateToken, categoryValidation, CategoriesController.createCategory);
router.put('/:id', authenticateToken, categoryValidation, CategoriesController.updateCategory);
router.delete('/:id', authenticateToken, CategoriesController.deleteCategory);

module.exports = router;