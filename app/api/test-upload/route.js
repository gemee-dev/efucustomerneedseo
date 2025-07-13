import { NextResponse } from "next/server"

export async function GET(request) {
  return NextResponse.json({
    status: 'working',
    message: 'Test upload API is functional',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
      region: process.env.VERCEL_REGION || 'unknown'
    }
  })
}

export async function POST(request) {
  try {
    // Simple test without file processing
    const body = await request.json().catch(() => ({}))
    
    return NextResponse.json({
      success: true,
      message: 'Test upload endpoint working',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
