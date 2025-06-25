import { query } from '../db.js'
import bcrypt from 'bcryptjs'

export class Admin {
  static async create(adminData) {
    const { email, password, name, role = 'admin' } = adminData
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const result = await query(
      `INSERT INTO admins (email, password, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, created_at`,
      [email, hashedPassword, name, role]
    )
    
    return result.rows[0]
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    )
    
    return result.rows[0] || null
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM admins WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
  }

  static async authenticate(email, password) {
    const admin = await this.findByEmail(email)
    
    if (!admin) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)
    
    if (!isValidPassword) {
      return null
    }

    // Return admin without password
    const { password: _, ...adminWithoutPassword } = admin
    return adminWithoutPassword
  }

  static async updateLastLogin(id) {
    await query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    )
  }

  static async getAll() {
    const result = await query(
      'SELECT id, email, name, role, created_at, last_login FROM admins ORDER BY created_at DESC'
    )
    
    return result.rows
  }

  static async updateRole(id, role) {
    const result = await query(
      'UPDATE admins SET role = $2 WHERE id = $1 RETURNING id, email, name, role',
      [id, role]
    )
    
    return result.rows[0]
  }

  static async delete(id) {
    const result = await query(
      'DELETE FROM admins WHERE id = $1 RETURNING id',
      [id]
    )
    
    return result.rows[0]
  }

  static async initializeDefaultAdmins() {
    try {
      // Check if admins already exist
      const existingAdmins = await query('SELECT COUNT(*) as count FROM admins')
      
      if (parseInt(existingAdmins.rows[0].count) > 0) {
        console.log('✅ Admin users already exist')
        return
      }

      // Create default admin users
      const defaultAdmins = [
        {
          email: 'gemechu@customerneedseo.com',
          password: 'admin123!@#',
          name: 'Gemechu',
          role: 'super_admin'
        },
        {
          email: 'daniel@customerneedseo.com', 
          password: 'admin123!@#',
          name: 'Daniel',
          role: 'admin'
        }
      ]

      for (const adminData of defaultAdmins) {
        await this.create(adminData)
        console.log(`✅ Created admin user: ${adminData.email}`)
      }

      console.log('🎉 Default admin users created successfully!')
      
    } catch (error) {
      console.error('❌ Failed to initialize admin users:', error)
      throw error
    }
  }
}
