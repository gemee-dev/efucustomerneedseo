import { query } from '../db.js'

export class Submission {
  static async create(submissionData) {
    const {
      user_id,
      email,
      name,
      company,
      service,
      budget,
      timeline,
      description,
      phone,
      website,
      ip_address,
      user_agent
    } = submissionData

    const result = await query(
      `INSERT INTO submissions 
       (user_id, email, name, company, service, budget, timeline, description, phone, website, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [user_id, email, name, company, service, budget, timeline, description, phone, website, ip_address, user_agent]
    )

    return result.rows[0]
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM submissions WHERE id = $1',
      [id]
    )

    return result.rows[0] || null
  }

  static async findByEmail(email, limit = 10) {
    const result = await query(
      `SELECT * FROM submissions 
       WHERE email = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [email, limit]
    )

    return result.rows
  }

  static async updateStatus(id, status) {
    const result = await query(
      `UPDATE submissions 
       SET status = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id, status]
    )

    return result.rows[0]
  }

  static async getAll(limit = 50, offset = 0) {
    const result = await query(
      `SELECT s.*, u.verified_at as user_verified 
       FROM submissions s 
       LEFT JOIN users u ON s.email = u.email 
       ORDER BY s.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    return result.rows
  }

  static async getByStatus(status, limit = 50) {
    const result = await query(
      `SELECT * FROM submissions 
       WHERE status = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [status, limit]
    )

    return result.rows
  }

  static async getStats() {
    const total = await query('SELECT COUNT(*) as count FROM submissions')
    
    const byStatus = await query(`
      SELECT status, COUNT(*) as count 
      FROM submissions 
      GROUP BY status
    `)

    const byService = await query(`
      SELECT service, COUNT(*) as count 
      FROM submissions 
      GROUP BY service 
      ORDER BY count DESC 
      LIMIT 10
    `)

    const recent = await query(`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE created_at > NOW() - INTERVAL '7 days'
    `)

    const thisMonth = await query(`
      SELECT COUNT(*) as count 
      FROM submissions 
      WHERE created_at > DATE_TRUNC('month', NOW())
    `)

    return {
      total: parseInt(total.rows[0].count),
      byStatus: byStatus.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count)
        return acc
      }, {}),
      byService: byService.rows.map(row => ({
        service: row.service,
        count: parseInt(row.count)
      })),
      recent: parseInt(recent.rows[0].count),
      thisMonth: parseInt(thisMonth.rows[0].count)
    }
  }

  static async search(searchTerm, limit = 20) {
    const result = await query(
      `SELECT * FROM submissions 
       WHERE name ILIKE $1 
          OR email ILIKE $1 
          OR company ILIKE $1 
          OR description ILIKE $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    )

    return result.rows
  }
}
