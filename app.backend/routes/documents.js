const express = require('express');
const { body } = require('express-validator');
const DocumentsController = require('../controllers/documentsController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Validation rules for document creation/update
const documentValidation = [
  body('tip_document')
    .isIn(['factura', 'factura_storno', 'proforma', 'aviz'])
    .withMessage('Tipul documentului trebuie să fie unul dintre: factura, factura_storno, proforma, aviz'),
  
  body('client_id')
    .isInt({ min: 1 })
    .withMessage('ID-ul clientului este obligatoriu și trebuie să fie un număr valid'),
  
  body('data_emitere')
    .optional()
    .isISO8601()
    .withMessage('Data emiterii trebuie să fie în format valid (YYYY-MM-DD)'),
  
  body('data_scadenta')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Data scadenței trebuie să fie în format valid (YYYY-MM-DD)'),
  
  body('data_livrare')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Data livrării trebuie să fie în format valid (YYYY-MM-DD)'),
  
  body('moneda')
    .optional()
    .isIn(['RON', 'EUR', 'USD'])
    .withMessage('Moneda trebuie să fie RON, EUR sau USD'),
  
  body('modalitate_plata')
    .optional()
    .isIn(['transfer', 'numerar', 'card', 'cec', 'ramburs'])
    .withMessage('Modalitatea de plată nu este validă'),
  
  body('status_document')
    .optional()
    .isIn(['draft', 'emis', 'finalizat', 'anulat'])
    .withMessage('Statusul documentului nu este valid'),
  
  body('observatii')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 1000 })
    .withMessage('Observațiile nu pot depăși 1000 de caractere'),
  
  body('conditii_plata')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('Condițiile de plată nu pot depăși 500 de caractere'),
  
  // Items validation
  body('items')
    .optional()
    .isArray()
    .withMessage('Items trebuie să fie o listă'),
  
  body('items.*.cantitate')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('Cantitatea trebuie să fie un număr pozitiv'),
  
  body('items.*.pret_unitar')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Prețul unitar trebuie să fie un număr pozitiv sau zero'),
  
  body('items.*.discount_procent')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount-ul trebuie să fie între 0 și 100%'),
  
  body('items.*.cota_tva')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Cota TVA trebuie să fie între 0 și 100%'),
  
  body('items.*.product_nume')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Numele produsului este obligatoriu și nu poate depăși 255 caractere')
];

// Validation rules for status updates
const statusUpdateValidation = [
  body('status')
    .isIn(['draft', 'emis', 'finalizat', 'anulat'])
    .withMessage('Statusul documentului nu este valid')
];

const paymentStatusValidation = [
  body('status_plata')
    .isIn(['neplatit', 'partial', 'platit', 'anulat'])
    .withMessage('Statusul plății nu este valid'),
  
  body('suma_platita')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage('Suma plătită trebuie să fie un număr pozitiv')
];

const bulkStatusValidation = [
  body('documentIds')
    .isArray({ min: 1 })
    .withMessage('Lista de ID-uri este obligatorie și trebuie să conțină cel puțin un element'),
  
  body('documentIds.*')
    .isInt({ min: 1 })
    .withMessage('Toate ID-urile trebuie să fie numere întregi pozitive'),
  
  body('status')
    .isIn(['draft', 'emis', 'finalizat', 'anulat'])
    .withMessage('Statusul nu este valid')
];

// Routes
router.get('/', authenticateToken, DocumentsController.getDocuments);
router.get('/statistics', authenticateToken, DocumentsController.getStatistics);
router.get('/related-data', authenticateToken, DocumentsController.getRelatedData);
router.get('/next-number', authenticateToken, DocumentsController.getNextDocumentNumber);
router.get('/client/:client_id', authenticateToken, DocumentsController.getDocumentsByClient);
router.get('/:id', authenticateToken, DocumentsController.getDocument);

router.post('/', authenticateToken, documentValidation, DocumentsController.createDocument);
router.post('/bulk-status', authenticateToken, bulkStatusValidation, DocumentsController.bulkUpdateStatus);
router.post('/:id/duplicate', authenticateToken, DocumentsController.duplicateDocument);

router.put('/:id', authenticateToken, documentValidation, DocumentsController.updateDocument);
router.put('/:id/status', authenticateToken, statusUpdateValidation, DocumentsController.updateDocumentStatus);
router.put('/:id/payment-status', authenticateToken, paymentStatusValidation, DocumentsController.updatePaymentStatus);

router.delete('/:id', authenticateToken, DocumentsController.deleteDocument);

module.exports = router;