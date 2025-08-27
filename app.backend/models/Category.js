const { sql } = require('../config/database');

class Category {
  static get TABLE() {
    return 'categories';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      NUME: 'nume',
      COD: 'cod',
      DESCRIERE: 'descriere',
      PARINTE_ID: 'parinte_id',
      ORDINEA: 'ordinea',
      ACTIV: 'activ',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }

  static async getAll() {
    const categories = await sql`
      SELECT 
        c.*,
        p.nume as parinte_nume,
        COUNT(pr.id) as numar_produse
      FROM categories c
      LEFT JOIN categories p ON c.parinte_id = p.id
      LEFT JOIN products pr ON c.id = pr.category_id
      GROUP BY c.id, p.nume
      ORDER BY c.ordinea ASC, c.nume ASC
    `;
    return categories;
  }

  static async getById(id) {
    const [category] = await sql`
      SELECT 
        c.*,
        p.nume as parinte_nume,
        COUNT(pr.id) as numar_produse
      FROM categories c
      LEFT JOIN categories p ON c.parinte_id = p.id
      LEFT JOIN products pr ON c.id = pr.category_id
      WHERE c.id = ${id}
      GROUP BY c.id, p.nume
    `;
    return category;
  }

  static async create(data) {
    const [category] = await sql`
      INSERT INTO categories (nume, cod, descriere, parinte_id, ordinea, activ)
      VALUES (
        ${data.nume}, 
        ${data.cod}, 
        ${data.descriere || null}, 
        ${data.parinte_id || null}, 
        ${data.ordinea || null},
        ${data.activ !== undefined ? data.activ : true}
      )
      RETURNING *
    `;
    return category;
  }

  static async update(id, data) {
    const [category] = await sql`
      UPDATE categories 
      SET 
        nume = ${data.nume},
        cod = ${data.cod},
        descriere = ${data.descriere || null},
        parinte_id = ${data.parinte_id || null},
        ordinea = ${data.ordinea || null},
        activ = ${data.activ !== undefined ? data.activ : true},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return category;
  }

  static async delete(id) {
    // Check if category has products
    const [productCount] = await sql`
      SELECT COUNT(*) as count FROM products WHERE category_id = ${id}
    `;
    
    if (productCount.count > 0) {
      throw new Error('Nu se poate șterge categoria. Există produse asociate.');
    }

    // Check if category has subcategories
    const [subcategoriesCount] = await sql`
      SELECT COUNT(*) as count FROM categories WHERE parinte_id = ${id}
    `;
    
    if (subcategoriesCount.count > 0) {
      throw new Error('Nu se poate șterge categoria. Există subcategorii asociate.');
    }

    const [deletedCategory] = await sql`
      DELETE FROM categories WHERE id = ${id} RETURNING *
    `;
    return deletedCategory;
  }

  static async getParentCategories() {
    const categories = await sql`
      SELECT * FROM categories 
      WHERE parinte_id IS NULL AND activ = true
      ORDER BY ordinea ASC, nume ASC
    `;
    return categories;
  }

  static async getByCod(cod) {
    const [category] = await sql`
      SELECT * FROM categories WHERE cod = ${cod}
    `;
    return category;
  }
}

module.exports = Category;