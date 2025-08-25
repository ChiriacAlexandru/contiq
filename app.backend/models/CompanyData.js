const { sql } = require('../config/database');

class CompanyData {
  static get TABLE() {
    return 'company_data';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      USER_ID: 'user_id',
      NUME_FIRMA: 'nume_firma',
      CUI: 'cui',
      NR_REG_COMERT: 'nr_reg_comert',
      ADRESA_SEDIU: 'adresa_sediu',
      ORAS: 'oras',
      JUDET: 'judet',
      COD_POSTAL: 'cod_postal',
      TARA: 'tara',
      TELEFON: 'telefon',
      EMAIL: 'email',
      WEBSITE: 'website',
      CAPITAL_SOCIAL: 'capital_social',
      CONT_BANCAR: 'cont_bancar',
      BANCA: 'banca',
      PLATITOR_TVA: 'platitor_tva',
      REPREZENTANT_LEGAL: 'reprezentant_legal',
      FUNCTIE_REPREZENTANT: 'functie_reprezentant',
      CNP_REPREZENTANT: 'cnp_reprezentant',
      AN_FISCAL: 'an_fiscal',
      MONEDA_PRINCIPALA: 'moneda_principala',
      LIMBA_IMPLICITA: 'limba_implicita',
      TIMP_ZONA: 'timp_zona',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }
  static async findByUserId(userId) {
    const [company] = await sql`
      SELECT * FROM company_data WHERE user_id = ${userId}
    `;
    return company;
  }

  static async createOrUpdate(userId, data) {
    const {
      nume_firma, cui, nr_reg_comert, adresa_sediu, oras, judet, cod_postal,
      tara, telefon, email, website, capital_social, cont_bancar, banca,
      platitor_tva, reprezentant_legal, functie_reprezentant, cnp_reprezentant,
      an_fiscal, moneda_principala, limba_implicita, timp_zona
    } = data;

    const existingCompany = await sql`
      SELECT id FROM company_data WHERE user_id = ${userId}
    `;

    let result;
    if (existingCompany.length > 0) {
      [result] = await sql`
        UPDATE company_data 
        SET 
          nume_firma = COALESCE(${nume_firma}, nume_firma),
          cui = COALESCE(${cui}, cui),
          nr_reg_comert = COALESCE(${nr_reg_comert}, nr_reg_comert),
          adresa_sediu = COALESCE(${adresa_sediu}, adresa_sediu),
          oras = COALESCE(${oras}, oras),
          judet = COALESCE(${judet}, judet),
          cod_postal = COALESCE(${cod_postal}, cod_postal),
          tara = COALESCE(${tara}, tara),
          telefon = COALESCE(${telefon}, telefon),
          email = COALESCE(${email}, email),
          website = COALESCE(${website}, website),
          capital_social = COALESCE(${capital_social}, capital_social),
          cont_bancar = COALESCE(${cont_bancar}, cont_bancar),
          banca = COALESCE(${banca}, banca),
          platitor_tva = COALESCE(${platitor_tva}, platitor_tva),
          reprezentant_legal = COALESCE(${reprezentant_legal}, reprezentant_legal),
          functie_reprezentant = COALESCE(${functie_reprezentant}, functie_reprezentant),
          cnp_reprezentant = COALESCE(${cnp_reprezentant}, cnp_reprezentant),
          an_fiscal = COALESCE(${an_fiscal}, an_fiscal),
          moneda_principala = COALESCE(${moneda_principala}, moneda_principala),
          limba_implicita = COALESCE(${limba_implicita}, limba_implicita),
          timp_zona = COALESCE(${timp_zona}, timp_zona)
        WHERE user_id = ${userId}
        RETURNING *
      `;
    } else {
      [result] = await sql`
        INSERT INTO company_data (
          user_id, nume_firma, cui, nr_reg_comert, adresa_sediu, oras, judet,
          cod_postal, tara, telefon, email, website, capital_social, cont_bancar,
          banca, platitor_tva, reprezentant_legal, functie_reprezentant, 
          cnp_reprezentant, an_fiscal, moneda_principala, limba_implicita, timp_zona
        ) VALUES (
          ${userId}, ${nume_firma}, ${cui}, ${nr_reg_comert}, ${adresa_sediu},
          ${oras}, ${judet}, ${cod_postal}, ${tara}, ${telefon}, ${email}, ${website},
          ${capital_social}, ${cont_bancar}, ${banca}, ${platitor_tva}, ${reprezentant_legal},
          ${functie_reprezentant}, ${cnp_reprezentant}, ${an_fiscal}, ${moneda_principala},
          ${limba_implicita}, ${timp_zona}
        )
        RETURNING *
      `;
    }

    return result;
  }
}

module.exports = CompanyData;