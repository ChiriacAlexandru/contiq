const { sql } = require('../config/database');

class Product {
  static get TABLE() {
    return 'products';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      NUME: 'nume',
      COD: 'cod',
      DESCRIERE: 'descriere',
      CATEGORY_ID: 'category_id',
      BRAND_ID: 'brand_id',
      SUPPLIER_ID: 'supplier_id',
      LOCATION_ID: 'location_id',
      PRET_VANZARE: 'pret_vanzare',
      PRET_ACHIZITIE: 'pret_achizitie',
      STOC_ACTUAL: 'stoc_actual',
      STOC_MINIM: 'stoc_minim',
      UNITATE_MASURA: 'unitate_masura',
      GARANTIE_LUNI: 'garantie_luni',
      GREUTATE: 'greutate',
      DIMENSIUNI_LUNGIME: 'dimensiuni_lungime',
      DIMENSIUNI_LATIME: 'dimensiuni_latime',
      DIMENSIUNI_INALTIME: 'dimensiuni_inaltime',
      COD_BARE: 'cod_bare',
      IMAGINE_PRINCIPALA: 'imagine_principala',
      CONDITII_PASTRARE: 'conditii_pastrare',
      INSTRUCTIUNI_FOLOSIRE: 'instructiuni_folosire',
      STATUS: 'status',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }

  static async getAll(filters = {}) {
    const {
      search = '',
      category = '',
      brand = '',
      status = '',
      minPrice = null,
      maxPrice = null,
      minStock = null,
      maxStock = null,
      location = '',
      sortBy = 'nume',
      sortOrder = 'asc',
      limit = 50,
      offset = 0
    } = filters;

    // Build WHERE conditions
    const conditions = [];
    const params = {};

    if (search) {
      conditions.push(`(p.nume ILIKE '%${search}%' OR p.cod ILIKE '%${search}%' OR b.nume ILIKE '%${search}%')`);
    }
    if (category) {
      conditions.push(`p.category_id = ${category}`);
    }
    if (brand) {
      conditions.push(`p.brand_id = ${brand}`);
    }
    if (status) {
      conditions.push(`p.status = '${status}'`);
    }
    if (minPrice !== null && minPrice !== '') {
      conditions.push(`p.pret_vanzare >= ${minPrice}`);
    }
    if (maxPrice !== null && maxPrice !== '') {
      conditions.push(`p.pret_vanzare <= ${maxPrice}`);
    }
    if (minStock !== null && minStock !== '') {
      conditions.push(`p.stoc_actual >= ${minStock}`);
    }
    if (maxStock !== null && maxStock !== '') {
      conditions.push(`p.stoc_actual <= ${maxStock}`);
    }
    if (location) {
      conditions.push(`p.location_id = ${location}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}`;

    const queryStr = `
      SELECT 
        p.*,
        c.nume as categorie,
        b.nume as brand,
        s.nume as supplier,
        CASE 
          WHEN p.stoc_actual = 0 THEN 'epuizat'
          WHEN p.stoc_actual <= p.stoc_minim THEN 'stoc_redus'
          WHEN p.status IS NULL OR p.status = '' THEN 'activ'
          ELSE p.status
        END as status_calculat
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ${whereClause}
      ${orderClause}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const products = await sql.unsafe(queryStr);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ${whereClause}
    `;
    
    const [{ total }] = await sql.unsafe(countQuery);

    return {
      products,
      total: parseInt(total),
      limit,
      offset
    };
  }

  static async getById(id) {
    const [product] = await sql`
      SELECT 
        p.*,
        c.nume as categorie,
        b.nume as brand,
        s.nume as supplier,
        CASE 
          WHEN p.stoc_actual = 0 THEN 'epuizat'
          WHEN p.stoc_actual <= p.stoc_minim THEN 'stoc_redus'
          WHEN p.status IS NULL OR p.status = '' THEN 'activ'
          ELSE p.status
        END as status_calculat
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = ${id}
    `;
    return product;
  }

  static async create(data) {
    const [product] = await sql`
      INSERT INTO products (
        nume, cod, descriere, category_id, brand_id, supplier_id, location_id,
        pret_vanzare, pret_achizitie, stoc_actual, stoc_minim, unitate_masura,
        garantie_luni, greutate, dimensiuni_lungime, dimensiuni_latime, dimensiuni_inaltime,
        cod_bare, imagine_principala, conditii_pastrare, instructiuni_folosire, status
      )
      VALUES (
        ${data.nume}, 
        ${data.cod}, 
        ${data.descriere || null}, 
        ${data.category_id || null}, 
        ${data.brand_id || null},
        ${data.supplier_id || null},
        ${data.location_id || null},
        ${data.pret_vanzare ? parseFloat(data.pret_vanzare) : null},
        ${data.pret_achizitie ? parseFloat(data.pret_achizitie) : null},
        ${data.stoc_actual ? parseInt(data.stoc_actual) : 0},
        ${data.stoc_minim ? parseInt(data.stoc_minim) : 0},
        ${data.unitate_masura || 'buc'},
        ${data.garantie_luni ? parseInt(data.garantie_luni) : null},
        ${data.greutate ? parseFloat(data.greutate) : null},
        ${data.dimensiuni_lungime ? parseFloat(data.dimensiuni_lungime) : null},
        ${data.dimensiuni_latime ? parseFloat(data.dimensiuni_latime) : null},
        ${data.dimensiuni_inaltime ? parseFloat(data.dimensiuni_inaltime) : null},
        ${data.cod_bare || null},
        ${data.imagine_principala || null},
        ${data.conditii_pastrare || null},
        ${data.instructiuni_folosire || null},
        ${data.status || 'activ'}
      )
      RETURNING *
    `;
    return product;
  }

  static async update(id, data) {
    // Get current product to preserve status if not provided
    const currentProduct = await this.getById(id);
    if (!currentProduct) {
      throw new Error('Product not found');
    }

    // Parse and validate numeric values - ensure integers, default to 0
    const stoc_actual = data.stoc_actual !== undefined ? parseInt(data.stoc_actual) || 0 : currentProduct.stoc_actual || 0;
    const stoc_minim = data.stoc_minim !== undefined ? parseInt(data.stoc_minim) || 0 : currentProduct.stoc_minim || 0;
    
    // Determine status - let the database trigger handle automatic status updates
    // Only set status if explicitly provided, otherwise preserve current status
    const status = data.status || currentProduct.status || 'activ';

    const [product] = await sql`
      UPDATE products 
      SET 
        nume = ${data.nume},
        cod = ${data.cod},
        descriere = ${data.descriere || null},
        category_id = ${data.category_id || null},
        brand_id = ${data.brand_id || null},
        supplier_id = ${data.supplier_id || null},
        location_id = ${data.location_id || null},
        pret_vanzare = ${data.pret_vanzare ? parseFloat(data.pret_vanzare) : null},
        pret_achizitie = ${data.pret_achizitie ? parseFloat(data.pret_achizitie) : null},
        stoc_actual = ${stoc_actual},
        stoc_minim = ${stoc_minim},
        unitate_masura = ${data.unitate_masura || 'buc'},
        garantie_luni = ${data.garantie_luni ? parseInt(data.garantie_luni) : null},
        greutate = ${data.greutate ? parseFloat(data.greutate) : null},
        dimensiuni_lungime = ${data.dimensiuni_lungime ? parseFloat(data.dimensiuni_lungime) : null},
        dimensiuni_latime = ${data.dimensiuni_latime ? parseFloat(data.dimensiuni_latime) : null},
        dimensiuni_inaltime = ${data.dimensiuni_inaltime ? parseFloat(data.dimensiuni_inaltime) : null},
        cod_bare = ${data.cod_bare || null},
        imagine_principala = ${data.imagine_principala || null},
        conditii_pastrare = ${data.conditii_pastrare || null},
        instructiuni_folosire = ${data.instructiuni_folosire || null},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return product;
  }

  static async delete(id) {
    const [deletedProduct] = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING *
    `;
    return deletedProduct;
  }

  static async getByCod(cod) {
    const [product] = await sql`
      SELECT * FROM products WHERE cod = ${cod}
    `;
    return product;
  }

  static async getStatistics() {
    const [stats] = await sql`
      SELECT 
        COUNT(*) as totalProducts,
        SUM(pret_vanzare * stoc_actual) as totalValue,
        COUNT(CASE WHEN stoc_actual <= stoc_minim AND stoc_actual > 0 THEN 1 END) as lowStockCount,
        COUNT(CASE WHEN stoc_actual = 0 THEN 1 END) as outOfStockCount,
        COUNT(DISTINCT category_id) as categoriesCount,
        COUNT(DISTINCT brand_id) as brandsCount,
        COUNT(DISTINCT supplier_id) as suppliersCount
      FROM products
    `;
    return stats;
  }

  static async getRelatedData() {
    const [categories, brands, suppliers] = await Promise.all([
      sql`SELECT id, nume FROM categories WHERE activ = true ORDER BY nume ASC`,
      sql`SELECT id, nume FROM brands WHERE activ = true ORDER BY nume ASC`,
      sql`SELECT id, nume FROM suppliers WHERE activ = true ORDER BY nume ASC`
    ]);

    return {
      categories,
      brands,
      suppliers,
      locations: [] // For future implementation
    };
  }

  static async bulkUpdateStatus(productIds, status) {
    const products = await sql`
      UPDATE products 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ANY(${productIds})
      RETURNING *
    `;
    return products;
  }
}

module.exports = Product;