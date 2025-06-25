import { connectToMongoose } from '../mongodb.js'
import { User as UserModel } from '../schemas/index.js'

// In-memory fallback for development when MongoDB is not available
// Use global to persist across requests in development
if (!global.inMemoryUsers) {
  global.inMemoryUsers = new Map()
}
const inMemoryUsers = global.inMemoryUsers

export class User {
  static async create(userData) {
    const { email, name, company, phone } = userData

    try {
      await connectToMongoose()

      const user = new UserModel({
        email,
        name,
        company,
        phone
      })

      const savedUser = await user.save()
      return savedUser.toObject()
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory user storage')
      const user = {
        _id: inMemoryUsers.size + 1,
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
      await connectToMongoose()

      const user = await UserModel.findOne({ email }).lean()
      return user || null
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory user storage')
      return inMemoryUsers.get(email) || null
    }
  }

  static async findById(id) {
    try {
      await connectToMongoose()

      const user = await UserModel.findById(id).lean()
      return user || null
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory user storage')
      for (const user of inMemoryUsers.values()) {
        if (user._id === id || user._id.toString() === id.toString()) {
          return user
        }
      }
      return null
    }
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
    try {
      await connectToMongoose()

      const user = await UserModel.findOneAndUpdate(
        { email },
        { verified_at: new Date() },
        { new: true }
      ).lean()

      return user
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory user storage')
      const user = inMemoryUsers.get(email)
      if (user) {
        user.verified_at = new Date().toISOString()
        inMemoryUsers.set(email, user)
        return user
      }
      return null
    }
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
