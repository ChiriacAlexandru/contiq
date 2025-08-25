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

    const [updated] = await sql`
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
        notifications_email = COALESCE(${JSON.stringify(notifications_email)}, notifications_email),
        notifications_push = COALESCE(${JSON.stringify(notifications_push)}, notifications_push),
        notifications_sms = COALESCE(${JSON.stringify(notifications_sms)}, notifications_sms)
      WHERE user_id = ${userId}
      RETURNING *
    `;

    return updated;
  }

  static async findByUserId(userId) {
    const [details] = await sql`
      SELECT * FROM user_details WHERE user_id = ${userId}
    `;
    return details;
  }
}

module.exports = UserDetails;