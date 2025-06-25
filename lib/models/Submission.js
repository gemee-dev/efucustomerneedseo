import { query } from '../db.js'

// In-memory fallback for development when PostgreSQL is not available
// Use global to persist across requests in development
if (!global.inMemorySubmissions) {
  global.inMemorySubmissions = new Map()
}
const inMemorySubmissions = global.inMemorySubmissions

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

    try {
      const result = await query(
        `INSERT INTO submissions
         (user_id, email, name, company, service, budget, timeline, description, phone, website, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [user_id, email, name, company, service, budget, timeline, description, phone, website, ip_address, user_agent]
      )

      return result.rows[0]
    } catch (error) {
      // Fallback to in-memory storage
      const submission = {
        id: inMemorySubmissions.size + 1,
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
        status: 'received',
        ip_address,
        user_agent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      inMemorySubmissions.set(submission.id, submission)
      console.log(`📝 Submission stored in memory: ${submission.id} from ${email}`)
      return submission
    }
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
    try {
      const result = await query(
        `SELECT s.*, u.verified_at as user_verified
         FROM submissions s
         LEFT JOIN users u ON s.email = u.email
         ORDER BY s.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      )

      return result.rows
    } catch (error) {
      // Fallback to in-memory storage
      const submissions = Array.from(inMemorySubmissions.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(offset, offset + limit)
      return submissions
    }
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
    try {
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
    } catch (error) {
      // Fallback to in-memory storage stats
      const submissions = Array.from(inMemorySubmissions.values())
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const byStatus = {}
      const serviceCount = {}

      submissions.forEach(sub => {
        byStatus[sub.status] = (byStatus[sub.status] || 0) + 1
        serviceCount[sub.service] = (serviceCount[sub.service] || 0) + 1
      })

      const byService = Object.entries(serviceCount)
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return {
        total: submissions.length,
        byStatus,
        byService,
        recent: submissions.filter(s => new Date(s.created_at) > weekAgo).length,
        thisMonth: submissions.filter(s => new Date(s.created_at) > monthStart).length
      }
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
