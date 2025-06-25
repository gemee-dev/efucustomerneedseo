import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"
import { User } from "@/lib/models/User"
import { Admin } from "@/lib/models/Admin"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyAdminToken(request) {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request) {
  try {
    // Verify admin authentication
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return NextResponse.json({ 
        error: "Unauthorized - Admin access required" 
      }, { status: 401 })
    }

    // Get dashboard statistics
    const [
      submissionStats,
      userStats,
      recentSubmissions,
      recentUsers
    ] = await Promise.all([
      Submission.getStats(),
      User.getStats(),
      Submission.getAll(10, 0),
      User.getStats()
    ])

    // Get admin info
    const adminInfo = await Admin.findById(admin.adminId)

    const dashboardData = {
      admin: adminInfo,
      stats: {
        submissions: submissionStats,
        users: userStats,
        totalRevenue: submissionStats.total * 1500, // Estimated revenue
        conversionRate: userStats.total > 0 ? ((submissionStats.total / userStats.total) * 100).toFixed(1) : 0
      },
      recentSubmissions: recentSubmissions.slice(0, 10),
      recentActivity: [
        ...recentSubmissions.slice(0, 5).map(sub => ({
          type: 'submission',
          message: `New submission from ${sub.name}`,
          time: sub.created_at,
          data: sub
        }))
      ]
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error("Dashboard data error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch dashboard data" 
    }, { status: 500 })
  }
}
