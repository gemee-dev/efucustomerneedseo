// Debug Database Access Issues
import { connectToMongoDB, connectToMongoose, checkMongoDBHealth } from './lib/mongodb.js'
import { Admin } from './lib/models/Admin.js'
import { User } from './lib/models/User.js'
import { Submission } from './lib/models/Submission.js'
import { OTP } from './lib/models/OTP.js'

async function debugDatabaseAccess() {
  console.log('🔍 Debugging Database Access Issues...\n')
  
  // Step 1: Check MongoDB Service Status
  console.log('1. Checking MongoDB Service Status')
  try {
    const health = await checkMongoDBHealth()
    console.log('✅ MongoDB Health Check:', health)
  } catch (error) {
    console.log('❌ MongoDB Health Check Failed:', error.message)
    console.log('💡 Possible issues:')
    console.log('   - MongoDB service not running')
    console.log('   - Connection string incorrect')
    console.log('   - Network/firewall issues')
  }
  
  // Step 2: Test Direct MongoDB Connection
  console.log('\n2. Testing Direct MongoDB Connection')
  try {
    const { client, db } = await connectToMongoDB()
    console.log('✅ MongoDB Native Driver Connected')
    console.log('📊 Database Name:', db.databaseName)
    
    // List collections
    const collections = await db.listCollections().toArray()
    console.log('📁 Collections:', collections.map(c => c.name))
    
    // Test a simple operation
    const adminCollection = db.collection('admins')
    const adminCount = await adminCollection.countDocuments()
    console.log('👥 Admin count:', adminCount)
    
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message)
    console.log('💡 This means MongoDB is not accessible')
  }
  
  // Step 3: Test Mongoose Connection
  console.log('\n3. Testing Mongoose Connection')
  try {
    await connectToMongoose()
    console.log('✅ Mongoose Connected')
    console.log('📊 Connection State:', {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    }[require('mongoose').connection.readyState])
  } catch (error) {
    console.log('❌ Mongoose Connection Failed:', error.message)
  }
  
  // Step 4: Test Model Operations
  console.log('\n4. Testing Model Operations')
  
  // Test Admin Model
  console.log('\n4a. Testing Admin Model')
  try {
    const admins = await Admin.findByEmail('gbonsa2@gmail.com')
    if (admins) {
      console.log('✅ Admin found:', admins.name)
    } else {
      console.log('⚠️ Admin not found, trying to create...')
      await Admin.initializeDefaultAdmins()
      const newAdmin = await Admin.findByEmail('gbonsa2@gmail.com')
      console.log('✅ Admin created:', newAdmin ? newAdmin.name : 'Failed')
    }
  } catch (error) {
    console.log('❌ Admin Model Error:', error.message)
  }
  
  // Test Authentication
  console.log('\n4b. Testing Authentication')
  try {
    const auth = await Admin.authenticate('gbonsa2@gmail.com', 'gemegold*0913')
    if (auth) {
      console.log('✅ Authentication successful:', auth.name)
    } else {
      console.log('❌ Authentication failed')
    }
  } catch (error) {
    console.log('❌ Authentication Error:', error.message)
  }
  
  // Step 5: Check Environment Variables
  console.log('\n5. Checking Environment Variables')
  console.log('MONGODB_URI:', process.env.MONGODB_URI || 'Not set (using default)')
  console.log('MONGODB_DB:', process.env.MONGODB_DB || 'Not set (using default)')
  
  // Step 6: Test API Endpoints
  console.log('\n6. Testing API Endpoints')
  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gbonsa2@gmail.com',
        password: 'gemegold*0913'
      })
    })
    
    const data = await response.json()
    if (data.success) {
      console.log('✅ API Login successful:', data.admin.name)
    } else {
      console.log('❌ API Login failed:', data.error)
    }
  } catch (error) {
    console.log('❌ API Test Error:', error.message)
  }
  
  console.log('\n🎯 Diagnosis Complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. If MongoDB connection failed: Start MongoDB service')
  console.log('2. If models work but API fails: Check server logs')
  console.log('3. If everything fails: Use in-memory fallback mode')
  
  process.exit(0)
}

// Run the debug
debugDatabaseAccess().catch(error => {
  console.error('❌ Debug failed:', error)
  process.exit(1)
})
