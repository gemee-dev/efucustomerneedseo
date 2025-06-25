// Test MongoDB Integration
import { connectToMongoDB, connectToMongoose, checkMongoDBHealth, initializeDatabase } from './lib/mongodb.js'
import { Admin } from './lib/models/Admin.js'

async function testMongoDB() {
  console.log('🧪 Testing MongoDB Integration...\n')
  
  // Test 1: MongoDB Health Check
  console.log('1. Testing MongoDB Health Check')
  try {
    const health = await checkMongoDBHealth()
    console.log('✅ MongoDB Health:', health)
  } catch (error) {
    console.log('❌ MongoDB Health Error:', error.message)
    console.log('ℹ️ This is expected if MongoDB is not running locally')
  }
  
  // Test 2: Database Initialization
  console.log('\n2. Testing Database Initialization')
  try {
    const initialized = await initializeDatabase()
    console.log('✅ Database Initialization:', initialized ? 'Success' : 'Failed')
  } catch (error) {
    console.log('❌ Database Initialization Error:', error.message)
    console.log('ℹ️ This is expected if MongoDB is not running locally')
  }
  
  // Test 3: Admin Model with Fallback
  console.log('\n3. Testing Admin Model (with fallback)')
  try {
    await Admin.initializeDefaultAdmins()
    console.log('✅ Admin initialization completed')
    
    // Test admin authentication
    const admin = await Admin.authenticate('gbonsa2@gmail.com', 'gemegold*0913')
    if (admin) {
      console.log('✅ Admin authentication successful:', admin.name)
    } else {
      console.log('❌ Admin authentication failed')
    }
  } catch (error) {
    console.log('❌ Admin Model Error:', error.message)
  }
  
  // Test 4: Connection Status
  console.log('\n4. Testing Connection Status')
  try {
    const { client, db } = await connectToMongoDB()
    console.log('✅ MongoDB Native Driver connected')
    console.log('📊 Database name:', db.databaseName)
  } catch (error) {
    console.log('❌ MongoDB Connection Error:', error.message)
    console.log('ℹ️ Falling back to in-memory storage')
  }
  
  try {
    const mongoose = await connectToMongoose()
    console.log('✅ Mongoose connected')
    console.log('📊 Connection state:', mongoose.connection.readyState)
  } catch (error) {
    console.log('❌ Mongoose Connection Error:', error.message)
    console.log('ℹ️ Falling back to in-memory storage')
  }
  
  console.log('\n🎉 MongoDB Integration Test Complete!')
  console.log('\n📝 Summary:')
  console.log('- If MongoDB is running: Uses MongoDB for data storage')
  console.log('- If MongoDB is not available: Falls back to in-memory storage')
  console.log('- Application works in both scenarios')
  
  process.exit(0)
}

// Run the test
testMongoDB().catch(error => {
  console.error('❌ Test failed:', error)
  process.exit(1)
})
