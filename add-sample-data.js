// Add Sample Data to MongoDB
import { connectToMongoDB } from './lib/mongodb.js'

async function addSampleData() {
  console.log('📝 Adding Sample Data to MongoDB...\n')
  
  try {
    const { db } = await connectToMongoDB()
    
    // Add sample users
    const sampleUsers = [
      {
        email: 'john.doe@techcorp.com',
        name: 'John Doe',
        company: 'Tech Corporation',
        phone: '+1-555-0123',
        verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'jane.smith@designstudio.com',
        name: 'Jane Smith',
        company: 'Creative Design Studio',
        phone: '+1-555-0456',
        verified_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'mike.johnson@startup.io',
        name: 'Mike Johnson',
        company: 'Startup Innovations',
        phone: '+1-555-0789',
        verified_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]
    
    // Add sample submissions
    const sampleSubmissions = [
      {
        email: 'john.doe@techcorp.com',
        name: 'John Doe',
        company: 'Tech Corporation',
        service: 'seo-technology-consulting',
        budget: '5k-10k',
        timeline: '1-2 months',
        description: 'We need comprehensive SEO technology consulting for our e-commerce platform. Looking to improve organic search rankings and implement advanced SEO tools.',
        phone: '+1-555-0123',
        website: 'https://techcorp.com',
        status: 'received',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'jane.smith@designstudio.com',
        name: 'Jane Smith',
        company: 'Creative Design Studio',
        service: 'digital-marketing-events',
        budget: '3k-5k',
        timeline: '2-3 months',
        description: 'Looking for digital marketing events and SEO workshops for our creative team. Want to enhance our understanding of modern SEO practices.',
        phone: '+1-555-0456',
        website: 'https://designstudio.com',
        status: 'in_progress',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 86400000), // 1 day ago
        updated_at: new Date()
      },
      {
        email: 'mike.johnson@startup.io',
        name: 'Mike Johnson',
        company: 'Startup Innovations',
        service: 'seo-strategy-consulting',
        budget: '1k-3k',
        timeline: '3-6 months',
        description: 'Startup looking for strategic SEO consulting to establish online presence. Need guidance on keyword strategy and content optimization.',
        phone: '+1-555-0789',
        website: 'https://startup.io',
        status: 'completed',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        created_at: new Date(Date.now() - 172800000), // 2 days ago
        updated_at: new Date()
      },
      {
        email: 'sarah.wilson@localshop.com',
        name: 'Sarah Wilson',
        company: 'Local Shop',
        service: 'technical-seo-consulting',
        budget: '500-1k',
        timeline: '1-2 weeks',
        description: 'Small local business needs technical SEO help to improve local search visibility and fix website performance issues.',
        phone: '+1-555-0321',
        website: 'https://localshop.com',
        status: 'received',
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        created_at: new Date(Date.now() - 3600000), // 1 hour ago
        updated_at: new Date()
      }
    ]
    
    // Insert users (avoid duplicates)
    for (const user of sampleUsers) {
      const existing = await db.collection('users').findOne({ email: user.email })
      if (!existing) {
        await db.collection('users').insertOne(user)
        console.log(`✅ Added user: ${user.name}`)
      } else {
        console.log(`⚠️ User already exists: ${user.name}`)
      }
    }
    
    // Insert submissions (avoid duplicates)
    for (const submission of sampleSubmissions) {
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
    console.log('\n📊 Final Database Stats:')
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
    
    console.log('\n🎉 Sample data added successfully!')
    console.log('\n🌐 Access your admin dashboard at: http://localhost:3002/admin')
    console.log('🔐 Login with: gbonsa2@gmail.com / gemegold*0913')
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  }
  
  process.exit(0)
}

// Run the script
addSampleData().catch(console.error)
