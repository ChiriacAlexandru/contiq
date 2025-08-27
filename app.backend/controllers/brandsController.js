const Brand = require('../models/Brand');
const { validationResult } = require('express-validator');

class BrandsController {
  // Get all brands
  static async getBrands(req, res) {
    try {
      const brands = await Brand.getAll();
      
      res.json({
        success: true,
        data: brands
      });
    } catch (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea brand-urilor'
      });
    }
  }

  // Get single brand by ID
  static async getBrand(req, res) {
    try {
      const brandId = req.params.id;
      const brand = await Brand.getById(brandId);

      if (!brand) {
        return res.status(404).json({
          success: false,
          error: 'Brand-ul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        data: brand
      });
    } catch (error) {
      console.error('Error fetching brand:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea brand-ului'
      });
    }
  }

  // Create new brand
  static async createBrand(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      // Check if brand code already exists
      const existingBrand = await Brand.getByCod(req.body.cod);
      if (existingBrand) {
        return res.status(400).json({
          success: false,
          error: 'Un brand cu acest cod există deja'
        });
      }

      const brand = await Brand.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Brand-ul a fost creat cu succes',
        data: brand
      });
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la crearea brand-ului'
      });
    }
  }

  // Update brand
  static async updateBrand(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      const brandId = req.params.id;

      // Check if brand exists
      const existingBrand = await Brand.getById(brandId);
      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          error: 'Brand-ul nu a fost găsit'
        });
      }

      // Check if new code conflicts with existing brands (excluding current one)
      if (req.body.cod && req.body.cod !== existingBrand.cod) {
        const brandWithSameCod = await Brand.getByCod(req.body.cod);
        if (brandWithSameCod) {
          return res.status(400).json({
            success: false,
            error: 'Un brand cu acest cod există deja'
          });
        }
      }

      const updatedBrand = await Brand.update(brandId, req.body);

      res.json({
        success: true,
        message: 'Brand-ul a fost actualizat cu succes',
        data: updatedBrand
      });
    } catch (error) {
      console.error('Error updating brand:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea brand-ului'
      });
    }
  }

  // Delete brand
  static async deleteBrand(req, res) {
    try {
      const brandId = req.params.id;

      // Check if brand exists
      const existingBrand = await Brand.getById(brandId);
      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          error: 'Brand-ul nu a fost găsit'
        });
      }

      await Brand.delete(brandId);

      res.json({
        success: true,
        message: 'Brand-ul a fost șters cu succes'
      });
    } catch (error) {
      console.error('Error deleting brand:', error);
      
      // Check if it's a constraint error
      if (error.message.includes('produse asociate')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Eroare la ștergerea brand-ului'
      });
    }
  }

  // Get active brands (for dropdown)
  static async getActiveBrands(req, res) {
    try {
      const activeBrands = await Brand.getActive();
      
      res.json({
        success: true,
        data: activeBrands
      });
    } catch (error) {
      console.error('Error fetching active brands:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea brand-urilor active'
      });
    }
  }
}

module.exports = BrandsController;