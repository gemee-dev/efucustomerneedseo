const { connectToMongoose } = require('../lib/mongodb.js');
const { Admin } = require('../lib/schemas/index.js');
const bcrypt = require('bcryptjs');

async function initializeAdmins() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectToMongoose();
    console.log('✅ Connected to MongoDB');

    // Clear existing admins
    await Admin.deleteMany({});
    console.log('🗑️ Cleared existing admin users');

    // Create admin users
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

    const createdAdmins = await Admin.insertMany(adminUsers);
    console.log('✅ Admin users created:', createdAdmins.length);

    console.log('\n🔐 Admin Credentials:');
    console.log('   - Username: gemechu | Password: daniel');
    console.log('   - Username: gbonsa2@gmail.com | Password: gemegold*0913');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admins:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeAdmins();
}

module.exports = { initializeAdmins };
