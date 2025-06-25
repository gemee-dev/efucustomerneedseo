import { NextResponse } from "next/server"
import { Admin } from "@/lib/models/Admin"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ 
        error: "Email and password are required" 
      }, { status: 400 })
    }

    // Authenticate admin
    const admin = await Admin.authenticate(email, password)
    
    if (!admin) {
      return NextResponse.json({ 
        error: "Invalid email or password" 
      }, { status: 401 })
    }

    // Update last login
    await Admin.updateLastLogin(admin.id)

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id, 
        email: admin.email, 
        role: admin.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
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
    console.error("Admin login error:", error)
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 })
  }
}
