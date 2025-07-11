import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"

export async function POST(request) {
  try {
    console.log('🧪 Creating test submission...')
    
    const testSubmission = {
      user_id: 1,
      email: 'test@example.com',
      name: 'Test User',
      company: 'Test Company',
      service: 'web-development',
      budget: '1k-3k',
      timeline: '1-2 months',
      description: 'This is a test submission to verify the system is working',
      phone: '+1234567890',
      files: JSON.stringify([]),
      ip_address: '127.0.0.1',
      user_agent: 'Test Agent',
      submitted_at: new Date().toISOString()
    }

    const submission = await Submission.create(testSubmission)
    
    console.log('✅ Test submission created:', {
      id: submission.id || submission._id,
      email: submission.email,
      service: submission.service
    })

    return NextResponse.json({
      success: true,
      message: 'Test submission created successfully',
      data: submission
    })

  } catch (error) {
    console.error('❌ Test submission failed:', error)
    return NextResponse.json({
      error: 'Failed to create test submission',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    console.log('📊 Getting all submissions for testing...')
    
    const submissions = await Submission.getAll(50, 0)
    
    console.log(`✅ Found ${submissions.length} submissions`)
    
    return NextResponse.json({
      success: true,
      count: submissions.length,
      data: submissions
    })

  } catch (error) {
    console.error('❌ Failed to get submissions:', error)
    return NextResponse.json({
      error: 'Failed to get submissions',
      details: error.message
    }, { status: 500 })
  }
}
