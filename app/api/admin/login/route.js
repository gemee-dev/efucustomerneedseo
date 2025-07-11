import { NextResponse } from "next/server"
import { Admin } from "@/lib/models/Admin"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request) {
  try {
    console.log('🔐 Admin login attempt started')

    const { email, password } = await request.json()
    console.log(`📧 Login attempt for email: ${email}`)

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json({
        error: "Email and password are required"
      }, { status: 400 })
    }

    // Authenticate admin
    console.log('🔍 Starting authentication...')
    const admin = await Admin.authenticate(email, password)

    if (!admin) {
      console.log('❌ Authentication failed')
      return NextResponse.json({
        error: "Invalid email or password"
      }, { status: 401 })
    }

    console.log('✅ Authentication successful, updating last login...')

    // Update last login (don't fail if this fails)
    try {
      await Admin.updateLastLogin(admin.id || admin._id)
    } catch (updateError) {
      console.log('⚠️ Failed to update last login:', updateError.message)
    }

    console.log('🔑 Generating JWT token...')

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin.id || admin._id,
        email: admin.email,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie and return token for API access
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id || admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      token: token // Include token for API access
    })

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    console.log(`✅ Admin login successful: ${admin.email}`)

    return response

  } catch (error) {
    console.error("❌ Admin login error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    return NextResponse.json({
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
