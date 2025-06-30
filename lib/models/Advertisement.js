import { connectToMongoose } from '../mongodb.js'
import { Advertisement as AdvertisementModel } from '../schemas/index.js'

// In-memory fallback for development when MongoDB is not available
if (!global.inMemoryAdvertisements) {
  global.inMemoryAdvertisements = new Map()
  
  // Initialize with some default ads
  const defaultAds = [
    {
      _id: 1,
      position: 'header',
      title: 'Special Offer',
      content: 'Get 20% off all web development projects this month!',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      _id: 2,
      position: 'sidebar',
      title: 'Professional Services',
      content: 'Expert consulting for your business needs',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      _id: 3,
      position: 'inline',
      title: 'Portfolio Showcase',
      content: 'View our latest projects and success stories',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
  
  defaultAds.forEach(ad => {
    global.inMemoryAdvertisements.set(ad._id, ad)
  })
}
const inMemoryAdvertisements = global.inMemoryAdvertisements

export class Advertisement {
  static async create(advertisementData) {
    const {
      position,
      title,
      content,
      status,
      created_by
    } = advertisementData

    try {
      await connectToMongoose()

      const advertisement = new AdvertisementModel({
        position,
        title,
        content,
        status: status || 'active',
        created_by
      })

      const savedAdvertisement = await advertisement.save()
      console.log(`📢 Advertisement created: ${title} (${position})`)
      return savedAdvertisement.toObject()
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory advertisement storage')
      const advertisement = {
        _id: inMemoryAdvertisements.size + 1,
        position,
        title,
        content,
        status: status || 'active',
        created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      inMemoryAdvertisements.set(advertisement._id, advertisement)
      console.log(`📢 Advertisement stored in memory: ${title} (${position})`)
      return advertisement
    }
  }

  static async getAll(status = 'active', limit = 50) {
    try {
      await connectToMongoose()
      
      const query = status ? { status } : {}
      const advertisements = await AdvertisementModel
        .find(query)
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()

      console.log(`📢 Retrieved ${advertisements.length} advertisements from MongoDB`)
      return advertisements
    } catch (error) {
      console.log('⚠️ MongoDB query failed, using in-memory storage:', error.message)
      // Fallback to in-memory storage
      const advertisements = Array.from(inMemoryAdvertisements.values())
        .filter(ad => !status || ad.status === status)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit)
      console.log(`📢 Retrieved ${advertisements.length} advertisements from memory`)
      return advertisements
    }
  }

  static async getByPosition(position, status = 'active', limit = 10) {
    try {
      await connectToMongoose()
      
      const query = { position }
      if (status) {
        query.status = status
      }
      
      const advertisements = await AdvertisementModel
        .find(query)
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()

      console.log(`📢 Retrieved ${advertisements.length} ${position} advertisements from MongoDB`)
      return advertisements
    } catch (error) {
      console.log('⚠️ MongoDB query failed, using in-memory storage:', error.message)
      // Fallback to in-memory storage
      const advertisements = Array.from(inMemoryAdvertisements.values())
        .filter(ad => ad.position === position && (!status || ad.status === status))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit)
      console.log(`📢 Retrieved ${advertisements.length} ${position} advertisements from memory`)
      return advertisements
    }
  }

  static async findById(id) {
    try {
      await connectToMongoose()
      const advertisement = await AdvertisementModel.findById(id).lean()
      return advertisement
    } catch (error) {
      // Fallback to in-memory storage
      return inMemoryAdvertisements.get(parseInt(id)) || null
    }
  }

  static async update(id, updateData) {
    try {
      await connectToMongoose()
      const advertisement = await AdvertisementModel.findByIdAndUpdate(
        id,
        { ...updateData, updated_at: new Date() },
        { new: true }
      ).lean()
      
      if (advertisement) {
        console.log(`📢 Advertisement updated: ${advertisement.title}`)
      }
      return advertisement
    } catch (error) {
      // Fallback to in-memory storage
      const advertisement = inMemoryAdvertisements.get(parseInt(id))
      if (advertisement) {
        Object.assign(advertisement, updateData, { updated_at: new Date().toISOString() })
        inMemoryAdvertisements.set(parseInt(id), advertisement)
        console.log(`📢 Advertisement updated in memory: ${advertisement.title}`)
        return advertisement
      }
      return null
    }
  }

  static async delete(id) {
    try {
      await connectToMongoose()
      const advertisement = await AdvertisementModel.findByIdAndDelete(id).lean()
      
      if (advertisement) {
        console.log(`📢 Advertisement deleted: ${advertisement.title}`)
      }
      return advertisement
    } catch (error) {
      // Fallback to in-memory storage
      const advertisement = inMemoryAdvertisements.get(parseInt(id))
      if (advertisement) {
        inMemoryAdvertisements.delete(parseInt(id))
        console.log(`📢 Advertisement deleted from memory: ${advertisement.title}`)
        return advertisement
      }
      return null
    }
  }

  static async updateStatus(id, status) {
    try {
      await connectToMongoose()
      const advertisement = await AdvertisementModel.findByIdAndUpdate(
        id,
        { status, updated_at: new Date() },
        { new: true }
      ).lean()
      return advertisement
    } catch (error) {
      // Fallback to in-memory storage
      const advertisement = inMemoryAdvertisements.get(parseInt(id))
      if (advertisement) {
        advertisement.status = status
        advertisement.updated_at = new Date().toISOString()
        inMemoryAdvertisements.set(parseInt(id), advertisement)
        return advertisement
      }
      return null
    }
  }

  static async getStats() {
    try {
      await connectToMongoose()

      // Get total count
      const total = await AdvertisementModel.countDocuments({})

      // Get count by status
      const statusAggregation = await AdvertisementModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      const byStatus = statusAggregation.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {})

      // Get count by position
      const positionAggregation = await AdvertisementModel.aggregate([
        { $group: { _id: '$position', count: { $sum: 1 } } }
      ])
      const byPosition = positionAggregation.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {})

      return {
        total,
        byStatus,
        byPosition,
        active: byStatus.active || 0,
        inactive: byStatus.inactive || 0
      }
    } catch (error) {
      console.log('⚠️ MongoDB stats query failed, using in-memory storage:', error.message)
      // Fallback to in-memory storage stats
      const advertisements = Array.from(inMemoryAdvertisements.values())
      
      const byStatus = {}
      const byPosition = {}

      advertisements.forEach(ad => {
        byStatus[ad.status] = (byStatus[ad.status] || 0) + 1
        byPosition[ad.position] = (byPosition[ad.position] || 0) + 1
      })

      return {
        total: advertisements.length,
        byStatus,
        byPosition,
        active: byStatus.active || 0,
        inactive: byStatus.inactive || 0
      }
    }
  }
}
