const Category = require('../models/Category');
const { validationResult } = require('express-validator');

class CategoriesController {
  // Get all categories
  static async getCategories(req, res) {
    try {
      const categories = await Category.getAll();
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea categoriilor'
      });
    }
  }

  // Get single category by ID
  static async getCategory(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await Category.getById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Categoria nu a fost găsită'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea categoriei'
      });
    }
  }

  // Create new category
  static async createCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      // Check if category code already exists
      const existingCategory = await Category.getByCod(req.body.cod);
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'O categorie cu acest cod există deja'
        });
      }

      const category = await Category.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Categoria a fost creată cu succes',
        data: category
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la crearea categoriei'
      });
    }
  }

  // Update category
  static async updateCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Date invalide',
          details: errors.array()
        });
      }

      const categoryId = req.params.id;

      // Check if category exists
      const existingCategory = await Category.getById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          error: 'Categoria nu a fost găsită'
        });
      }

      // Check if new code conflicts with existing categories (excluding current one)
      if (req.body.cod && req.body.cod !== existingCategory.cod) {
        const categoryWithSameCod = await Category.getByCod(req.body.cod);
        if (categoryWithSameCod) {
          return res.status(400).json({
            success: false,
            error: 'O categorie cu acest cod există deja'
          });
        }
      }

      const updatedCategory = await Category.update(categoryId, req.body);

      res.json({
        success: true,
        message: 'Categoria a fost actualizată cu succes',
        data: updatedCategory
      });
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la actualizarea categoriei'
      });
    }
  }

  // Delete category
  static async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;

      // Check if category exists
      const existingCategory = await Category.getById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          error: 'Categoria nu a fost găsită'
        });
      }

      await Category.delete(categoryId);

      res.json({
        success: true,
        message: 'Categoria a fost ștearsă cu succes'
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // Check if it's a constraint error
      if (error.message.includes('produse asociate') || error.message.includes('subcategorii asociate')) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Eroare la ștergerea categoriei'
      });
    }
  }

  // Get parent categories (for dropdown)
  static async getParentCategories(req, res) {
    try {
      const parentCategories = await Category.getParentCategories();
      
      res.json({
        success: true,
        data: parentCategories
      });
    } catch (error) {
      console.error('Error fetching parent categories:', error);
      res.status(500).json({
        success: false,
        error: 'Eroare la încărcarea categoriilor principale'
      });
    }
  }
}

module.exports = CategoriesController;