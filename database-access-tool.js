// Database Access Tool - View and Manage All Data
import { connectToMongoDB } from './lib/mongodb.js'
import { Admin } from './lib/models/Admin.js'
import { User } from './lib/models/User.js'
import { Submission } from './lib/models/Submission.js'
import { OTP } from './lib/models/OTP.js'

async function showAllData() {
  console.log('📊 Customer Need SEO - Database Access Tool\n')
  console.log('=' .repeat(60))
  
  try {
    const { db } = await connectToMongoDB()
    
    // Show Admins
    console.log('\n👥 ADMINS:')
    console.log('-'.repeat(40))
    const admins = await db.collection('admins').find({}).toArray()
    if (admins.length > 0) {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email})`)
        console.log(`   Role: ${admin.role}`)
        console.log(`   Created: ${new Date(admin.created_at).toLocaleDateString()}`)
        console.log(`   Last Login: ${admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}`)
        console.log('')
      })
    } else {
      console.log('No admins found')
    }
    
    // Show Users
    console.log('\n👤 USERS:')
    console.log('-'.repeat(40))
    const users = await db.collection('users').find({}).toArray()
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`)
        console.log(`   Company: ${user.company || 'Not specified'}`)
        console.log(`   Phone: ${user.phone || 'Not specified'}`)
        console.log(`   Verified: ${user.verified_at ? 'Yes' : 'No'}`)
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`)
        console.log('')
      })
    } else {
      console.log('No users found')
    }
    
    // Show Submissions
    console.log('\n📝 SUBMISSIONS:')
    console.log('-'.repeat(40))
    const submissions = await db.collection('submissions').find({}).sort({ created_at: -1 }).toArray()
    if (submissions.length > 0) {
      submissions.forEach((submission, index) => {
        console.log(`${index + 1}. ${submission.name} (${submission.email})`)
        console.log(`   Service: ${submission.service}`)
        console.log(`   Budget: ${submission.budget || 'Not specified'}`)
        console.log(`   Timeline: ${submission.timeline || 'Not specified'}`)
        console.log(`   Status: ${submission.status}`)
        console.log(`   Company: ${submission.company || 'Not specified'}`)
        console.log(`   Description: ${submission.description.substring(0, 100)}${submission.description.length > 100 ? '...' : ''}`)
        console.log(`   Created: ${new Date(submission.created_at).toLocaleDateString()}`)
        console.log('')
      })
    } else {
      console.log('No submissions found')
    }
    
    // Show OTPs (active only)
    console.log('\n📧 ACTIVE OTPs:')
    console.log('-'.repeat(40))
    const otps = await db.collection('otps').find({ 
      expires_at: { $gt: new Date() } 
    }).toArray()
    if (otps.length > 0) {
      otps.forEach((otp, index) => {
        console.log(`${index + 1}. ${otp.email}`)
        console.log(`   Code: ${otp.otp_code}`)
        console.log(`   Expires: ${new Date(otp.expires_at).toLocaleString()}`)
        console.log(`   Attempts: ${otp.attempts}`)
        console.log('')
      })
    } else {
      console.log('No active OTPs found')
    }
    
    // Show Statistics
    console.log('\n📈 STATISTICS:')
    console.log('-'.repeat(40))
    console.log(`Total Admins: ${admins.length}`)
    console.log(`Total Users: ${users.length}`)
    console.log(`Total Submissions: ${submissions.length}`)
    console.log(`Active OTPs: ${otps.length}`)
    
    // Show by Status
    const statusCounts = {}
    submissions.forEach(sub => {
      statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1
    })
    console.log('\nSubmissions by Status:')
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`)
    })
    
    // Show by Service
    const serviceCounts = {}
    submissions.forEach(sub => {
      serviceCounts[sub.service] = (serviceCounts[sub.service] || 0) + 1
    })
    console.log('\nSubmissions by Service:')
    Object.entries(serviceCounts).forEach(([service, count]) => {
      console.log(`  ${service}: ${count}`)
    })
    
  } catch (error) {
    console.error('❌ Database access error:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('1. Make sure MongoDB is running: mongod')
    console.log('2. Check connection string in .env.local')
    console.log('3. Verify database permissions')
    console.log('4. Try restarting MongoDB service')
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('🎯 Database Access Complete!')
  
  process.exit(0)
}

// Run the tool
showAllData().catch(error => {
  console.error('❌ Tool failed:', error)
  process.exit(1)
})
