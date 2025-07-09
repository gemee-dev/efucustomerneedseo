import { NextResponse } from "next/server"
import { connectToMongoose } from "@/lib/mongodb"
import { Admin } from "@/lib/schemas/index"
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    // Security check - only allow this in development or with special key
    const { initKey } = await request.json()
    
    if (initKey !== 'efu-init-admins-2024-secure') {
      return NextResponse.json({ 
        error: "Unauthorized - Invalid initialization key" 
      }, { status: 401 })
    }

    await connectToMongoose()
    console.log('✅ Connected to MongoDB for admin initialization')

    // Clear existing admins (optional - remove this line if you want to keep existing)
    await Admin.deleteMany({})
    console.log('🗑️ Cleared existing admin users')

    // Create admin users with hashed passwords
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
    ]

    const createdAdmins = await Admin.insertMany(adminUsers)
    console.log('✅ Admin users created:', createdAdmins.length)

    return NextResponse.json({
      success: true,
      message: "Admin users initialized successfully",
      data: {
        adminsCreated: createdAdmins.length,
        credentials: [
          { email: 'gemechu', password: 'daniel', role: 'super_admin' },
          { email: 'gbonsa2@gmail.com', password: 'gemegold*0913', role: 'admin' }
        ]
      }
    })

  } catch (error) {
    console.error('❌ Admin initialization failed:', error)
    return NextResponse.json({ 
      error: "Failed to initialize admin users",
      details: error.message 
    }, { status: 500 })
  }
}

// GET method to check if admins exist
export async function GET() {
  try {
    await connectToMongoose()
    
    const adminCount = await Admin.countDocuments()
    const admins = await Admin.find({}, { password: 0 }).lean() // Exclude passwords
    
    return NextResponse.json({
      success: true,
      data: {
        totalAdmins: adminCount,
        admins: admins.map(admin => ({
          email: admin.email,
          name: admin.name,
          role: admin.role,
          created_at: admin.created_at
        }))
      }
    })

  } catch (error) {
    console.error('❌ Failed to check admin users:', error)
    return NextResponse.json({ 
      error: "Failed to check admin users",
      details: error.message 
    }, { status: 500 })
  }
}
