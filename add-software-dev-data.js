// Add Software Development Sample Data
import { connectToMongoDB } from './lib/mongodb.js'

async function addSoftwareDevData() {
  console.log('💻 Adding Software Development Sample Data...\n')
  
  try {
    const { db } = await connectToMongoDB()
    
    // Add software development users
    const softwareUsers = [
      {
        email: 'startup.founder@techventure.com',
        name: 'Sarah Tech',
        company: 'TechVenture Startup',
        phone: '+1-555-2001',
        verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'creative.director@designstudio.com',
        name: 'Marcus Creative',
        company: 'Design Studio Pro',
        phone: '+1-555-2002',
        verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'business.owner@retailcorp.com',
        name: 'Lisa Business',
        company: 'Retail Corporation',
        phone: '+1-555-2003',
        verified_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    // Add software development submissions
    const softwareSubmissions = [
      {
        email: 'startup.founder@techventure.com',
        name: 'Sarah Tech',
        company: 'TechVenture Startup',
        service: 'software-development',
        budget: '10k+',
        timeline: '3-6 months',
        description: 'Need a comprehensive software solution for our startup. Looking for a full-stack application with user management, payment processing, and analytics dashboard. Tech stack preference: React, Node.js, MongoDB.',
        phone: '+1-555-2001',
        website: 'https://techventure.com',
        status: 'received',
        ip_address: '192.168.1.301',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'creative.director@designstudio.com',
        name: 'Marcus Creative',
        company: 'Design Studio Pro',
        service: 'web-development',
        budget: '5k-10k',
        timeline: '1-2 months',
        description: 'Need a modern portfolio website for our design studio. Should showcase our work beautifully with smooth animations and responsive design. Prefer Next.js with modern CSS frameworks.',
        phone: '+1-555-2002',
        website: 'https://designstudiopro.com',
        status: 'in_progress',
        ip_address: '192.168.1.302',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 86400000), // 1 day ago
        updated_at: new Date()
      },
      {
        email: 'business.owner@retailcorp.com',
        name: 'Lisa Business',
        company: 'Retail Corporation',
        service: 'mobile-development',
        budget: '3k-5k',
        timeline: '2-3 months',
        description: 'Looking for a mobile app for our retail business. Need iOS and Android apps with inventory management, customer loyalty program, and payment integration. React Native preferred.',
        phone: '+1-555-2003',
        website: 'https://retailcorp.com',
        status: 'received',
        ip_address: '192.168.1.303',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        created_at: new Date(Date.now() - 3600000), // 1 hour ago
        updated_at: new Date()
      },
      {
        email: 'enterprise.manager@bigcorp.com',
        name: 'Robert Enterprise',
        company: 'Big Corporation',
        service: 'enterprise-software',
        budget: '10k+',
        timeline: '6+ months',
        description: 'Need enterprise-level software for managing our business operations. Requirements include CRM, inventory management, reporting, and integration with existing systems. Looking for scalable solution.',
        phone: '+1-555-2004',
        website: 'https://bigcorp.com',
        status: 'completed',
        ip_address: '192.168.1.304',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 172800000), // 2 days ago
        updated_at: new Date()
      },
      {
        email: 'artist.creative@artcollective.com',
        name: 'Emma Artist',
        company: 'Art Collective',
        service: 'creative-software',
        budget: '1k-3k',
        timeline: '1-2 months',
        description: 'Looking for custom software tools for digital art creation and portfolio management. Need features for artwork cataloging, client management, and online gallery integration.',
        phone: '+1-555-2005',
        website: 'https://artcollective.com',
        status: 'in_progress',
        ip_address: '192.168.1.305',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 7200000), // 2 hours ago
        updated_at: new Date()
      }
    ]
    
    // Insert users (avoid duplicates)
    for (const user of softwareUsers) {
      const existing = await db.collection('users').findOne({ email: user.email })
      if (!existing) {
        await db.collection('users').insertOne(user)
        console.log(`✅ Added software user: ${user.name}`)
      } else {
        console.log(`⚠️ User already exists: ${user.name}`)
      }
    }
    
    // Insert submissions (avoid duplicates)
    for (const submission of softwareSubmissions) {
      const existing = await db.collection('submissions').findOne({ 
        email: submission.email, 
        service: submission.service 
      })
      if (!existing) {
        await db.collection('submissions').insertOne(submission)
        console.log(`✅ Added software submission: ${submission.name} - ${submission.service}`)
      } else {
        console.log(`⚠️ Submission already exists: ${submission.name} - ${submission.service}`)
      }
    }
    
    // Show final stats
    console.log('\n📊 Updated Database Stats:')
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
    
    // Show software development submissions
    console.log('\n💻 Software Development Submissions:')
    const softwareSubmissionsCount = await db.collection('submissions').find({
      service: { $in: ['software-development', 'web-development', 'mobile-development', 'enterprise-software', 'creative-software'] }
    }).toArray()
    
    softwareSubmissionsCount.forEach((sub, index) => {
      console.log(`${index + 1}. ${sub.name} - ${sub.service} (${sub.status})`)
    })
    
    console.log('\n🎉 Software Development data added successfully!')
    console.log('\n🌐 Access your application at: http://localhost:3002')
    console.log('🔐 Admin Dashboard: http://localhost:3002/admin')
    
  } catch (error) {
    console.error('❌ Error adding software development data:', error)
  }
  
  process.exit(0)
}

// Run the script
addSoftwareDevData().catch(console.error)
