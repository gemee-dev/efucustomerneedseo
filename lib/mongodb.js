import { MongoClient } from 'mongodb'
import mongoose from 'mongoose'

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/efuyegela'
const MONGODB_DB = process.env.MONGODB_DB || 'efuyegela'

// Global variables to cache connections
let client = null
let clientPromise = null
let mongooseConnection = null

// MongoDB Native Driver Connection
export async function connectToMongoDB() {
  if (client && client.topology && client.topology.isConnected()) {
    return { client, db: client.db(MONGODB_DB) }
  }

  try {
    if (!clientPromise) {
      client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      clientPromise = client.connect()
    }

    await clientPromise
    const db = client.db(MONGODB_DB)
    
    console.log('✅ Connected to MongoDB (Native Driver)')
    return { client, db }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

// Mongoose Connection
export async function connectToMongoose() {
  if (mongooseConnection && mongoose.connection.readyState === 1) {
    return mongooseConnection
  }

  try {
    mongooseConnection = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    
    console.log('✅ Connected to MongoDB (Mongoose)')
    return mongooseConnection
  } catch (error) {
    console.error('❌ Mongoose connection error:', error)
    throw error
  }
}

// Close connections
export async function closeMongoDB() {
  try {
    if (client) {
      await client.close()
      client = null
      clientPromise = null
    }
    
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      mongooseConnection = null
    }
    
    console.log('✅ MongoDB connections closed')
  } catch (error) {
    console.error('❌ Error closing MongoDB connections:', error)
  }
}

// Database query helper (for compatibility with existing code)
export async function query(queryString, params = []) {
  // This is a compatibility layer for PostgreSQL-style queries
  // In practice, we'll replace these with proper MongoDB operations
  throw new Error('Direct SQL queries not supported with MongoDB. Use MongoDB-specific operations.')
}

// Collection helpers
export async function getCollection(collectionName) {
  const { db } = await connectToMongoDB()
  return db.collection(collectionName)
}

// Health check
export async function checkMongoDBHealth() {
  try {
    const { db } = await connectToMongoDB()
    await db.admin().ping()
    return { status: 'healthy', database: 'mongodb' }
  } catch (error) {
    return { status: 'unhealthy', error: error.message, database: 'mongodb' }
  }
}

// Initialize database with indexes
export async function initializeDatabase() {
  try {
    const { db } = await connectToMongoDB()
    
    // Create indexes for better performance
    await db.collection('admins').createIndex({ email: 1 }, { unique: true })
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('otps').createIndex({ email: 1 })
    await db.collection('otps').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 })
    await db.collection('submissions').createIndex({ email: 1 })
    await db.collection('submissions').createIndex({ created_at: -1 })
    await db.collection('submissions').createIndex({ status: 1 })
    
    console.log('✅ MongoDB database initialized with indexes')
    return true
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return false
  }
}

export default {
  connectToMongoDB,
  connectToMongoose,
  closeMongoDB,
  query,
  getCollection,
  checkMongoDBHealth,
  initializeDatabase
}
