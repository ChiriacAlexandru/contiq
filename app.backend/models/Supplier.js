const { sql } = require('../config/database');

class Supplier {
  static get TABLE() {
    return 'suppliers';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      NUME: 'nume',
      COD: 'cod',
      CUI: 'cui',
      ADRESA: 'adresa',
      ORAS: 'oras',
      JUDET: 'judet',
      COD_POSTAL: 'cod_postal',
      TELEFON: 'telefon',
      EMAIL: 'email',
      WEBSITE: 'website',
      REPREZENTANT_NUME: 'reprezentant_nume',
      REPREZENTANT_TELEFON: 'reprezentant_telefon',
      REPREZENTANT_EMAIL: 'reprezentant_email',
      CONTURI_BANCARE: 'conturi_bancare',
      TERMENI_PLATA: 'termeni_plata',
      ZILE_PLATA: 'zile_plata',
      RATING: 'rating',
      OBSERVATII: 'observatii',
      ACTIV: 'activ',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }

  static async getAll() {
    const suppliers = await sql`
      SELECT 
        s.*,
        COUNT(p.id) as numar_produse
      FROM suppliers s
      LEFT JOIN products p ON s.id = p.supplier_id
      GROUP BY s.id
      ORDER BY s.nume ASC
    `;
    return suppliers;
  }

  static async getById(id) {
    const [supplier] = await sql`
      SELECT 
        s.*,
        COUNT(p.id) as numar_produse
      FROM suppliers s
      LEFT JOIN products p ON s.id = p.supplier_id
      WHERE s.id = ${id}
      GROUP BY s.id
    `;
    return supplier;
  }

  static async create(data) {
    const [supplier] = await sql`
      INSERT INTO suppliers (
        nume, cod, cui, adresa, oras, judet, cod_postal,
        telefon, email, website, reprezentant_nume,
        reprezentant_telefon, reprezentant_email,
        conturi_bancare, termeni_plata, zile_plata,
        rating, observatii, activ
      )
      VALUES (
        ${data.nume}, 
        ${data.cod}, 
        ${data.cui || null}, 
        ${data.adresa || null}, 
        ${data.oras || null},
        ${data.judet || null},
        ${data.cod_postal || null},
        ${data.telefon || null},
        ${data.email || null},
        ${data.website || null},
        ${data.reprezentant_nume || null},
        ${data.reprezentant_telefon || null},
        ${data.reprezentant_email || null},
        ${data.conturi_bancare || null},
        ${data.termeni_plata || null},
        ${data.zile_plata ? parseInt(data.zile_plata) : null},
        ${data.rating ? parseFloat(data.rating) : null},
        ${data.observatii || null},
        ${data.activ !== undefined ? data.activ : true}
      )
      RETURNING *
    `;
    return supplier;
  }

  static async update(id, data) {
    const [supplier] = await sql`
      UPDATE suppliers 
      SET 
        nume = ${data.nume},
        cod = ${data.cod},
        cui = ${data.cui || null},
        adresa = ${data.adresa || null},
        oras = ${data.oras || null},
        judet = ${data.judet || null},
        cod_postal = ${data.cod_postal || null},
        telefon = ${data.telefon || null},
        email = ${data.email || null},
        website = ${data.website || null},
        reprezentant_nume = ${data.reprezentant_nume || null},
        reprezentant_telefon = ${data.reprezentant_telefon || null},
        reprezentant_email = ${data.reprezentant_email || null},
        conturi_bancare = ${data.conturi_bancare || null},
        termeni_plata = ${data.termeni_plata || null},
        zile_plata = ${data.zile_plata ? parseInt(data.zile_plata) : null},
        rating = ${data.rating ? parseFloat(data.rating) : null},
        observatii = ${data.observatii || null},
        activ = ${data.activ !== undefined ? data.activ : true},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return supplier;
  }

  static async delete(id) {
    // Check if supplier has products
    const [productCount] = await sql`
      SELECT COUNT(*) as count FROM products WHERE supplier_id = ${id}
    `;
    
    if (productCount.count > 0) {
      throw new Error('Nu se poate șterge furnizorul. Există produse asociate.');
    }

    const [deletedSupplier] = await sql`
      DELETE FROM suppliers WHERE id = ${id} RETURNING *
    `;
    return deletedSupplier;
  }

  static async getByCod(cod) {
    const [supplier] = await sql`
      SELECT * FROM suppliers WHERE cod = ${cod}
    `;
    return supplier;
  }

  static async getActive() {
    const suppliers = await sql`
      SELECT * FROM suppliers 
      WHERE activ = true
      ORDER BY nume ASC
    `;
    return suppliers;
  }
}

module.exports = Supplier;