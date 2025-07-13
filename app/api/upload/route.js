import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    return NextResponse.json({
      status: 'healthy',
      message: 'Upload API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      vercel: process.env.VERCEL ? 'true' : 'false'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Basic validation first
    if (!request) {
      return NextResponse.json({ error: "No request received" }, { status: 400 })
    }

    // Try to get form data
    let data
    try {
      data = await request.formData()
    } catch (formError) {
      return NextResponse.json({
        error: "Failed to parse form data",
        details: formError.message
      }, { status: 400 })
    }

    const file = data.get("file")

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Basic file validation
    if (!file.name || !file.size || !file.type) {
      return NextResponse.json({ error: "Invalid file data" }, { status: 400 })
    }

    // Validate file size (5MB max for serverless)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Max 5MB allowed.`
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/zip"
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: `File type '${file.type}' not allowed. Allowed types: PDF, Images, DOC, TXT, ZIP`
      }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}_${randomId}_${safeName}`

    // For serverless, we'll just return metadata without actually storing the file
    // In production, you'd upload to cloud storage here
    const fileMetadata = {
      success: true,
      url: `/uploads/${filename}`, // Simulated URL
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      message: "File processed successfully"
    }

    return NextResponse.json(fileMetadata)

  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    }

    console.error("Upload API Error:", errorDetails)

    return NextResponse.json({
      error: "Internal server error",
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
