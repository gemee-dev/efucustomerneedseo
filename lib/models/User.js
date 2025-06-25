import { query } from '../db.js'

// In-memory fallback for development when PostgreSQL is not available
// Use global to persist across requests in development
if (!global.inMemoryUsers) {
  global.inMemoryUsers = new Map()
}
const inMemoryUsers = global.inMemoryUsers

export class User {
  static async create(userData) {
    const { email, name, company, phone } = userData

    try {
      const result = await query(
        `INSERT INTO users (email, name, company, phone)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [email, name, company, phone]
      )

      return result.rows[0]
    } catch (error) {
      // Fallback to in-memory storage
      const user = {
        id: inMemoryUsers.size + 1,
        email,
        name,
        company,
        phone,
        verified_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      inMemoryUsers.set(email, user)
      console.log(`👤 User stored in memory: ${email}`)
      return user
    }
  }

  static async findByEmail(email) {
    try {
      const result = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      return result.rows[0] || null
    } catch (error) {
      // Fallback to in-memory storage
      return inMemoryUsers.get(email) || null
    }
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
    try {
      let user = await this.findByEmail(userData.email)

      if (!user) {
        user = await this.create(userData)
      }

      return user
    } catch (error) {
      console.error('Error in getOrCreate:', error)
      // Fallback: create in memory
      return await this.create(userData)
    }
  }

  static async getStats() {
    try {
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
    } catch (error) {
      // Fallback to in-memory storage stats
      const users = Array.from(inMemoryUsers.values())
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      return {
        total: users.length,
        verified: users.filter(u => u.verified_at).length,
        recent: users.filter(u => new Date(u.created_at) > weekAgo).length
      }
    }
  }
}
