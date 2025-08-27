const { sql } = require('../config/database');

class Client {
  static get TABLE() {
    return 'clients';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      NUME: 'nume',
      TIP_CLIENT: 'tip_client',
      EMAIL: 'email',
      TELEFON: 'telefon',
      FAX: 'fax',
      WEBSITE: 'website',
      ADRESA: 'adresa',
      ORAS: 'oras',
      JUDET: 'judet',
      COD_POSTAL: 'cod_postal',
      TARA: 'tara',
      CUI: 'cui',
      NR_REG_COM: 'nr_reg_com',
      CONT_BANCAR: 'cont_bancar',
      BANCA: 'banca',
      CNP: 'cnp',
      CI_SERIE: 'ci_serie',
      CI_NUMAR: 'ci_numar',
      AGENT_VANZARI: 'agent_vanzari',
      CONDITII_PLATA: 'conditii_plata',
      LIMITA_CREDIT: 'limita_credit',
      DISCOUNT_IMPLICIT: 'discount_implicit',
      STATUS: 'status',
      CATEGORIE: 'categorie',
      SURSA: 'sursa',
      OBSERVATII: 'observatii',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }

  static async getAll(filters = {}) {
    const {
      search = '',
      tip_client = '',
      status = '',
      oras = '',
      judet = '',
      categorie = '',
      agent_vanzari = '',
      sortBy = 'nume',
      sortOrder = 'asc',
      limit = 50,
      offset = 0
    } = filters;

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(`(c.nume ILIKE '%${search}%' OR c.email ILIKE '%${search}%' OR c.cui ILIKE '%${search}%' OR c.cnp ILIKE '%${search}%')`);
    }
    if (tip_client) {
      conditions.push(`c.tip_client = '${tip_client}'`);
    }
    if (status) {
      conditions.push(`c.status = '${status}'`);
    }
    if (oras) {
      conditions.push(`c.oras ILIKE '%${oras}%'`);
    }
    if (judet) {
      conditions.push(`c.judet ILIKE '%${judet}%'`);
    }
    if (categorie) {
      conditions.push(`c.categorie ILIKE '%${categorie}%'`);
    }
    if (agent_vanzari) {
      conditions.push(`c.agent_vanzari ILIKE '%${agent_vanzari}%'`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}`;

    const queryStr = `
      SELECT 
        c.*,
        CASE 
          WHEN c.status = 'activ' THEN 'Activ'
          WHEN c.status = 'inactiv' THEN 'Inactiv'
          WHEN c.status = 'suspendat' THEN 'Suspendat'
          ELSE c.status
        END as status_display
      FROM clients c
      ${whereClause}
      ${orderClause}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const clients = await sql.unsafe(queryStr);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM clients c
      ${whereClause}
    `;
    
    const [{ total }] = await sql.unsafe(countQuery);

    return {
      clients,
      total: parseInt(total),
      limit,
      offset
    };
  }

  static async getById(id) {
    const [client] = await sql`
      SELECT 
        c.*,
        CASE 
          WHEN c.status = 'activ' THEN 'Activ'
          WHEN c.status = 'inactiv' THEN 'Inactiv'
          WHEN c.status = 'suspendat' THEN 'Suspendat'
          ELSE c.status
        END as status_display
      FROM clients c
      WHERE c.id = ${id}
    `;
    return client;
  }

  static async create(data) {
    const [client] = await sql`
      INSERT INTO clients (
        nume, tip_client, email, telefon, fax, website,
        adresa, oras, judet, cod_postal, tara,
        cui, nr_reg_com, cont_bancar, banca,
        cnp, ci_serie, ci_numar,
        agent_vanzari, conditii_plata, limita_credit, discount_implicit,
        status, categorie, sursa, observatii
      )
      VALUES (
        ${data.nume},
        ${data.tip_client || 'persoana_fizica'},
        ${data.email || null},
        ${data.telefon || null},
        ${data.fax || null},
        ${data.website || null},
        ${data.adresa || null},
        ${data.oras || null},
        ${data.judet || null},
        ${data.cod_postal || null},
        ${data.tara || 'Romania'},
        ${data.cui || null},
        ${data.nr_reg_com || null},
        ${data.cont_bancar || null},
        ${data.banca || null},
        ${data.cnp || null},
        ${data.ci_serie || null},
        ${data.ci_numar || null},
        ${data.agent_vanzari || null},
        ${data.conditii_plata || '30_zile'},
        ${data.limita_credit ? parseFloat(data.limita_credit) : 0},
        ${data.discount_implicit ? parseFloat(data.discount_implicit) : 0},
        ${data.status || 'activ'},
        ${data.categorie || null},
        ${data.sursa || null},
        ${data.observatii || null}
      )
      RETURNING *
    `;
    return client;
  }

  static async update(id, data) {
    const [client] = await sql`
      UPDATE clients 
      SET 
        nume = ${data.nume},
        tip_client = ${data.tip_client || 'persoana_fizica'},
        email = ${data.email || null},
        telefon = ${data.telefon || null},
        fax = ${data.fax || null},
        website = ${data.website || null},
        adresa = ${data.adresa || null},
        oras = ${data.oras || null},
        judet = ${data.judet || null},
        cod_postal = ${data.cod_postal || null},
        tara = ${data.tara || 'Romania'},
        cui = ${data.cui || null},
        nr_reg_com = ${data.nr_reg_com || null},
        cont_bancar = ${data.cont_bancar || null},
        banca = ${data.banca || null},
        cnp = ${data.cnp || null},
        ci_serie = ${data.ci_serie || null},
        ci_numar = ${data.ci_numar || null},
        agent_vanzari = ${data.agent_vanzari || null},
        conditii_plata = ${data.conditii_plata || '30_zile'},
        limita_credit = ${data.limita_credit ? parseFloat(data.limita_credit) : 0},
        discount_implicit = ${data.discount_implicit ? parseFloat(data.discount_implicit) : 0},
        status = ${data.status || 'activ'},
        categorie = ${data.categorie || null},
        sursa = ${data.sursa || null},
        observatii = ${data.observatii || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return client;
  }

  static async delete(id) {
    const [deletedClient] = await sql`
      DELETE FROM clients WHERE id = ${id} RETURNING *
    `;
    return deletedClient;
  }

  static async getByEmail(email) {
    const [client] = await sql`
      SELECT * FROM clients WHERE email = ${email}
    `;
    return client;
  }

  static async getByCUI(cui) {
    const [client] = await sql`
      SELECT * FROM clients WHERE cui = ${cui}
    `;
    return client;
  }

  static async getByCNP(cnp) {
    const [client] = await sql`
      SELECT * FROM clients WHERE cnp = ${cnp}
    `;
    return client;
  }

  static async getStatistics() {
    const [stats] = await sql`
      SELECT 
        COUNT(*) as totalClients,
        COUNT(CASE WHEN status = 'activ' THEN 1 END) as activeClients,
        COUNT(CASE WHEN status = 'inactiv' THEN 1 END) as inactiveClients,
        COUNT(CASE WHEN status = 'suspendat' THEN 1 END) as suspendedClients,
        COUNT(CASE WHEN tip_client = 'persoana_juridica' THEN 1 END) as companiesCount,
        COUNT(CASE WHEN tip_client = 'persoana_fizica' THEN 1 END) as individualsCount,
        COUNT(DISTINCT oras) as citiesCount,
        COUNT(DISTINCT judet) as countiesCount,
        SUM(limita_credit) as totalCreditLimit,
        AVG(discount_implicit) as avgDiscount
      FROM clients
    `;
    return stats;
  }

  static async getRelatedData() {
    // Get distinct values for dropdowns
    const [cities, counties, categories, sources, paymentTerms] = await Promise.all([
      sql`SELECT DISTINCT oras as value FROM clients WHERE oras IS NOT NULL AND oras != '' ORDER BY oras ASC`,
      sql`SELECT DISTINCT judet as value FROM clients WHERE judet IS NOT NULL AND judet != '' ORDER BY judet ASC`,
      sql`SELECT DISTINCT categorie as value FROM clients WHERE categorie IS NOT NULL AND categorie != '' ORDER BY categorie ASC`,
      sql`SELECT DISTINCT sursa as value FROM clients WHERE sursa IS NOT NULL AND sursa != '' ORDER BY sursa ASC`,
      sql`SELECT DISTINCT conditii_plata as value FROM clients WHERE conditii_plata IS NOT NULL ORDER BY conditii_plata ASC`
    ]);

    return {
      cities: cities.map(c => c.value),
      counties: counties.map(c => c.value),
      categories: categories.map(c => c.value),
      sources: sources.map(c => c.value),
      paymentTerms: paymentTerms.map(c => c.value),
      // Predefined options
      clientTypes: [
        { value: 'persoana_fizica', label: 'Persoană Fizică' },
        { value: 'persoana_juridica', label: 'Persoană Juridică' }
      ],
      statusOptions: [
        { value: 'activ', label: 'Activ' },
        { value: 'inactiv', label: 'Inactiv' },
        { value: 'suspendat', label: 'Suspendat' }
      ],
      paymentTermsOptions: [
        { value: '15_zile', label: '15 zile' },
        { value: '30_zile', label: '30 zile' },
        { value: '45_zile', label: '45 zile' },
        { value: '60_zile', label: '60 zile' },
        { value: 'avans', label: 'Avans' },
        { value: 'ramburs', label: 'Ramburs' }
      ]
    };
  }

  static async bulkUpdateStatus(clientIds, status) {
    const clients = await sql`
      UPDATE clients 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ANY(${clientIds})
      RETURNING *
    `;
    return clients;
  }
}

module.exports = Client;