const { sql } = require('../config/database');
const UserType = require('./UserType');

class User {
  static get TABLE() {
    return 'users';
  }

  static get FIELDS() {
    return {
      ID: 'id',
      EMAIL: 'email', 
      PASSWORD_HASH: 'password_hash',
      ACTIVATED: 'activated',
      USER_TYPE_ID: 'user_type_id',
      CREATED_AT: 'created_at',
      UPDATED_AT: 'updated_at'
    };
  }
  static async findByEmail(email) {
    const [user] = await sql`
      SELECT u.*, ut.type_name 
      FROM users u 
      JOIN user_types ut ON u.user_type_id = ut.id 
      WHERE u.email = ${email}
    `;
    return user;
  }

  static async findById(id) {
    const [user] = await sql`
      SELECT u.*, ut.type_name 
      FROM users u 
      JOIN user_types ut ON u.user_type_id = ut.id 
      WHERE u.id = ${id}
    `;
    return user;
  }

  static async create(email, passwordHash, nume, userType = UserType.TYPES.USER) {
    const userTypeRecord = await UserType.findByName(userType);
    if (!userTypeRecord) {
      throw new Error('Tipul de utilizator nu este valid');
    }

    const [user] = await sql`
      INSERT INTO users (email, password_hash, user_type_id, activated)
      VALUES (${email}, ${passwordHash}, ${userTypeRecord.id}, false)
      RETURNING id, email, activated
    `;

    await sql`
      INSERT INTO user_details (user_id, nume)
      VALUES (${user.id}, ${nume})
    `;

    return user;
  }

  static async activate(userId) {
    const [updatedUser] = await sql`
      UPDATE users 
      SET activated = true 
      WHERE id = ${userId} 
      RETURNING id, email, activated
    `;
    return updatedUser;
  }

  static async getProfile(userId) {
    const [profile] = await sql`
      SELECT 
        u.id, u.email, u.activated,
        ut.type_name as user_type,
        ud.*,
        cd.*
      FROM users u
      LEFT JOIN user_types ut ON u.user_type_id = ut.id
      LEFT JOIN user_details ud ON u.id = ud.user_id
      LEFT JOIN company_data cd ON u.id = cd.user_id
      WHERE u.id = ${userId}
    `;
    return profile;
  }

  static async getAllUsers() {
    const users = await sql`
      SELECT 
        u.id, u.email, u.activated, u.created_at,
        ut.type_name as user_type,
        ud.nume
      FROM users u
      LEFT JOIN user_types ut ON u.user_type_id = ut.id
      LEFT JOIN user_details ud ON u.id = ud.user_id
      ORDER BY u.created_at DESC
    `;
    return users;
  }
}

module.exports = User;