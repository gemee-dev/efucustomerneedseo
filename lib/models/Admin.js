import { query } from '../db.js'
import bcrypt from 'bcryptjs'

// In-memory fallback for development when PostgreSQL is not available
const inMemoryAdmins = new Map()
let isPostgresAvailable = true

// Initialize default admins in memory
const initInMemoryAdmins = async () => {
  if (inMemoryAdmins.size === 0) {
    const defaultAdmins = [
      {
        id: 1,
        email: 'gemechu@customerneedseo.com',
        password: await bcrypt.hash('admin123!@#', 12),
        name: 'Gemechu',
        role: 'super_admin',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        email: 'daniel@customerneedseo.com',
        password: await bcrypt.hash('admin123!@#', 12),
        name: 'Daniel',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ]

    defaultAdmins.forEach(admin => {
      inMemoryAdmins.set(admin.email, admin)
    })

    console.log('✅ In-memory admin users initialized')
  }
}

export class Admin {
  static async create(adminData) {
    const { email, password, name, role = 'admin' } = adminData

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      const result = await query(
        `INSERT INTO admins (email, password, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role, created_at`,
        [email, hashedPassword, name, role]
      )

      return result.rows[0]
    } catch (error) {
      // Fallback to in-memory storage
      await initInMemoryAdmins()
      const hashedPassword = await bcrypt.hash(password, 12)
      const admin = {
        id: inMemoryAdmins.size + 1,
        email,
        password: hashedPassword,
        name,
        role,
        created_at: new Date().toISOString()
      }
      inMemoryAdmins.set(email, admin)
      const { password: _, ...adminWithoutPassword } = admin
      return adminWithoutPassword
    }
  }

  static async findByEmail(email) {
    try {
      const result = await query(
        'SELECT * FROM admins WHERE email = $1',
        [email]
      )

      return result.rows[0] || null
    } catch (error) {
      // Fallback to in-memory storage
      await initInMemoryAdmins()
      return inMemoryAdmins.get(email) || null
    }
  }

  static async findById(id) {
    try {
      const result = await query(
        'SELECT id, email, name, role, created_at FROM admins WHERE id = $1',
        [id]
      )

      return result.rows[0] || null
    } catch (error) {
      // Fallback to in-memory storage
      await initInMemoryAdmins()
      for (const admin of inMemoryAdmins.values()) {
        if (admin.id === id) {
          const { password: _, ...adminWithoutPassword } = admin
          return adminWithoutPassword
        }
      }
      return null
    }
  }

  static async authenticate(email, password) {
    try {
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
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  static async updateLastLogin(id) {
    try {
      await query(
        'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      )
    } catch (error) {
      // Fallback to in-memory storage
      await initInMemoryAdmins()
      for (const admin of inMemoryAdmins.values()) {
        if (admin.id === id) {
          admin.last_login = new Date().toISOString()
          break
        }
      }
    }
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
      // Try PostgreSQL first
      const existingAdmins = await query('SELECT COUNT(*) as count FROM admins')

      if (parseInt(existingAdmins.rows[0].count) > 0) {
        console.log('✅ Admin users already exist in PostgreSQL')
        return
      }

      // Create default admin users in PostgreSQL
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
        console.log(`✅ Created admin user in PostgreSQL: ${adminData.email}`)
      }

      console.log('🎉 Default admin users created successfully in PostgreSQL!')

    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ PostgreSQL not available, using in-memory admin storage')
      await initInMemoryAdmins()
      console.log('✅ In-memory admin users ready for development')
    }
  }
}
