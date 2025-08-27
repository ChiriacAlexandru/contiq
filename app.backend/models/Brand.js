const { sql } = require('../config/database');

class Brand {
  static get TABLE() {
    return 'brands';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      NUME: 'nume',
      COD: 'cod',
      DESCRIERE: 'descriere',
      WEBSITE: 'website',
      CONTACT_EMAIL: 'contact_email',
      CONTACT_TELEFON: 'contact_telefon',
      LOGO_PATH: 'logo_path',
      ACTIV: 'activ',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }

  static async getAll() {
    const brands = await sql`
      SELECT 
        b.*,
        COUNT(p.id) as numar_produse
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      GROUP BY b.id
      ORDER BY b.nume ASC
    `;
    return brands;
  }

  static async getById(id) {
    const [brand] = await sql`
      SELECT 
        b.*,
        COUNT(p.id) as numar_produse
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      WHERE b.id = ${id}
      GROUP BY b.id
    `;
    return brand;
  }

  static async create(data) {
    const [brand] = await sql`
      INSERT INTO brands (
        nume, cod, descriere, website, contact_email, 
        contact_telefon, logo_path, activ
      )
      VALUES (
        ${data.nume}, 
        ${data.cod}, 
        ${data.descriere || null}, 
        ${data.website || null}, 
        ${data.contact_email || null},
        ${data.contact_telefon || null},
        ${data.logo_path || null},
        ${data.activ !== undefined ? data.activ : true}
      )
      RETURNING *
    `;
    return brand;
  }

  static async update(id, data) {
    const [brand] = await sql`
      UPDATE brands 
      SET 
        nume = ${data.nume},
        cod = ${data.cod},
        descriere = ${data.descriere || null},
        website = ${data.website || null},
        contact_email = ${data.contact_email || null},
        contact_telefon = ${data.contact_telefon || null},
        logo_path = ${data.logo_path || null},
        activ = ${data.activ !== undefined ? data.activ : true},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return brand;
  }

  static async delete(id) {
    // Check if brand has products
    const [productCount] = await sql`
      SELECT COUNT(*) as count FROM products WHERE brand_id = ${id}
    `;
    
    if (productCount.count > 0) {
      throw new Error('Nu se poate șterge brandul. Există produse asociate.');
    }

    const [deletedBrand] = await sql`
      DELETE FROM brands WHERE id = ${id} RETURNING *
    `;
    return deletedBrand;
  }

  static async getByCod(cod) {
    const [brand] = await sql`
      SELECT * FROM brands WHERE cod = ${cod}
    `;
    return brand;
  }

  static async getActive() {
    const brands = await sql`
      SELECT * FROM brands 
      WHERE activ = true
      ORDER BY nume ASC
    `;
    return brands;
  }
}

module.exports = Brand;