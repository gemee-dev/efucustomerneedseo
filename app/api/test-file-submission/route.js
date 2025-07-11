import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"
import { User } from "@/lib/models/User"

export async function POST(request) {
  try {
    console.log('🧪 Creating test submission with files...')
    
    // Create or get test user
    const testUser = await User.getOrCreate('test-files@example.com', 'Test File User')
    console.log('✅ Test user created/found:', testUser.email)

    // Create test submission with files
    const testFiles = [
      {
        name: 'project-requirements.pdf',
        url: '/uploads/test-project-requirements.pdf',
        size: 1024000,
        type: 'application/pdf',
        uploadedAt: new Date().toISOString()
      },
      {
        name: 'design-mockup.jpg',
        url: '/uploads/test-design-mockup.jpg',
        size: 512000,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      },
      {
        name: 'technical-specs.docx',
        url: '/uploads/test-technical-specs.docx',
        size: 256000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: new Date().toISOString()
      }
    ]

    const submissionData = {
      user_id: testUser.id || testUser._id,
      email: 'test-files@example.com',
      name: 'Test File User',
      company: 'File Test Company',
      service: 'web-development',
      budget: '5k-10k',
      timeline: '3-4 months',
      description: 'This is a test submission with multiple files to verify file visibility in admin dashboard. Please check if all files are visible and downloadable.',
      phone: '+1234567890',
      website: 'https://test-files.example.com',
      files: JSON.stringify(testFiles), // Properly stringify the files
      frontendFramework: 'React',
      backendLanguage: 'Node.js',
      database: 'MongoDB',
      ip_address: '127.0.0.1',
      user_agent: 'Test Agent',
      submitted_at: new Date().toISOString(),
      status: 'received'
    }

    console.log('💾 Saving test submission with files:', {
      email: submissionData.email,
      fileCount: testFiles.length,
      files: testFiles.map(f => f.name)
    })

    const submission = await Submission.create(submissionData)
    
    console.log('✅ Test submission created successfully:', {
      id: submission.id || submission._id,
      email: submission.email,
      service: submission.service,
      filesStored: submission.files ? JSON.parse(submission.files).length : 0
    })

    // Verify the submission can be retrieved
    const allSubmissions = await Submission.getAll(10, 0)
    const ourSubmission = allSubmissions.find(s => s.email === 'test-files@example.com')
    
    let verificationResult = null
    if (ourSubmission) {
      try {
        const parsedFiles = JSON.parse(ourSubmission.files || '[]')
        verificationResult = {
          found: true,
          id: ourSubmission.id || ourSubmission._id,
          email: ourSubmission.email,
          fileCount: parsedFiles.length,
          files: parsedFiles.map(f => ({ name: f.name, url: f.url, size: f.size }))
        }
        console.log('✅ Verification successful - submission found with files:', verificationResult)
      } catch (e) {
        verificationResult = {
          found: true,
          id: ourSubmission.id || ourSubmission._id,
          email: ourSubmission.email,
          fileParseError: e.message
        }
        console.log('⚠️ Verification warning - submission found but files could not be parsed:', verificationResult)
      }
    } else {
      verificationResult = {
        found: false,
        totalSubmissions: allSubmissions.length
      }
      console.log('❌ Verification failed - submission not found in list')
    }

    return NextResponse.json({
      success: true,
      message: 'Test submission with files created successfully',
      data: {
        submission: {
          id: submission.id || submission._id,
          email: submission.email,
          name: submission.name,
          service: submission.service,
          fileCount: testFiles.length
        },
        files: testFiles,
        verification: verificationResult
      }
    })

  } catch (error) {
    console.error('❌ Test file submission failed:', error)
    return NextResponse.json({
      error: 'Failed to create test submission with files',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    console.log('📊 Checking all submissions for file data...')
    
    const submissions = await Submission.getAll(50, 0)
    
    const submissionAnalysis = submissions.map(submission => {
      let fileInfo = { count: 0, files: [], parseError: null }
      
      try {
        if (submission.files) {
          const parsedFiles = JSON.parse(submission.files)
          fileInfo = {
            count: parsedFiles.length,
            files: parsedFiles.map(f => ({
              name: f.name || 'Unknown',
              url: f.url || 'No URL',
              size: f.size || 0
            })),
            parseError: null
          }
        }
      } catch (e) {
        fileInfo.parseError = e.message
      }
      
      return {
        id: submission.id || submission._id,
        email: submission.email,
        name: submission.name,
        service: submission.service,
        submittedAt: submission.submitted_at || submission.created_at,
        fileInfo: fileInfo
      }
    })

    const withFiles = submissionAnalysis.filter(s => s.fileInfo.count > 0)
    const withoutFiles = submissionAnalysis.filter(s => s.fileInfo.count === 0)
    const withErrors = submissionAnalysis.filter(s => s.fileInfo.parseError)

    console.log(`📊 Analysis complete: ${submissions.length} total, ${withFiles.length} with files, ${withoutFiles.length} without files, ${withErrors.length} with errors`)

    return NextResponse.json({
      success: true,
      analysis: {
        totalSubmissions: submissions.length,
        withFiles: withFiles.length,
        withoutFiles: withoutFiles.length,
        withParseErrors: withErrors.length
      },
      submissions: submissionAnalysis
    })

  } catch (error) {
    console.error('❌ Failed to analyze submissions:', error)
    return NextResponse.json({
      error: 'Failed to analyze submissions',
      details: error.message
    }, { status: 500 })
  }
}
