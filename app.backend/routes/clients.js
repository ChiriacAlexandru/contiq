const express = require('express');
const { body } = require('express-validator');
const ClientsController = require('../controllers/clientsController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Validation rules
const clientValidation = [
  body('nume')
    .trim()
    .notEmpty()
    .withMessage('Numele clientului este obligatoriu')
    .isLength({ min: 2, max: 255 })
    .withMessage('Numele clientului trebuie să aibă între 2 și 255 caractere'),
  
  body('tip_client')
    .optional()
    .isIn(['persoana_fizica', 'persoana_juridica'])
    .withMessage('Tipul clientului trebuie să fie "persoana_fizica" sau "persoana_juridica"'),
  
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Adresa de email nu este validă'),
  
  body('telefon')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 10, max: 50 })
    .withMessage('Numărul de telefon trebuie să aibă între 10 și 50 caractere'),
  
  body('cui')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // CUI validation only for juridical persons
      if (req.body.tip_client === 'persoana_juridica' && value) {
        // Basic CUI format validation (Romanian tax identification number)
        const cuiPattern = /^(RO)?[0-9]{2,10}$/;
        if (!cuiPattern.test(value)) {
          throw new Error('CUI-ul nu are un format valid');
        }
      }
      return true;
    }),
  
  body('cnp')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      // CNP validation only for physical persons
      if (req.body.tip_client === 'persoana_fizica' && value) {
        // Basic CNP format validation (Romanian personal identification number)
        const cnpPattern = /^[1-8][0-9]{12}$/;
        if (!cnpPattern.test(value)) {
          throw new Error('CNP-ul nu are un format valid');
        }
      }
      return true;
    }),
  
  body('limita_credit')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Limita de credit trebuie să fie un număr pozitiv'),
  
  body('discount_implicit')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount-ul implicit trebuie să fie între 0 și 100%'),
  
  body('status')
    .optional({ checkFalsy: true })
    .isIn(['activ', 'inactiv', 'suspendat'])
    .withMessage('Statusul trebuie să fie "activ", "inactiv" sau "suspendat"'),
  
  body('conditii_plata')
    .optional({ checkFalsy: true })
    .isIn(['15_zile', '30_zile', '45_zile', '60_zile', 'avans', 'ramburs'])
    .withMessage('Condițiile de plată nu sunt valide'),
  
  body('tara')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage('Țara trebuie să aibă între 2 și 100 caractere'),
  
  body('cod_postal')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 20 })
    .withMessage('Codul poștal nu poate depăși 20 caractere'),
  
  body('website')
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage('Website-ul nu are un format valid')
];

// Routes
router.get('/', authenticateToken, ClientsController.getClients);
router.get('/statistics', authenticateToken, ClientsController.getStatistics);
router.get('/related-data', authenticateToken, ClientsController.getRelatedData);
router.get('/:id', authenticateToken, ClientsController.getClient);
router.post('/', authenticateToken, clientValidation, ClientsController.createClient);
router.put('/:id', authenticateToken, clientValidation, ClientsController.updateClient);
router.delete('/:id', authenticateToken, ClientsController.deleteClient);
router.post('/bulk-status', authenticateToken, ClientsController.bulkUpdateStatus);

module.exports = router;