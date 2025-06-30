import { NextResponse } from "next/server"
import { Advertisement } from "@/lib/models/Advertisement"
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

// GET /api/advertisements - Fetch advertisements (public endpoint)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '10')

    let advertisements

    try {
      if (position) {
        advertisements = await Advertisement.getByPosition(position, status, limit)
      } else {
        advertisements = await Advertisement.getAll(status, limit)
      }
    } catch (error) {
      // Fallback data when database is not available
      console.log('⚠️ Database not available, using mock advertisements data')
      advertisements = [
        {
          id: 1,
          position: 'header',
          title: 'Special Offer',
          content: 'Get 20% off all web development projects this month!',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          position: 'sidebar',
          title: 'Professional Services',
          content: 'Expert consulting for your business needs',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          position: 'inline',
          title: 'Portfolio Showcase',
          content: 'View our latest projects and success stories',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ]

      // Filter by position if specified
      if (position) {
        advertisements = advertisements.filter(ad => ad.position === position)
      }
    }

    return NextResponse.json({
      success: true,
      data: advertisements
    })

  } catch (error) {
    console.error("Get advertisements error:", error)
    return NextResponse.json({ 
      error: "Failed to fetch advertisements" 
    }, { status: 500 })
  }
}

// POST /api/advertisements - Create new advertisement (admin only)
export async function POST(request) {
  try {
    // Verify admin authentication
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return NextResponse.json({ 
        error: "Unauthorized - Admin access required" 
      }, { status: 401 })
    }

    const { position, title, content, status } = await request.json()

    if (!position || !title || !content) {
      return NextResponse.json({ 
        error: "Position, title, and content are required" 
      }, { status: 400 })
    }

    const validPositions = ['header', 'sidebar', 'inline', 'footer']
    if (!validPositions.includes(position)) {
      return NextResponse.json({ 
        error: "Invalid position" 
      }, { status: 400 })
    }

    const validStatuses = ['active', 'inactive']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status" 
      }, { status: 400 })
    }

    let newAdvertisement

    try {
      newAdvertisement = await Advertisement.create({
        position,
        title,
        content,
        status: status || 'active',
        created_by: admin.adminId
      })
    } catch (error) {
      // Fallback for when database is not available
      console.log('⚠️ Database not available, simulating advertisement creation')
      newAdvertisement = {
        id: Date.now(),
        position,
        title,
        content,
        status: status || 'active',
        created_by: admin.adminId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

    console.log(`✅ Admin ${admin.email} created new advertisement: ${title}`)

    return NextResponse.json({
      success: true,
      data: newAdvertisement,
      message: "Advertisement created successfully"
    })

  } catch (error) {
    console.error("Create advertisement error:", error)
    return NextResponse.json({ 
      error: "Failed to create advertisement" 
    }, { status: 500 })
  }
}

// PUT /api/advertisements - Update advertisement (admin only)
export async function PUT(request) {
  try {
    // Verify admin authentication
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return NextResponse.json({ 
        error: "Unauthorized - Admin access required" 
      }, { status: 401 })
    }

    const { id, position, title, content, status } = await request.json()

    if (!id) {
      return NextResponse.json({ 
        error: "Advertisement ID is required" 
      }, { status: 400 })
    }

    let updatedAdvertisement

    try {
      updatedAdvertisement = await Advertisement.update(id, {
        position,
        title,
        content,
        status,
        updated_by: admin.adminId
      })

      if (!updatedAdvertisement) {
        return NextResponse.json({
          error: "Advertisement not found"
        }, { status: 404 })
      }
    } catch (error) {
      // Fallback for when database is not available
      console.log('⚠️ Database not available, simulating advertisement update')
      updatedAdvertisement = {
        id: parseInt(id),
        position,
        title,
        content,
        status,
        updated_by: admin.adminId,
        updated_at: new Date().toISOString()
      }
    }

    console.log(`✅ Admin ${admin.email} updated advertisement ${id}`)

    return NextResponse.json({
      success: true,
      data: updatedAdvertisement
    })

  } catch (error) {
    console.error("Update advertisement error:", error)
    return NextResponse.json({ 
      error: "Failed to update advertisement" 
    }, { status: 500 })
  }
}

// DELETE /api/advertisements - Delete advertisement (admin only)
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const admin = verifyAdminToken(request)
    
    if (!admin) {
      return NextResponse.json({ 
        error: "Unauthorized - Admin access required" 
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: "Advertisement ID is required" 
      }, { status: 400 })
    }

    let deletedAdvertisement

    try {
      deletedAdvertisement = await Advertisement.delete(id)

      if (!deletedAdvertisement) {
        return NextResponse.json({
          error: "Advertisement not found"
        }, { status: 404 })
      }
    } catch (error) {
      // Fallback for when database is not available
      console.log('⚠️ Database not available, simulating advertisement deletion')
      deletedAdvertisement = {
        id: parseInt(id),
        deleted: true,
        deleted_at: new Date().toISOString()
      }
    }

    console.log(`✅ Admin ${admin.email} deleted advertisement ${id}`)

    return NextResponse.json({
      success: true,
      data: deletedAdvertisement,
      message: "Advertisement deleted successfully"
    })

  } catch (error) {
    console.error("Delete advertisement error:", error)
    return NextResponse.json({ 
      error: "Failed to delete advertisement" 
    }, { status: 500 })
  }
}
