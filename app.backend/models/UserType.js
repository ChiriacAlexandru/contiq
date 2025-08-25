const { sql } = require('../config/database');

class UserType {
  static get TYPES() {
    return {
      USER: 'user',
      ADMINISTRATOR: 'administrator', 
      CONTABIL: 'contabil'
    };
  }

  static async findByName(typeName) {
    const [userType] = await sql`
      SELECT * FROM user_types WHERE type_name = ${typeName}
    `;
    return userType;
  }

  static async getAll() {
    const userTypes = await sql`
      SELECT * FROM user_types ORDER BY id
    `;
    return userTypes;
  }

  static async findById(id) {
    const [userType] = await sql`
      SELECT * FROM user_types WHERE id = ${id}
    `;
    return userType;
  }
}

module.exports = UserType;