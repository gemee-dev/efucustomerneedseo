import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    console.log('🧪 Simple test API called')
    
    return NextResponse.json({
      success: true,
      message: 'Simple test API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })

  } catch (error) {
    console.error('❌ Simple test API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log('🧪 Creating simple test submission...')
    
    // Import models dynamically to avoid deployment issues
    const { Submission } = await import("@/lib/models/Submission")
    const { User } = await import("@/lib/models/User")
    
    // Create test user
    const testUser = await User.getOrCreate('simple-test@example.com', 'Simple Test User')
    
    // Create simple test submission with files
    const testSubmission = await Submission.create({
      user_id: testUser.id || testUser._id,
      email: 'simple-test@example.com',
      name: 'Simple Test User',
      company: 'Test Company',
      service: 'web-development',
      budget: '1k-3k',
      timeline: '1-2 months',
      description: 'Simple test submission to verify the system works',
      phone: '+1234567890',
      files: JSON.stringify([
        {
          name: 'test-file.pdf',
          url: '/uploads/test-file.pdf',
          size: 1024000,
          type: 'application/pdf',
          uploadedAt: new Date().toISOString()
        }
      ]),
      status: 'received',
      submitted_at: new Date().toISOString()
    })

    console.log('✅ Simple test submission created:', {
      id: testSubmission.id || testSubmission._id,
      email: testSubmission.email
    })

    return NextResponse.json({
      success: true,
      message: 'Simple test submission created successfully',
      data: {
        id: testSubmission.id || testSubmission._id,
        email: testSubmission.email,
        name: testSubmission.name,
        service: testSubmission.service,
        hasFiles: testSubmission.files ? JSON.parse(testSubmission.files).length > 0 : false
      }
    })

  } catch (error) {
    console.error('❌ Simple test submission failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
