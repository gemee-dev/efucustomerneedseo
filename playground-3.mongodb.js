// MongoDB Playground for Customer Need SEO Database
// This file provides direct MongoDB access and management tools

import { connectToMongoDB } from './lib/mongodb.js'

// Database connection
let db = null

async function initDB() {
  if (!db) {
    const connection = await connectToMongoDB()
    db = connection.db
  }
  return db
}

// Admin Management Functions
export async function getAllAdmins() {
  const database = await initDB()
  return await database.collection('admins').find({}).toArray()
}

export async function createAdmin(adminData) {
  const database = await initDB()
  const { email, password, name, role = 'admin' } = adminData
  
  // Hash password
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.default.hash(password, 12)
  
  const admin = {
    email,
    password: hashedPassword,
    name,
    role,
    created_at: new Date(),
    updated_at: new Date(),
    last_login: null
  }
  
  const result = await database.collection('admins').insertOne(admin)
  return { ...admin, _id: result.insertedId }
}

export async function deleteAdmin(email) {
  const database = await initDB()
  return await database.collection('admins').deleteOne({ email })
}

// User Management Functions
export async function getAllUsers() {
  const database = await initDB()
  return await database.collection('users').find({}).toArray()
}

export async function createUser(userData) {
  const database = await initDB()
  const user = {
    ...userData,
    verified_at: null,
    created_at: new Date(),
    updated_at: new Date()
  }
  
  const result = await database.collection('users').insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function deleteUser(email) {
  const database = await initDB()
  return await database.collection('users').deleteOne({ email })
}

// Submission Management Functions
export async function getAllSubmissions() {
  const database = await initDB()
  return await database.collection('submissions').find({}).sort({ created_at: -1 }).toArray()
}

export async function createSubmission(submissionData) {
  const database = await initDB()
  const submission = {
    ...submissionData,
    status: 'received',
    created_at: new Date(),
    updated_at: new Date()
  }
  
  const result = await database.collection('submissions').insertOne(submission)
  return { ...submission, _id: result.insertedId }
}

export async function updateSubmissionStatus(id, status) {
  const database = await initDB()
  const { ObjectId } = await import('mongodb')
  
  return await database.collection('submissions').updateOne(
    { _id: new ObjectId(id) },
    { 
      $set: { 
        status, 
        updated_at: new Date() 
      } 
    }
  )
}

export async function deleteSubmission(id) {
  const database = await initDB()
  const { ObjectId } = await import('mongodb')
  
  return await database.collection('submissions').deleteOne({ 
    _id: new ObjectId(id) 
  })
}

// OTP Management Functions
export async function getAllOTPs() {
  const database = await initDB()
  return await database.collection('otps').find({}).toArray()
}

export async function getActiveOTPs() {
  const database = await initDB()
  return await database.collection('otps').find({ 
    expires_at: { $gt: new Date() } 
  }).toArray()
}

export async function deleteExpiredOTPs() {
  const database = await initDB()
  return await database.collection('otps').deleteMany({ 
    expires_at: { $lte: new Date() } 
  })
}

// Database Statistics
export async function getDatabaseStats() {
  const database = await initDB()
  
  const [adminCount, userCount, submissionCount, otpCount] = await Promise.all([
    database.collection('admins').countDocuments(),
    database.collection('users').countDocuments(),
    database.collection('submissions').countDocuments(),
    database.collection('otps').countDocuments()
  ])
  
  return {
    admins: adminCount,
    users: userCount,
    submissions: submissionCount,
    otps: otpCount,
    total: adminCount + userCount + submissionCount + otpCount
  }
}

// Utility Functions
export async function clearAllData() {
  const database = await initDB()
  
  await Promise.all([
    database.collection('users').deleteMany({}),
    database.collection('submissions').deleteMany({}),
    database.collection('otps').deleteMany({})
  ])
  
  console.log('✅ All user data cleared (admins preserved)')
}

export async function seedTestData() {
  const database = await initDB()
  
  // Create test users
  const testUsers = [
    {
      email: 'john@example.com',
      name: 'John Doe',
      company: 'Tech Corp',
      phone: '123-456-7890',
      verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'jane@example.com',
      name: 'Jane Smith',
      company: 'Design Studio',
      phone: '098-765-4321',
      verified_at: null,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
  
  // Create test submissions
  const testSubmissions = [
    {
      email: 'john@example.com',
      name: 'John Doe',
      company: 'Tech Corp',
      service: 'seo-technology-consulting',
      budget: '3k-5k',
      timeline: '1-2 months',
      description: 'Need comprehensive SEO technology consulting for our e-commerce platform',
      phone: '123-456-7890',
      website: 'https://techcorp.com',
      status: 'received',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'jane@example.com',
      name: 'Jane Smith',
      company: 'Design Studio',
      service: 'digital-marketing-events',
      budget: '1k-3k',
      timeline: '2-3 months',
      description: 'Looking for digital marketing events and workshops for our team',
      phone: '098-765-4321',
      website: 'https://designstudio.com',
      status: 'in_progress',
      created_at: new Date(Date.now() - 86400000), // 1 day ago
      updated_at: new Date()
    }
  ]
  
  await database.collection('users').insertMany(testUsers)
  await database.collection('submissions').insertMany(testSubmissions)
  
  console.log('✅ Test data seeded successfully')
}

// Main playground function
async function playground() {
  console.log('🎮 MongoDB Playground for Customer Need SEO\n')
  
  try {
    // Show current stats
    const stats = await getDatabaseStats()
    console.log('📊 Current Database Stats:', stats)
    
    // Show all data
    console.log('\n👥 Admins:')
    const admins = await getAllAdmins()
    admins.forEach(admin => {
      console.log(`  - ${admin.name} (${admin.email}) - ${admin.role}`)
    })
    
    console.log('\n👤 Users:')
    const users = await getAllUsers()
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.company || 'No company'}`)
    })
    
    console.log('\n📝 Submissions:')
    const submissions = await getAllSubmissions()
    submissions.forEach(sub => {
      console.log(`  - ${sub.name} - ${sub.service} (${sub.status})`)
    })
    
    console.log('\n📧 Active OTPs:')
    const otps = await getActiveOTPs()
    otps.forEach(otp => {
      console.log(`  - ${otp.email} - ${otp.otp_code} (expires: ${otp.expires_at})`)
    })
    
  } catch (error) {
    console.error('❌ Playground error:', error)
  }
}

// Run playground if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  playground().then(() => process.exit(0)).catch(console.error)
}
