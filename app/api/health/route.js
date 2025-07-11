import { NextResponse } from "next/server"
import { connectToMongoose } from "@/lib/mongodb"
import { Admin } from "@/lib/models/Admin"

export async function GET() {
  try {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      checks: {}
    }

    // Check environment variables
    healthCheck.checks.envVars = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL
    }

    // Check MongoDB connection
    try {
      await connectToMongoose()
      healthCheck.checks.mongodb = {
        status: 'connected',
        message: 'MongoDB connection successful'
      }
    } catch (error) {
      healthCheck.checks.mongodb = {
        status: 'warning',
        message: 'MongoDB not available, using in-memory storage'
      }
    }

    // Check Admin system
    try {
      const testAdmin = await Admin.findByEmail('gbonsa2@gmail.com')
      healthCheck.checks.adminSystem = {
        status: testAdmin ? 'working' : 'not found',
        message: testAdmin ? 'Admin system operational' : 'Admin not found'
      }
    } catch (error) {
      healthCheck.checks.adminSystem = {
        status: 'error',
        message: `Admin system error: ${error.message}`
      }
    }

    // Overall status
    const hasErrors = Object.values(healthCheck.checks).some(check => 
      check.status === 'error' || Object.values(check).includes(false)
    )
    
    healthCheck.status = hasErrors ? 'error' : 'ok'

    return NextResponse.json(healthCheck, { 
      status: hasErrors ? 500 : 200 
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
