import { query } from '../db.js'

export class User {
  static async create(userData) {
    const { email, name, company, phone } = userData
    
    const result = await query(
      `INSERT INTO users (email, name, company, phone) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [email, name, company, phone]
    )
    
    return result.rows[0]
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    
    return result.rows[0] || null
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  }

  static async update(id, userData) {
    const { name, company, phone } = userData
    
    const result = await query(
      `UPDATE users 
       SET name = $2, company = $3, phone = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id, name, company, phone]
    )
    
    return result.rows[0]
  }

  static async markAsVerified(email) {
    const result = await query(
      `UPDATE users 
       SET verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE email = $1 
       RETURNING *`,
      [email]
    )
    
    return result.rows[0]
  }

  static async getOrCreate(userData) {
    let user = await this.findByEmail(userData.email)
    
    if (!user) {
      user = await this.create(userData)
    }
    
    return user
  }

  static async getStats() {
    const totalUsers = await query('SELECT COUNT(*) as count FROM users')
    const verifiedUsers = await query('SELECT COUNT(*) as count FROM users WHERE verified_at IS NOT NULL')
    const recentUsers = await query(
      'SELECT COUNT(*) as count FROM users WHERE created_at > NOW() - INTERVAL \'7 days\''
    )

    return {
      total: parseInt(totalUsers.rows[0].count),
      verified: parseInt(verifiedUsers.rows[0].count),
      recent: parseInt(recentUsers.rows[0].count)
    }
  }
}
