const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://gemegold:gemegold@cluster0.eashhao.mongodb.net/efuyegela?retryWrites=true&w=majority&appName=Cluster0';

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('efuyegela');
    
    // 1. Initialize Admin Users
    console.log('📝 Creating admin users...');
    const adminsCollection = db.collection('admins');
    
    // Clear existing admins
    await adminsCollection.deleteMany({});
    
    const adminUsers = [
      {
        email: 'gemechu',
        password: await bcrypt.hash('daniel', 12),
        name: 'Gemechu Admin',
        role: 'super_admin',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'gbonsa2@gmail.com',
        password: await bcrypt.hash('gemegold*0913', 12),
        name: 'Gbonsa Admin',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await adminsCollection.insertMany(adminUsers);
    console.log('✅ Admin users created');
    
    // 2. Initialize Sample Advertisements
    console.log('📝 Creating sample advertisements...');
    const advertisementsCollection = db.collection('advertisements');
    
    // Clear existing advertisements
    await advertisementsCollection.deleteMany({});
    
    const sampleAds = [
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
      },
      {
        position: 'inline',
        title: 'Enterprise Solutions',
        content: 'Scalable enterprise software solutions with advanced security, performance optimization, and 24/7 support.',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await advertisementsCollection.insertMany(sampleAds);
    console.log('✅ Sample advertisements created');
    
    // 3. Initialize Sample Submissions (for demo)
    console.log('📝 Creating sample submissions...');
    const submissionsCollection = db.collection('submissions');
    
    const sampleSubmissions = [
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
      },
      {
        name: 'Michael Brown',
        email: 'mike.brown@enterprise.com',
        company: 'Enterprise Corp',
        service: 'Enterprise Software',
        budget: '25k+',
        timeline: '6+ months',
        description: 'Custom ERP system for manufacturing company',
        company_size: '500+ employees',
        current_systems: ['Legacy ERP', 'Custom Database'],
        security_requirements: 'High (Financial/Healthcare)',
        scalability_needs: 'High traffic expected',
        status: 'completed',
        created_at: new Date(Date.now() - 604800000), // 1 week ago
        updated_at: new Date(Date.now() - 259200000)  // 3 days ago
      }
    ];
    
    await submissionsCollection.insertMany(sampleSubmissions);
    console.log('✅ Sample submissions created');
    
    // 4. Create indexes for better performance
    console.log('📝 Creating database indexes...');
    
    await adminsCollection.createIndex({ email: 1 }, { unique: true });
    await submissionsCollection.createIndex({ email: 1 });
    await submissionsCollection.createIndex({ status: 1 });
    await submissionsCollection.createIndex({ service: 1 });
    await submissionsCollection.createIndex({ created_at: -1 });
    await advertisementsCollection.createIndex({ position: 1 });
    await advertisementsCollection.createIndex({ status: 1 });
    
    console.log('✅ Database indexes created');
    
    // 5. Display summary
    const adminCount = await adminsCollection.countDocuments();
    const adCount = await advertisementsCollection.countDocuments();
    const submissionCount = await submissionsCollection.countDocuments();
    
    console.log('\n🎉 Database initialization complete!');
    console.log(`📊 Summary:`);
    console.log(`   - Admin users: ${adminCount}`);
    console.log(`   - Advertisements: ${adCount}`);
    console.log(`   - Sample submissions: ${submissionCount}`);
    console.log('\n🔐 Admin Credentials:');
    console.log('   - Username: gemechu | Password: daniel');
    console.log('   - Username: gbonsa2@gmail.com | Password: gemegold*0913');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
