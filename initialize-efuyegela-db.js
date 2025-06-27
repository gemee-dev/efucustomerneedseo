// Initialize Efuyegela Database
import { connectToMongoDB, initializeDatabase } from './lib/mongodb.js'
import { Admin } from './lib/models/Admin.js'

async function initializeEfuyegelaDB() {
  console.log('🚀 Initializing Efuyegela Database...\n')
  
  try {
    // Initialize database with indexes
    console.log('1. Setting up database indexes...')
    await initializeDatabase()
    
    // Initialize admin users
    console.log('\n2. Setting up admin users...')
    await Admin.initializeDefaultAdmins()
    
    // Add sample Efuyegela data
    console.log('\n3. Adding sample Efuyegela data...')
    const { db } = await connectToMongoDB()
    
    // Add sample users for Efuyegela
    const efuyegelaUsers = [
      {
        email: 'creator1@example.com',
        name: 'Alex Creative',
        company: 'Creative Studio Alpha',
        phone: '+1-555-1001',
        verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'publisher@example.com',
        name: 'Maria Publisher',
        company: 'Independent Publishing',
        phone: '+1-555-1002',
        verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'consultant@example.com',
        name: 'David Solutions',
        company: 'Business Consulting Group',
        phone: '+1-555-1003',
        verified_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    // Add sample submissions for Efuyegela services
    const efuyegelaSubmissions = [
      {
        email: 'creator1@example.com',
        name: 'Alex Creative',
        company: 'Creative Studio Alpha',
        service: 'efuyegela-publishers',
        budget: '3k-5k',
        timeline: '1-2 months',
        description: 'Looking for publishing support for my creative content. Need help with content creation, market research, and funding opportunities.',
        phone: '+1-555-1001',
        website: 'https://creativestudioalpha.com',
        status: 'received',
        ip_address: '192.168.1.201',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'publisher@example.com',
        name: 'Maria Publisher',
        company: 'Independent Publishing',
        service: 'efuyegela-consultants',
        budget: '5k-10k',
        timeline: '2-3 months',
        description: 'Need comprehensive turn-key solution for expanding our publishing business. Looking for user-focused, context-centered approach.',
        phone: '+1-555-1002',
        website: 'https://indeppublishing.com',
        status: 'in_progress',
        ip_address: '192.168.1.202',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 86400000), // 1 day ago
        updated_at: new Date()
      },
      {
        email: 'consultant@example.com',
        name: 'David Solutions',
        company: 'Business Consulting Group',
        service: 'efuyegela-intelligence',
        budget: '10k+',
        timeline: '3-6 months',
        description: 'Require ecosystem mapping and intelligence services for our new product development initiative. Need comprehensive market analysis.',
        phone: '+1-555-1003',
        website: 'https://bizconsultgroup.com',
        status: 'received',
        ip_address: '192.168.1.203',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 3600000), // 1 hour ago
        updated_at: new Date()
      },
      {
        email: 'events@example.com',
        name: 'Sarah Events',
        company: 'Event Management Pro',
        service: 'efuyegela-events',
        budget: '1k-3k',
        timeline: '1-2 weeks',
        description: 'Need help with product launch event planning and marketing. Want to get our new service to the people effectively.',
        phone: '+1-555-1004',
        website: 'https://eventmgmtpro.com',
        status: 'completed',
        ip_address: '192.168.1.204',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        created_at: new Date(Date.now() - 172800000), // 2 days ago
        updated_at: new Date()
      }
    ]
    
    // Insert users (avoid duplicates)
    for (const user of efuyegelaUsers) {
      const existing = await db.collection('users').findOne({ email: user.email })
      if (!existing) {
        await db.collection('users').insertOne(user)
        console.log(`✅ Added user: ${user.name}`)
      } else {
        console.log(`⚠️ User already exists: ${user.name}`)
      }
    }
    
    // Insert submissions (avoid duplicates)
    for (const submission of efuyegelaSubmissions) {
      const existing = await db.collection('submissions').findOne({ 
        email: submission.email, 
        service: submission.service 
      })
      if (!existing) {
        await db.collection('submissions').insertOne(submission)
        console.log(`✅ Added submission: ${submission.name} - ${submission.service}`)
      } else {
        console.log(`⚠️ Submission already exists: ${submission.name} - ${submission.service}`)
      }
    }
    
    // Show final stats
    console.log('\n📊 Efuyegela Database Stats:')
    const stats = await Promise.all([
      db.collection('admins').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('submissions').countDocuments(),
      db.collection('otps').countDocuments()
    ])
    
    console.log(`👥 Admins: ${stats[0]}`)
    console.log(`👤 Users: ${stats[1]}`)
    console.log(`📝 Submissions: ${stats[2]}`)
    console.log(`📧 OTPs: ${stats[3]}`)
    
    console.log('\n🎉 Efuyegela Database initialized successfully!')
    console.log('\n🌐 Access your application at: http://localhost:3002')
    console.log('🔐 Admin Login: gbonsa2@gmail.com / gemegold*0913')
    console.log('🔐 Admin Login: gemechu@efuyegela.com / admin123!@#')
    console.log('🔐 Admin Login: daniel@efuyegela.com / admin123!@#')
    
  } catch (error) {
    console.error('❌ Error initializing Efuyegela database:', error)
  }
  
  process.exit(0)
}

// Run the initialization
initializeEfuyegelaDB().catch(console.error)
