import { connectToMongoose } from '../mongodb.js'
import { Admin as AdminModel } from '../schemas/index.js'
import bcrypt from 'bcryptjs'

// In-memory fallback for development when MongoDB is not available
// Use global to persist across requests in development
if (!global.inMemoryAdmins) {
  global.inMemoryAdmins = new Map()
}
const inMemoryAdmins = global.inMemoryAdmins
let isMongoAvailable = true

// Initialize admins immediately when module loads
let initPromise = null

// Initialize default admins in memory
const initInMemoryAdmins = async () => {
  if (inMemoryAdmins.size === 0) {
    console.log('🔧 Initializing in-memory admin users...')

    const defaultAdmins = [
      {
        id: 1,
        email: 'gemechu',
        password: await bcrypt.hash('daniel', 12),
        name: 'Gemechu Admin',
        role: 'super_admin',
        created_at: new Date().toISOString(),
        last_login: null
      },
      {
        id: 2,
        email: 'gbonsa2@gmail.com',
        password: await bcrypt.hash('gemegold*0913', 12),
        name: 'Gbonsa Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
        last_login: null
      }
    ]

    defaultAdmins.forEach(admin => {
      inMemoryAdmins.set(admin.email, admin)
      console.log(`✅ Created in-memory admin: ${admin.email}`)
    })

    console.log('✅ In-memory admin users initialized successfully')
  }
}

// Ensure initialization happens
const ensureInitialized = async () => {
  if (!initPromise) {
    initPromise = initInMemoryAdmins()
  }
  return initPromise
}

export class Admin {
  static async create(adminData) {
    const { email, password, name, role = 'admin' } = adminData

    try {
      await connectToMongoose()

      const admin = new AdminModel({
        email,
        password, // Will be hashed by the schema pre-save hook
        name,
        role
      })

      const savedAdmin = await admin.save()

      // Return admin without password
      const { password: _, ...adminWithoutPassword } = savedAdmin.toObject()
      return adminWithoutPassword
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory admin storage')
      await ensureInitialized()
      const hashedPassword = await bcrypt.hash(password, 12)
      const admin = {
        _id: inMemoryAdmins.size + 1,
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
      await connectToMongoose()

      const admin = await AdminModel.findOne({ email }).lean()
      return admin || null
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory admin storage')
      await ensureInitialized()
      const admin = inMemoryAdmins.get(email)
      console.log(`🔍 Looking for admin: ${email}, found: ${admin ? 'YES' : 'NO'}`)
      return admin || null
    }
  }

  static async findById(id) {
    try {
      await connectToMongoose()

      const admin = await AdminModel.findById(id).select('-password').lean()
      return admin || null
    } catch (error) {
      // Fallback to in-memory storage
      await ensureInitialized()
      for (const admin of inMemoryAdmins.values()) {
        if (admin._id === id || admin._id.toString() === id.toString()) {
          const { password: _, ...adminWithoutPassword } = admin
          return adminWithoutPassword
        }
      }
      return null
    }
  }

  static async authenticate(email, password) {
    try {
      console.log(`🔐 Attempting to authenticate: ${email}`)
      const admin = await this.findByEmail(email)

      if (!admin) {
        console.log(`❌ Admin not found: ${email}`)
        return null
      }

      console.log(`✅ Admin found: ${email}, checking password...`)
      const isValidPassword = await bcrypt.compare(password, admin.password)

      if (!isValidPassword) {
        console.log(`❌ Invalid password for: ${email}`)
        return null
      }

      console.log(`✅ Authentication successful for: ${email}`)
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
      await connectToMongoose()

      await AdminModel.findByIdAndUpdate(id, {
        last_login: new Date()
      })
    } catch (error) {
      // Fallback to in-memory storage
      await ensureInitialized()
      for (const admin of inMemoryAdmins.values()) {
        if (admin._id === id || admin._id.toString() === id.toString()) {
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
      // Try MongoDB first
      await connectToMongoose()

      const existingAdmins = await AdminModel.countDocuments()

      if (existingAdmins > 0) {
        console.log('✅ Admin users already exist in MongoDB')
        return
      }

      // Create default admin users in MongoDB
      const defaultAdmins = [
        {
          email: 'gemechu@efuyegela.com',
          password: 'admin123!@#',
          name: 'gemechu',
          role: 'super_admin'
        },
        {
          email: 'daniel@efuyegela.com',
          password: 'admin123!@#',
          name: 'daniel',
          role: 'admin'
        }
      ]

      for (const adminData of defaultAdmins) {
        await this.create(adminData)
        console.log(`✅ Created admin user in MongoDB: ${adminData.email}`)
      }

      console.log('🎉 Default admin users created successfully in MongoDB!')

    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory admin storage')
      await ensureInitialized()
      console.log('✅ In-memory admin users ready for development')
    }
  }
}
