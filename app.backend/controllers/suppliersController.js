const Supplier = require('../models/Supplier');
const { validationResult } = require('express-validator');

class SuppliersController {
  // Get all suppliers
  static async getSuppliers(req, res) {
    try {
      const suppliers = await Supplier.getAll();
      
      res.json({
        success: true,
        data: {
          suppliers: suppliers
        }
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea furnizorilor'
      });
    }
  }

  // Get single supplier by ID
  static async getSupplier(req, res) {
    try {
      const supplierId = req.params.id;
      const supplier = await Supplier.getById(supplierId);

      if (!supplier) {
        return res.status(404).json({
          success: false,
          error: 'Furnizorul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        data: supplier
      });
    } catch (error) {
      console.error('Error fetching supplier:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea furnizorului'
      });
    }
  }

  // Create new supplier
  static async createSupplier(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      // Check if supplier code already exists
      const existingSupplier = await Supplier.getByCod(req.body.cod);
      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          error: 'Un furnizor cu acest cod există deja'
        });
      }

      const supplier = await Supplier.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Furnizorul a fost creat cu succes',
        data: supplier
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la crearea furnizorului'
      });
    }
  }

  // Update supplier
  static async updateSupplier(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      const supplierId = req.params.id;

      // Check if supplier exists
      const existingSupplier = await Supplier.getById(supplierId);
      if (!existingSupplier) {
        return res.status(404).json({
          success: false,
          error: 'Furnizorul nu a fost găsit'
        });
      }

      // Check if new code conflicts with existing suppliers (excluding current one)
      if (req.body.cod && req.body.cod !== existingSupplier.cod) {
        const supplierWithSameCod = await Supplier.getByCod(req.body.cod);
        if (supplierWithSameCod) {
          return res.status(400).json({
            success: false,
            error: 'Un furnizor cu acest cod există deja'
          });
        }
      }

      const updatedSupplier = await Supplier.update(supplierId, req.body);

      res.json({
        success: true,
        message: 'Furnizorul a fost actualizat cu succes',
        data: updatedSupplier
      });
    } catch (error) {
      console.error('Error updating supplier:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea furnizorului'
      });
    }
  }

  // Delete supplier
  static async deleteSupplier(req, res) {
    try {
      const supplierId = req.params.id;

      // Check if supplier exists
      const existingSupplier = await Supplier.getById(supplierId);
      if (!existingSupplier) {
        return res.status(404).json({
          success: false,
          error: 'Furnizorul nu a fost găsit'
        });
      }

      await Supplier.delete(supplierId);

      res.json({
        success: true,
        message: 'Furnizorul a fost șters cu succes'
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      
      // Check if it's a constraint error
      if (error.message.includes('produse asociate')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Eroare la ștergerea furnizorului'
      });
    }
  }

  // Get active suppliers (for dropdown)
  static async getActiveSuppliers(req, res) {
    try {
      const activeSuppliers = await Supplier.getActive();
      
      res.json({
        success: true,
        data: activeSuppliers
      });
    } catch (error) {
      console.error('Error fetching active suppliers:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea furnizorilor activi'
      });
    }
  }
}

module.exports = SuppliersController;