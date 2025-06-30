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
// Switch to efuyegela database
use('efuyegela');

// 1. Create Admin Users
db.admins.deleteMany({}); // Clear existing

// Hash passwords (you'll need to replace with actual hashed passwords)
// For now, we'll create with plain text and update later
db.admins.insertMany([
  {
    email: 'gemechu',
    password: '$2a$12$YourHashedPasswordHere', // Will be updated by app
    name: 'Gemechu Admin',
    role: 'super_admin',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    email: 'gbonsa2@gmail.com', 
    password: '$2a$12$YourHashedPasswordHere', // Will be updated by app
    name: 'Gbonsa Admin',
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// 2. Create Sample Advertisements
db.advertisements.deleteMany({}); // Clear existing

db.advertisements.insertMany([
  {
    position: 'header',
    title: 'Special Launch Offer',
    content: 'Get 30% off all web development projects this month! Limited time offer for new clients.',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    position: 'inline',
    title: 'Professional Web Development Services',
    content: 'Transform your business with our expert web development solutions. Custom websites, e-commerce platforms, and web applications built to scale.',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    position: 'sidebar',
    title: 'Mobile App Development',
    content: 'Native and cross-platform mobile applications for iOS and Android. React Native and Flutter expertise.',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    position: 'footer',
    title: 'Free Consultation Available',
    content: 'Schedule a free 30-minute consultation to discuss your project requirements and get expert advice.',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// 3. Create Sample Submissions
db.submissions.deleteMany({}); // Clear existing

db.submissions.insertMany([
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    company: 'Tech Startup Inc',
    service: 'Web Development',
    budget: '5k-10k',
    timeline: '2-3 months',
    description: 'Need a modern e-commerce website with payment integration',
    frontend_framework: 'React',
    backend_language: 'Node.js',
    backend_framework: 'Express.js',
    database: 'MongoDB',
    web_features: ['User Authentication', 'Payment Integration', 'Admin Dashboard'],
    hosting: 'Cloud (AWS/Azure)',
    status: 'received',
    created_at: new Date(Date.now() - 86400000), // 1 day ago
    updated_at: new Date(Date.now() - 86400000)
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    company: 'Marketing Agency',
    service: 'Mobile Development',
    budget: '10k-25k',
    timeline: '3-6 months',
    description: 'Cross-platform mobile app for client management',
    mobile_stack: 'React Native',
    target_platforms: ['iOS', 'Android'],
    app_type: 'Business/Productivity',
    mobile_features: ['Push Notifications', 'Offline Support', 'Real-time Chat'],
    backend_integration: 'Yes',
    app_store_deployment: 'Yes',
    status: 'in_progress',
    created_at: new Date(Date.now() - 172800000), // 2 days ago
    updated_at: new Date(Date.now() - 86400000)
  }
]);

// 4. Create Indexes for Performance
db.admins.createIndex({ email: 1 }, { unique: true });
db.submissions.createIndex({ email: 1 });
db.submissions.createIndex({ status: 1 });
db.submissions.createIndex({ service: 1 });
db.submissions.createIndex({ created_at: -1 });
db.advertisements.createIndex({ position: 1 });
db.advertisements.createIndex({ status: 1 });

// 5. Verify Data
print("=== Database Initialization Complete ===");
print("Admin users:", db.admins.countDocuments());
print("Advertisements:", db.advertisements.countDocuments());
print("Submissions:", db.submissions.countDocuments());
print("=== Ready for Deployment ===");