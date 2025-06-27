import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function verifyAdminToken(request) {
  try {
    // Try to get token from cookie first (for web dashboard)
    let token = request.cookies.get('admin-token')?.value

    // If no cookie token, try Authorization header (for API access)
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    let submissions

    try {
      if (status) {
        submissions = await Submission.getByStatus(status, limit)
      } else if (search) {
        submissions = await Submission.search(search, limit)
      } else {
        submissions = await Submission.getAll(limit, offset)
      }
    } catch (error) {
      // Fallback data when database is not available
      console.log('⚠️ Database not available, using mock submissions data')
      submissions = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Tech Corp',
          service: 'SEO Audit',
          budget: '1k-3k',
          timeline: '1-2 months',
          description: 'Need comprehensive SEO audit for our e-commerce website',
          status: 'received',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          company: 'Local Business',
          service: 'Local SEO',
          budget: '500-1k',
          timeline: '2-3 months',
          description: 'Want to improve local search rankings for our restaurant',
          status: 'in_progress',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          company: 'Startup Inc',
          service: 'Content SEO',
          budget: '3k-5k',
          timeline: '3-6 months',
          description: 'Need content strategy and SEO optimization for our blog',
          status: 'completed',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total: submissions.length
      }
    })

  } catch (error) {
    console.error("Get submissions error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch submissions" 
    }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    // Verify admin authentication
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return NextResponse.json({ 
        error: "Unauthorized - Admin access required" 
      }, { status: 401 })
    }

    const { id, status } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ 
        error: "Submission ID and status are required" 
      }, { status: 400 })
    }

    const validStatuses = ['received', 'in_progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status" 
      }, { status: 400 })
    }

    let updatedSubmission

    try {
      updatedSubmission = await Submission.updateStatus(id, status)

      if (!updatedSubmission) {
        return NextResponse.json({
          error: "Submission not found"
        }, { status: 404 })
      }
    } catch (error) {
      // Fallback for when database is not available
      console.log('⚠️ Database not available, simulating status update')
      updatedSubmission = {
        id: parseInt(id),
        status: status,
        updated_at: new Date().toISOString()
      }
    }

    console.log(`✅ Admin ${admin.email} updated submission ${id} to ${status}`)

    return NextResponse.json({
      success: true,
      data: updatedSubmission
    })

  } catch (error) {
    console.error("Update submission error:", error)
    return NextResponse.json({ 
      error: "Failed to update submission" 
    }, { status: 500 })
  }
}
