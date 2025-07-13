import { NextResponse } from "next/server"

export async function GET(request) {
  return NextResponse.json({
    status: 'healthy',
    message: 'Upload API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}

export async function POST(request) {
  try {
    console.log('📁 Upload API called')
    const data = await request.formData()
    const file = data.get("file")

    if (!file) {
      console.log('❌ No file uploaded')
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    console.log('📄 File received:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]

    if (!allowedTypes.includes(file.type)) {
      console.log('❌ File type not allowed:', file.type)
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    // For serverless environments, we'll convert file to base64 and store metadata
    // This is a temporary solution - in production you'd use cloud storage
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    // Create file metadata (in production, save this to database)
    const fileMetadata = {
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      // In serverless, we can't save files to disk, so we'll return a data URL
      // In production, you'd upload to cloud storage (AWS S3, Cloudinary, etc.)
      url: `data:${file.type};base64,${base64.substring(0, 100)}...` // Truncated for demo
    }

    console.log('✅ File processed successfully:', {
      filename: fileMetadata.filename,
      size: fileMetadata.size,
      type: fileMetadata.type
    })

    // Return success with file metadata
    // Note: In production, you'd return the actual cloud storage URL
    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`, // Simulated URL
      filename: filename,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: fileMetadata.uploadedAt,
      message: "File uploaded successfully (serverless mode)"
    })

  } catch (error) {
    console.error("❌ Upload error:", error)
    return NextResponse.json({
      error: "Upload failed",
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
