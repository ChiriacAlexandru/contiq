const { sql } = require('../config/database');

class Document {
  static get TABLE() {
    return 'documents';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      TIP_DOCUMENT: 'tip_document',
      NUMAR_DOCUMENT: 'numar_document',
      SERIE_DOCUMENT: 'serie_document',
      CLIENT_ID: 'client_id',
      DATA_EMITERE: 'data_emitere',
      DATA_SCADENTA: 'data_scadenta',
      DATA_LIVRARE: 'data_livrare',
      SUBTOTAL: 'subtotal',
      TOTAL_DISCOUNT: 'total_discount',
      TOTAL_TVA: 'total_tva',
      TOTAL: 'total',
      MONEDA: 'moneda',
      STATUS_DOCUMENT: 'status_document',
      STATUS_PLATA: 'status_plata',
      OBSERVATII: 'observatii',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }

  static get DOCUMENT_TYPES() {
    return {
      FACTURA: 'factura',
      FACTURA_STORNO: 'factura_storno',
      PROFORMA: 'proforma',
      AVIZ: 'aviz'
    };
  }

  static get DOCUMENT_STATUS() {
    return {
      DRAFT: 'draft',
      EMIS: 'emis',
      ANULAT: 'anulat',
      FINALIZAT: 'finalizat'
    };
  }

  static get PAYMENT_STATUS() {
    return {
      NEPLATIT: 'neplatit',
      PARTIAL: 'partial',
      PLATIT: 'platit',
      ANULAT: 'anulat'
    };
  }

  static async getAll(filters = {}) {
    const {
      search = '',
      tip_document = '',
      status_document = '',
      status_plata = '',
      client_id = '',
      data_de = '',
      data_pana = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      limit = 50,
      offset = 0
    } = filters;

    // Build WHERE conditions
    const conditions = [];
    const params = [];
    let paramCounter = 1;

    if (search) {
      conditions.push(`(d.numar_document ILIKE $${paramCounter} OR d.client_nume ILIKE $${paramCounter} OR d.observatii ILIKE $${paramCounter})`);
      params.push(`%${search}%`);
      paramCounter++;
    }
    
    if (tip_document) {
      conditions.push(`d.tip_document = $${paramCounter}`);
      params.push(tip_document);
      paramCounter++;
    }
    
    if (status_document) {
      conditions.push(`d.status_document = $${paramCounter}`);
      params.push(status_document);
      paramCounter++;
    }
    
    if (status_plata) {
      conditions.push(`d.status_plata = $${paramCounter}`);
      params.push(status_plata);
      paramCounter++;
    }
    
    if (client_id) {
      conditions.push(`d.client_id = $${paramCounter}`);
      params.push(client_id);
      paramCounter++;
    }
    
    if (data_de) {
      conditions.push(`d.data_emitere >= $${paramCounter}`);
      params.push(data_de);
      paramCounter++;
    }
    
    if (data_pana) {
      conditions.push(`d.data_emitere <= $${paramCounter}`);
      params.push(data_pana);
      paramCounter++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY d.${sortBy} ${sortOrder.toUpperCase()}`;

    const queryStr = `
      SELECT 
        d.*,
        c.nume as client_nume_actual,
        c.cui as client_cui_actual,
        c.email as client_email_actual,
        c.telefon as client_telefon_actual,
        u.email as created_by_name,
        (
          SELECT COUNT(*) 
          FROM document_items di 
          WHERE di.document_id = d.id
        ) as total_items
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN users u ON d.created_by = u.id
      ${whereClause}
      ${orderClause}
      LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
    `;

    params.push(limit, offset);
    const documents = await sql.unsafe(queryStr, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      ${whereClause}
    `;
    
    const [{ total }] = await sql.unsafe(countQuery, params.slice(0, -2));

    return {
      documents,
      total: parseInt(total),
      limit,
      offset
    };
  }

  static async getById(id) {
    const [document] = await sql`
      SELECT 
        d.*,
        c.nume as client_nume_actual,
        c.cui as client_cui_actual,
        c.cnp as client_cnp_actual,
        c.email as client_email_actual,
        c.telefon as client_telefon_actual,
        c.adresa as client_adresa_actual,
        u.email as created_by_name
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.id = ${id}
    `;
    
    if (document) {
      // Get document items
      document.items = await sql`
        SELECT 
          di.*,
          p.nume as product_nume_actual,
          p.cod as product_cod_actual,
          p.stoc_actual
        FROM document_items di
        LEFT JOIN products p ON di.product_id = p.id
        WHERE di.document_id = ${id}
        ORDER BY di.pozitie ASC
      `;
    }
    
    return document;
  }

  static async create(data, userId) {
    // Start transaction
    return await sql.begin(async sql => {
      // Get next document number
      const numarDocument = await this.getNextDocumentNumber(data.tip_document, data.serie_document || '');
      
      // Get client information for snapshot
      const client = await sql`
        SELECT * FROM clients WHERE id = ${data.client_id}
      `.then(rows => rows[0]);
      
      if (!client) {
        throw new Error('Clientul specificat nu există');
      }
      
      // Get company information (assuming from user profile or settings)
      const companyInfo = await sql`
        SELECT 
          cd.nume_firma as nume,
          cd.cui,
          cd.nr_reg_comert as nr_reg_com,
          cd.adresa_sediu as adresa,
          cd.telefon,
          cd.email,
          cd.cont_bancar,
          cd.banca
        FROM users u
        LEFT JOIN company_data cd ON u.id = cd.user_id
        WHERE u.id = ${userId}
      `.then(rows => rows[0] || {});

      // Create document
      const [document] = await sql`
        INSERT INTO documents (
          tip_document, numar_document, serie_document, client_id,
          data_emitere, data_scadenta, data_livrare,
          moneda, modalitate_plata, observatii, conditii_plata,
          modalitate_transport, delegate_info,
          emitent_nume, emitent_cui, emitent_nr_reg_com, emitent_adresa,
          emitent_telefon, emitent_email, emitent_cont_bancar, emitent_banca,
          client_nume, client_cui, client_cnp, client_nr_reg_com,
          client_adresa, client_telefon, client_email,
          created_by, status_document
        )
        VALUES (
          ${data.tip_document}, ${numarDocument}, ${data.serie_document || ''},
          ${data.client_id}, ${data.data_emitere || new Date()},
          ${data.data_scadenta || null}, ${data.data_livrare || null},
          ${data.moneda || 'RON'}, ${data.modalitate_plata || 'transfer'},
          ${data.observatii || null}, ${data.conditii_plata || null},
          ${data.modalitate_transport || null}, ${data.delegate_info || null},
          ${companyInfo.nume || null}, ${companyInfo.cui || null},
          ${companyInfo.nr_reg_com || null}, ${companyInfo.adresa || null},
          ${companyInfo.telefon || null}, ${companyInfo.email || null},
          ${companyInfo.cont_bancar || null}, ${companyInfo.banca || null},
          ${client.nume}, ${client.cui || null}, ${client.cnp || null},
          ${client.nr_reg_com || null}, ${client.adresa || null},
          ${client.telefon || null}, ${client.email || null},
          ${userId}, ${data.status_document || 'draft'}
        )
        RETURNING *
      `;

      // Add document items if provided
      if (data.items && data.items.length > 0) {
        for (let i = 0; i < data.items.length; i++) {
          const item = data.items[i];
          await this.addDocumentItem(document.id, item, i + 1, sql);
        }
        
        // Recalculate totals
        await sql`SELECT calculate_document_totals(${document.id})`;
      }

      return document;
    });
  }

  static async update(id, data, userId) {
    return await sql.begin(async sql => {
      // Check if document exists and can be updated
      const existingDoc = await sql`
        SELECT * FROM documents WHERE id = ${id}
      `.then(rows => rows[0]);
      
      if (!existingDoc) {
        throw new Error('Documentul nu a fost găsit');
      }
      
      if (existingDoc.status_document === 'finalizat') {
        throw new Error('Documentul finalizat nu poate fi modificat');
      }

      // Update document
      const [document] = await sql`
        UPDATE documents 
        SET 
          data_emitere = ${data.data_emitere || existingDoc.data_emitere},
          data_scadenta = ${data.data_scadenta || existingDoc.data_scadenta},
          data_livrare = ${data.data_livrare || existingDoc.data_livrare},
          observatii = ${data.observatii !== undefined ? data.observatii : existingDoc.observatii},
          conditii_plata = ${data.conditii_plata !== undefined ? data.conditii_plata : existingDoc.conditii_plata},
          modalitate_transport = ${data.modalitate_transport !== undefined ? data.modalitate_transport : existingDoc.modalitate_transport},
          delegate_info = ${data.delegate_info !== undefined ? data.delegate_info : existingDoc.delegate_info},
          status_document = ${data.status_document || existingDoc.status_document},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      // Update items if provided
      if (data.items !== undefined) {
        // Delete existing items
        await sql`DELETE FROM document_items WHERE document_id = ${id}`;
        
        // Add new items
        for (let i = 0; i < data.items.length; i++) {
          const item = data.items[i];
          await this.addDocumentItem(id, item, i + 1, sql);
        }
        
        // Recalculate totals
        await sql`SELECT calculate_document_totals(${id})`;
      }

      return document;
    });
  }

  static async delete(id) {
    return await sql.begin(async sql => {
      // Check if document can be deleted
      const existingDoc = await sql`
        SELECT * FROM documents WHERE id = ${id}
      `.then(rows => rows[0]);
      
      if (!existingDoc) {
        throw new Error('Documentul nu a fost găsit');
      }
      
      if (existingDoc.status_document === 'finalizat') {
        throw new Error('Documentul finalizat nu poate fi șters');
      }

      // Delete document items first (CASCADE will handle this, but explicit is better)
      await sql`DELETE FROM document_items WHERE document_id = ${id}`;
      
      // Delete document
      const [deletedDocument] = await sql`
        DELETE FROM documents WHERE id = ${id} RETURNING *
      `;
      
      return deletedDocument;
    });
  }

  static async addDocumentItem(documentId, itemData, pozitie = 1, sqlTransaction = null) {
    const sqlConn = sqlTransaction || sql;
    
    // Get product information for snapshot
    let product = null;
    if (itemData.product_id) {
      product = await sqlConn`
        SELECT * FROM products WHERE id = ${itemData.product_id}
      `.then(rows => rows[0]);
    }
    
    // Calculate values
    const cantitate = parseFloat(itemData.cantitate) || 1;
    const pretUnitar = parseFloat(itemData.pret_unitar) || 0;
    const discountProcent = parseFloat(itemData.discount_procent) || 0;
    const cotaTva = parseFloat(itemData.cota_tva) || 19;
    
    const valoareBruta = cantitate * pretUnitar;
    const discountSuma = (valoareBruta * discountProcent) / 100;
    const valoareFaraTva = valoareBruta - discountSuma;
    const valoareTva = (valoareFaraTva * cotaTva) / 100;
    const valoareCuTva = valoareFaraTva + valoareTva;
    
    const [item] = await sqlConn`
      INSERT INTO document_items (
        document_id, product_id, product_nume, product_cod, product_descriere,
        product_unitate_masura, cantitate, pret_unitar, discount_procent,
        discount_suma, cota_tva, valoare_fara_tva, valoare_tva, valoare_cu_tva,
        pozitie, observatii
      )
      VALUES (
        ${documentId}, ${itemData.product_id || null},
        ${product?.nume || itemData.product_nume || 'Produs temporar'},
        ${product?.cod || itemData.product_cod || ''},
        ${product?.descriere || itemData.product_descriere || ''},
        ${product?.unitate_masura || itemData.product_unitate_masura || 'buc'},
        ${cantitate}, ${pretUnitar}, ${discountProcent}, ${discountSuma},
        ${cotaTva}, ${valoareFaraTva}, ${valoareTva}, ${valoareCuTva},
        ${pozitie}, ${itemData.observatii || null}
      )
      RETURNING *
    `;
    
    return item;
  }

  static async updateDocumentStatus(id, status, userId) {
    const [document] = await sql`
      UPDATE documents 
      SET 
        status_document = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return document;
  }

  static async updatePaymentStatus(id, statusPlata, sumaPlata = null) {
    const updateData = {
      status_plata: statusPlata,
      updated_at: new Date()
    };
    
    if (sumaPlata !== null) {
      updateData.suma_platita = parseFloat(sumaPlata);
    }
    
    const [document] = await sql`
      UPDATE documents 
      SET 
        status_plata = ${statusPlata},
        suma_platita = ${sumaPlata || 0},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return document;
  }

  static async getNextDocumentNumber(tipDocument, serieDocument = '') {
    const [result] = await sql`
      SELECT get_next_document_number(${tipDocument}, ${serieDocument}) as numar_document
    `;
    return result.numar_document;
  }

  static async getStatistics(filters = {}) {
    const { data_de = '', data_pana = '' } = filters;
    
    let dateFilter = '';
    const params = [];
    let paramCounter = 1;
    
    if (data_de) {
      dateFilter += ` AND data_emitere >= $${paramCounter}`;
      params.push(data_de);
      paramCounter++;
    }
    
    if (data_pana) {
      dateFilter += ` AND data_emitere <= $${paramCounter}`;
      params.push(data_pana);
      paramCounter++;
    }
    
    const queryStr = `
      SELECT 
        COUNT(*) as total_documents,
        COUNT(CASE WHEN tip_document = 'factura' THEN 1 END) as facturi_count,
        COUNT(CASE WHEN tip_document = 'proforma' THEN 1 END) as proforme_count,
        COUNT(CASE WHEN tip_document = 'aviz' THEN 1 END) as avize_count,
        COUNT(CASE WHEN status_document = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status_document = 'emis' THEN 1 END) as emise_count,
        COUNT(CASE WHEN status_plata = 'neplatit' THEN 1 END) as neplatite_count,
        COUNT(CASE WHEN status_plata = 'platit' THEN 1 END) as platite_count,
        SUM(CASE WHEN tip_document = 'factura' AND status_document != 'anulat' THEN total ELSE 0 END) as valoare_facturi,
        SUM(CASE WHEN status_plata = 'neplatit' AND tip_document = 'factura' THEN total ELSE 0 END) as valoare_neplatita,
        AVG(CASE WHEN tip_document = 'factura' AND status_document != 'anulat' THEN total END) as valoare_medie_factura
      FROM documents
      WHERE 1=1 ${dateFilter}
    `;
    
    const [stats] = await sql.unsafe(queryStr, params);
    
    return {
      ...stats,
      valoare_facturi: parseFloat(stats.valoare_facturi) || 0,
      valoare_neplatita: parseFloat(stats.valoare_neplatita) || 0,
      valoare_medie_factura: parseFloat(stats.valoare_medie_factura) || 0
    };
  }

  static async getRelatedData() {
    const [
      documentTypes,
      documentStatuses,
      paymentStatuses,
      currencies
    ] = await Promise.all([
      Promise.resolve([
        { value: 'factura', label: 'Factură' },
        { value: 'factura_storno', label: 'Factură Storno' },
        { value: 'proforma', label: 'Proformă' },
        { value: 'aviz', label: 'Aviz' }
      ]),
      Promise.resolve([
        { value: 'draft', label: 'Draft' },
        { value: 'emis', label: 'Emis' },
        { value: 'finalizat', label: 'Finalizat' },
        { value: 'anulat', label: 'Anulat' }
      ]),
      Promise.resolve([
        { value: 'neplatit', label: 'Neplătit' },
        { value: 'partial', label: 'Plătit Parțial' },
        { value: 'platit', label: 'Plătit' },
        { value: 'anulat', label: 'Anulat' }
      ]),
      Promise.resolve([
        { value: 'RON', label: 'RON - Leu Românesc' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'USD', label: 'USD - Dolar American' }
      ])
    ]);

    return {
      documentTypes,
      documentStatuses,
      paymentStatuses,
      currencies,
      paymentMethods: [
        { value: 'transfer', label: 'Transfer Bancar' },
        { value: 'numerar', label: 'Numerar' },
        { value: 'card', label: 'Card' },
        { value: 'cec', label: 'Cec' },
        { value: 'ramburs', label: 'Ramburs' }
      ]
    };
  }

  static async bulkUpdateStatus(documentIds, status) {
    const documents = await sql`
      UPDATE documents 
      SET status_document = ${status}, updated_at = NOW()
      WHERE id = ANY(${documentIds})
        AND status_document != 'finalizat'
      RETURNING *
    `;
    return documents;
  }
}

module.exports = Document;