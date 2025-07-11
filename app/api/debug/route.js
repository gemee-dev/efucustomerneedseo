import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"
import { Advertisement } from "@/lib/models/Advertisement"
import { User } from "@/lib/models/User"

export async function GET(request) {
  try {
    console.log('🔍 Debug endpoint called - checking system status')
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      status: 'healthy'
    }

    // Test User model
    try {
      const testUser = await User.getOrCreate('debug@test.com', 'Debug User')
      debugInfo.userModel = {
        status: 'working',
        testUserId: testUser.id || testUser._id
      }
    } catch (error) {
      debugInfo.userModel = {
        status: 'error',
        error: error.message
      }
    }

    // Test Submission model
    try {
      const submissions = await Submission.getAll(5, 0)
      debugInfo.submissionModel = {
        status: 'working',
        totalSubmissions: submissions.length,
        submissions: submissions.map(s => ({
          id: s.id || s._id,
          name: s.name,
          email: s.email,
          service: s.service,
          hasFiles: s.files ? (JSON.parse(s.files || '[]').length > 0) : false,
          fileCount: s.files ? JSON.parse(s.files || '[]').length : 0
        }))
      }
    } catch (error) {
      debugInfo.submissionModel = {
        status: 'error',
        error: error.message
      }
    }

    // Test Advertisement model
    try {
      const advertisements = await Advertisement.getAll('active', 10)
      debugInfo.advertisementModel = {
        status: 'working',
        totalAds: advertisements.length,
        advertisements: advertisements.map(ad => ({
          id: ad.id || ad._id,
          title: ad.title,
          position: ad.position,
          status: ad.status
        }))
      }
    } catch (error) {
      debugInfo.advertisementModel = {
        status: 'error',
        error: error.message
      }
    }

    // Test file system
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(process.cwd(), 'public/uploads')
      
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir)
        debugInfo.fileSystem = {
          status: 'working',
          uploadsDir: uploadsDir,
          fileCount: files.length,
          files: files.slice(0, 5) // Show first 5 files
        }
      } else {
        debugInfo.fileSystem = {
          status: 'uploads directory not found',
          uploadsDir: uploadsDir
        }
      }
    } catch (error) {
      debugInfo.fileSystem = {
        status: 'error',
        error: error.message
      }
    }

    console.log('✅ Debug check completed:', debugInfo)
    
    return NextResponse.json({
      success: true,
      debug: debugInfo
    })

  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    console.log('🧪 Creating test data for debugging...')
    
    const results = {
      timestamp: new Date().toISOString(),
      operations: []
    }

    // Create test user
    try {
      const testUser = await User.getOrCreate('test-debug@example.com', 'Test Debug User')
      results.operations.push({
        operation: 'create_test_user',
        status: 'success',
        data: { id: testUser.id || testUser._id, email: testUser.email }
      })

      // Create test submission with files
      const testSubmission = await Submission.create({
        user_id: testUser.id || testUser._id,
        email: 'test-debug@example.com',
        name: 'Test Debug User',
        company: 'Debug Company',
        service: 'web-development',
        budget: '3k-5k',
        timeline: '2-3 months',
        description: 'This is a test submission created by the debug endpoint to verify file handling',
        phone: '+1234567890',
        files: JSON.stringify([
          {
            name: 'test-document.pdf',
            url: '/uploads/test-document.pdf',
            size: 1024000,
            type: 'application/pdf',
            uploadedAt: new Date().toISOString()
          },
          {
            name: 'test-image.jpg',
            url: '/uploads/test-image.jpg',
            size: 512000,
            type: 'image/jpeg',
            uploadedAt: new Date().toISOString()
          }
        ]),
        status: 'received',
        submitted_at: new Date().toISOString()
      })

      results.operations.push({
        operation: 'create_test_submission',
        status: 'success',
        data: { 
          id: testSubmission.id || testSubmission._id, 
          email: testSubmission.email,
          fileCount: JSON.parse(testSubmission.files || '[]').length
        }
      })

    } catch (error) {
      results.operations.push({
        operation: 'create_test_data',
        status: 'error',
        error: error.message
      })
    }

    // Create test advertisement
    try {
      const testAd = await Advertisement.create({
        position: 'sidebar',
        title: 'Debug Test Advertisement',
        content: 'This is a test advertisement created by the debug endpoint',
        status: 'active',
        created_by: 1
      })

      results.operations.push({
        operation: 'create_test_advertisement',
        status: 'success',
        data: { 
          id: testAd.id || testAd._id, 
          title: testAd.title,
          position: testAd.position
        }
      })

    } catch (error) {
      results.operations.push({
        operation: 'create_test_advertisement',
        status: 'error',
        error: error.message
      })
    }

    console.log('✅ Test data creation completed:', results)
    
    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      results: results
    })

  } catch (error) {
    console.error('❌ Debug POST error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
