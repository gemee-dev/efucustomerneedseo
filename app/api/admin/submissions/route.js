import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    let submissions
    
    if (status) {
      submissions = await Submission.getByStatus(status, limit)
    } else if (search) {
      submissions = await Submission.search(search, limit)
    } else {
      submissions = await Submission.getAll(limit, offset)
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

    const updatedSubmission = await Submission.updateStatus(id, status)

    if (!updatedSubmission) {
      return NextResponse.json({ 
        error: "Submission not found" 
      }, { status: 404 })
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
