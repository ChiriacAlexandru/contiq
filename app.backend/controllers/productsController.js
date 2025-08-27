const Product = require('../models/Product');
const { validationResult } = require('express-validator');

class ProductsController {
  // Get all products with filtering and pagination
  static async getProducts(req, res) {
    try {
      const filters = {
        search: req.query.search || '',
        category: req.query.category || '',
        brand: req.query.brand || '',
        status: req.query.status || '',
        minPrice: req.query.minPrice || null,
        maxPrice: req.query.maxPrice || null,
        minStock: req.query.minStock || null,
        maxStock: req.query.maxStock || null,
        location: req.query.location || '',
        sortBy: req.query.sortBy || 'nume',
        sortOrder: req.query.sortOrder || 'asc',
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const result = await Product.getAll(filters);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea produselor'
      });
    }
  }

  // Get single product by ID
  static async getProduct(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.getById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produsul nu a fost găsit'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea produsului'
      });
    }
  }

  // Create new product
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      // Check if product code already exists
      const existingProduct = await Product.getByCod(req.body.cod);
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          error: 'Un produs cu acest cod există deja'
        });
      }

      const product = await Product.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Produsul a fost creat cu succes',
        data: product
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la crearea produsului'
      });
    }
  }

  // Update product
  static async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      const productId = req.params.id;

      // Check if product exists
      const existingProduct = await Product.getById(productId);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: 'Produsul nu a fost găsit'
        });
      }

      // Check if new code conflicts with existing products (excluding current one)
      if (req.body.cod && req.body.cod !== existingProduct.cod) {
        const productWithSameCod = await Product.getByCod(req.body.cod);
        if (productWithSameCod) {
          return res.status(400).json({
            success: false,
            error: 'Un produs cu acest cod există deja'
          });
        }
      }

      const updatedProduct = await Product.update(productId, req.body);

      res.json({
        success: true,
        message: 'Produsul a fost actualizat cu succes',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea produsului'
      });
    }
  }

  // Delete product
  static async deleteProduct(req, res) {
    try {
      const productId = req.params.id;

      // Check if product exists
      const existingProduct = await Product.getById(productId);
      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: 'Produsul nu a fost găsit'
        });
      }

      await Product.delete(productId);

      res.json({
        success: true,
        message: 'Produsul a fost șters cu succes'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la ștergerea produsului'
      });
    }
  }

  // Get product statistics
  static async getStatistics(req, res) {
    try {
      const statistics = await Product.getStatistics();
      
      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea statisticilor'
      });
    }
  }

  // Get related data for dropdowns (categories, brands, suppliers, locations)
  static async getRelatedData(req, res) {
    try {
      const relatedData = await Product.getRelatedData();
      
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

  // Bulk update product status
  static async bulkUpdateStatus(req, res) {
    try {
      const { productIds, status } = req.body;

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Lista de ID-uri de produse este necesară'
        });
      }

      if (!status || !['activ', 'inactiv', 'stoc_redus', 'epuizat'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status invalid'
        });
      }

      const updatedProducts = await Product.bulkUpdateStatus(productIds, status);

      res.json({
        success: true,
        message: `${updatedProducts.length} produse au fost actualizate cu succes`,
        data: updatedProducts
      });
    } catch (error) {
      console.error('Error bulk updating products:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea produselor'
      });
    }
  }
}

module.exports = ProductsController;