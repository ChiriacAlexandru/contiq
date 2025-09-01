const Document = require('../models/Document');
const { validationResult } = require('express-validator');

class DocumentsController {
  // Get all documents with filtering and pagination
  static async getDocuments(req, res) {
    try {
      const filters = {
        search: req.query.search || '',
        tip_document: req.query.tip_document || '',
        status_document: req.query.status_document || '',
        status_plata: req.query.status_plata || '',
        client_id: req.query.client_id || '',
        data_de: req.query.data_de || '',
        data_pana: req.query.data_pana || '',
        sortBy: req.query.sortBy || 'created_at',
        sortOrder: req.query.sortOrder || 'desc',
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const result = await Document.getAll(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea documentelor'
      });
    }
  }

  // Get single document by ID
  static async getDocument(req, res) {
    try {
      const documentId = req.params.id;
      const document = await Document.getById(documentId);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Documentul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea documentului'
      });
    }
  }

  // Create new document
  static async createDocument(req, res) {
    try {
      console.log('Document create request body:', JSON.stringify(req.body, null, 2));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Document create validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      // Validate document type
      const validDocumentTypes = ['factura', 'factura_storno', 'proforma', 'aviz'];
      if (!validDocumentTypes.includes(req.body.tip_document)) {
        return res.status(400).json({
          success: false,
          error: 'Tip document invalid'
        });
      }

      // Get user ID from auth middleware
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Utilizator neautentificat'
        });
      }

      const document = await Document.create(req.body, userId);

      res.status(201).json({
        success: true,
        message: 'Documentul a fost creat cu succes',
        data: document
      });
    } catch (error) {
      console.error('Error creating document:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la crearea documentului'
      });
    }
  }

  // Update document
  static async updateDocument(req, res) {
    try {
      console.log('Document update request body:', JSON.stringify(req.body, null, 2));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Document update validation errors:', errors.array());
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array(),
          code: 'VALIDATION_ERROR'
        });
      }

      const documentId = req.params.id;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Utilizator neautentificat'
        });
      }

      const updatedDocument = await Document.update(documentId, req.body, userId);

      if (!updatedDocument) {
        return res.status(404).json({
          success: false,
          error: 'Documentul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        message: 'Documentul a fost actualizat cu succes',
        data: updatedDocument
      });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la actualizarea documentului'
      });
    }
  }

  // Delete document
  static async deleteDocument(req, res) {
    try {
      const documentId = req.params.id;

      const deletedDocument = await Document.delete(documentId);

      if (!deletedDocument) {
        return res.status(404).json({
          success: false,
          error: 'Documentul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        message: 'Documentul a fost șters cu succes'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la ștergerea documentului'
      });
    }
  }

  // Update document status
  static async updateDocumentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Utilizator neautentificat'
        });
      }

      const validStatuses = ['draft', 'emis', 'finalizat', 'anulat'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status document invalid'
        });
      }

      const document = await Document.updateDocumentStatus(id, status, userId);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Documentul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        message: 'Statusul documentului a fost actualizat',
        data: document
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la actualizarea statusului'
      });
    }
  }

  // Update payment status
  static async updatePaymentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status_plata, suma_platita } = req.body;

      const validStatuses = ['neplatit', 'partial', 'platit', 'anulat'];
      if (!validStatuses.includes(status_plata)) {
        return res.status(400).json({
          success: false,
          error: 'Status plată invalid'
        });
      }

      const document = await Document.updatePaymentStatus(id, status_plata, suma_platita);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Documentul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        message: 'Statusul plății a fost actualizat',
        data: document
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la actualizarea statusului plății'
      });
    }
  }

  // Get next document number
  static async getNextDocumentNumber(req, res) {
    try {
      const { tip_document, serie_document } = req.query;

      if (!tip_document) {
        return res.status(400).json({
          success: false,
          error: 'Tipul documentului este obligatoriu'
        });
      }

      const numarDocument = await Document.getNextDocumentNumber(tip_document, serie_document || '');

      res.json({
        success: true,
        data: {
          numar_document: numarDocument
        }
      });
    } catch (error) {
      console.error('Error getting next document number:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la generarea numărului documentului'
      });
    }
  }

  // Get document statistics
  static async getStatistics(req, res) {
    try {
      const filters = {
        data_de: req.query.data_de || '',
        data_pana: req.query.data_pana || ''
      };

      const statistics = await Document.getStatistics(filters);
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Error fetching document statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea statisticilor'
      });
    }
  }

  // Get related data for dropdowns
  static async getRelatedData(req, res) {
    try {
      const relatedData = await Document.getRelatedData();
      
      res.json({
        success: true,
        data: relatedData
      });
    } catch (error) {
      console.error('Error fetching related data:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea datelor asociate'
      });
    }
  }

  // Bulk update document status
  static async bulkUpdateStatus(req, res) {
    try {
      const { documentIds, status } = req.body;

      if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Lista de ID-uri de documente este necesară'
        });
      }

      const validStatuses = ['draft', 'emis', 'finalizat', 'anulat'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status invalid'
        });
      }

      const updatedDocuments = await Document.bulkUpdateStatus(documentIds, status);

      res.json({
        success: true,
        message: `${updatedDocuments.length} documente au fost actualizate cu succes`,
        data: updatedDocuments
      });
    } catch (error) {
      console.error('Error bulk updating documents:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea documentelor'
      });
    }
  }

  // Duplicate document
  static async duplicateDocument(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Utilizator neautentificat'
        });
      }

      // Get original document
      const originalDocument = await Document.getById(id);
      if (!originalDocument) {
        return res.status(404).json({
          success: false,
          error: 'Documentul sursă nu a fost găsit'
        });
      }

      // Create duplicate data
      const duplicateData = {
        tip_document: originalDocument.tip_document,
        client_id: originalDocument.client_id,
        data_emitere: new Date(),
        observatii: originalDocument.observatii,
        conditii_plata: originalDocument.conditii_plata,
        modalitate_transport: originalDocument.modalitate_transport,
        moneda: originalDocument.moneda,
        modalitate_plata: originalDocument.modalitate_plata,
        status_document: 'draft',
        items: originalDocument.items?.map(item => ({
          product_id: item.product_id,
          product_nume: item.product_nume,
          product_cod: item.product_cod,
          product_descriere: item.product_descriere,
          product_unitate_masura: item.product_unitate_masura,
          cantitate: item.cantitate,
          pret_unitar: item.pret_unitar,
          discount_procent: item.discount_procent,
          cota_tva: item.cota_tva,
          observatii: item.observatii
        })) || []
      };

      const newDocument = await Document.create(duplicateData, userId);

      res.json({
        success: true,
        message: 'Documentul a fost duplicat cu succes',
        data: newDocument
      });
    } catch (error) {
      console.error('Error duplicating document:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la duplicarea documentului'
      });
    }
  }

  // Get documents by client
  static async getDocumentsByClient(req, res) {
    try {
      const { client_id } = req.params;
      const { tip_document = '', limit = 20 } = req.query;

      const filters = {
        client_id,
        tip_document,
        limit: parseInt(limit),
        offset: 0,
        sortBy: 'data_emitere',
        sortOrder: 'desc'
      };

      const result = await Document.getAll(filters);
      
      res.json({
        success: true,
        data: result.documents
      });
    } catch (error) {
      console.error('Error fetching documents by client:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea documentelor clientului'
      });
    }
  }
}

module.exports = DocumentsController;