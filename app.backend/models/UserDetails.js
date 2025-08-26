const { sql } = require('../config/database');

class UserDetails {
  static get TABLE() {
    return 'user_details';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      USER_ID: 'user_id',
      NUME: 'nume',
      TELEFON: 'telefon',
      POZITIE: 'pozitie',
      COMPANIE: 'companie',
      LOCATIE: 'locatie',
      BIO: 'bio',
      WEBSITE: 'website',
      LINKEDIN: 'linkedin',
      TEMA: 'tema',
      LIMBA: 'limba',
      TIMEZONE: 'timezone',
      DATE_FORMAT: 'date_format',
      CURRENCY: 'currency',
      SOUNDS: 'sounds',
      ANIMATIONS: 'animations',
      COMPACT_MODE: 'compact_mode',
      TWO_FACTOR_ENABLED: 'two_factor_enabled',
      SESSION_TIMEOUT: 'session_timeout',
      LOGIN_NOTIFICATIONS: 'login_notifications',
      DEVICE_TRACKING: 'device_tracking',
      NOTIFICATIONS_EMAIL: 'notifications_email',
      NOTIFICATIONS_PUSH: 'notifications_push', 
      NOTIFICATIONS_SMS: 'notifications_sms',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }
  static async update(userId, data) {
    const { 
      nume, telefon, pozitie, companie, locatie, bio, website, linkedin,
      tema, limba, timezone, date_format, currency, sounds, animations, 
      compact_mode, notifications_email, notifications_push, notifications_sms 
    } = data;

    // First try to update existing record
    let [updated] = await sql`
      UPDATE user_details 
      SET 
        nume = COALESCE(${nume}, nume),
        telefon = COALESCE(${telefon}, telefon),
        pozitie = COALESCE(${pozitie}, pozitie),
        companie = COALESCE(${companie}, companie),
        locatie = COALESCE(${locatie}, locatie),
        bio = COALESCE(${bio}, bio),
        website = COALESCE(${website}, website),
        linkedin = COALESCE(${linkedin}, linkedin),
        tema = COALESCE(${tema}, tema),
        limba = COALESCE(${limba}, limba),
        timezone = COALESCE(${timezone}, timezone),
        date_format = COALESCE(${date_format}, date_format),
        currency = COALESCE(${currency}, currency),
        sounds = COALESCE(${sounds}, sounds),
        animations = COALESCE(${animations}, animations),
        compact_mode = COALESCE(${compact_mode}, compact_mode),
        notifications_email = COALESCE(${notifications_email ? JSON.stringify(notifications_email) : null}, notifications_email),
        notifications_push = COALESCE(${notifications_push ? JSON.stringify(notifications_push) : null}, notifications_push),
        notifications_sms = COALESCE(${notifications_sms ? JSON.stringify(notifications_sms) : null}, notifications_sms)
      WHERE user_id = ${userId}
      RETURNING *
    `;

    // If no record was updated, create a new one
    if (!updated) {
      [updated] = await sql`
        INSERT INTO user_details (
          user_id, nume, telefon, pozitie, companie, locatie, bio, website, linkedin,
          tema, limba, timezone, date_format, currency, sounds, animations, compact_mode,
          notifications_email, notifications_push, notifications_sms
        ) VALUES (
          ${userId}, ${nume}, ${telefon}, ${pozitie}, ${companie}, ${locatie}, ${bio}, ${website}, ${linkedin},
          ${tema || 'light'}, ${limba || 'ro'}, ${timezone || 'Europe/Bucharest'}, 
          ${date_format || 'dd/MM/yyyy'}, ${currency || 'RON'}, ${sounds !== undefined ? sounds : true}, 
          ${animations !== undefined ? animations : true}, ${compact_mode !== undefined ? compact_mode : false},
          ${notifications_email ? JSON.stringify(notifications_email) : null},
          ${notifications_push ? JSON.stringify(notifications_push) : null},
          ${notifications_sms ? JSON.stringify(notifications_sms) : null}
        )
        RETURNING *
      `;
    }

    return updated;
  }

  static async findByUserId(userId) {
    const [details] = await sql`
      SELECT * FROM user_details WHERE user_id = ${userId}
    `;
    return details;
  }

  static async createOrUpdate(userId, data) {
    // Check if record exists
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      return await this.update(userId, data);
    } else {
      // Create new record with default values
      const { 
        nume, telefon, pozitie, companie, locatie, bio, website, linkedin,
        tema, limba, timezone, date_format, currency, sounds, animations, 
        compact_mode, notifications_email, notifications_push, notifications_sms 
      } = data;

      const [created] = await sql`
        INSERT INTO user_details (
          user_id, nume, telefon, pozitie, companie, locatie, bio, website, linkedin,
          tema, limba, timezone, date_format, currency, sounds, animations, compact_mode,
          notifications_email, notifications_push, notifications_sms
        ) VALUES (
          ${userId}, ${nume}, ${telefon}, ${pozitie}, ${companie}, ${locatie}, ${bio}, ${website}, ${linkedin},
          ${tema || 'light'}, ${limba || 'ro'}, ${timezone || 'Europe/Bucharest'}, 
          ${date_format || 'dd/MM/yyyy'}, ${currency || 'RON'}, ${sounds !== undefined ? sounds : true}, 
          ${animations !== undefined ? animations : true}, ${compact_mode !== undefined ? compact_mode : false},
          ${notifications_email ? JSON.stringify(notifications_email) : null},
          ${notifications_push ? JSON.stringify(notifications_push) : null},
          ${notifications_sms ? JSON.stringify(notifications_sms) : null}
        )
        RETURNING *
      `;
      
      return created;
    }
  }
}

module.exports = UserDetails;