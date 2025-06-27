// Comprehensive Form Submission Debug Test
async function testFormSubmissionDebug() {
  console.log('🔍 Debugging Form Submission Issues...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Test 1: Check if server is responding
  console.log('1. Testing Server Response')
  try {
    const response = await fetch(baseURL)
    console.log(`✅ Server Status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      console.log('❌ Server not responding properly')
      return
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message)
    return
  }
  
  // Test 2: Test API endpoint directly
  console.log('\n2. Testing /api/submit-form Endpoint')
  try {
    const testFormData = {
      email: 'debug.test@efuyegela.com',
      name: 'Debug Test User',
      company: 'Debug Test Company',
      service: 'software-development',
      budget: '3k-5k',
      timeline: '1-2 months',
      description: 'This is a debug test submission to identify form submission issues.',
      phone: '123-456-7890',
      website: 'https://debugtest.com'
    }
    
    console.log('📝 Submitting test data:', JSON.stringify(testFormData, null, 2))
    
    const submitResponse = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData)
    })
    
    console.log(`📊 Response Status: ${submitResponse.status} ${submitResponse.statusText}`)
    console.log(`📊 Response Headers:`, Object.fromEntries(submitResponse.headers.entries()))
    
    const responseText = await submitResponse.text()
    console.log(`📊 Raw Response:`, responseText)
    
    try {
      const responseData = JSON.parse(responseText)
      console.log(`📊 Parsed Response:`, responseData)
      
      if (responseData.success) {
        console.log('✅ Form submission successful!')
      } else {
        console.log('❌ Form submission failed:', responseData.error)
      }
    } catch (parseError) {
      console.log('❌ Failed to parse response as JSON:', parseError.message)
    }
    
  } catch (error) {
    console.log('❌ Form submission request failed:', error.message)
  }
  
  // Test 3: Test different service types
  console.log('\n3. Testing Different Service Types')
  const serviceTypes = [
    'efuyegela-publishers',
    'efuyegela-consultants',
    'software-development',
    'web-development',
    'mobile-development'
  ]
  
  for (const service of serviceTypes) {
    try {
      const serviceTestData = {
        email: `test.${service}@efuyegela.com`,
        name: `Test User ${service}`,
        company: 'Test Company',
        service: service,
        budget: '1k-3k',
        timeline: '1-2 months',
        description: `Testing ${service} service submission`,
        phone: '123-456-7890'
      }
      
      const serviceResponse = await fetch(`${baseURL}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceTestData)
      })
      
      const serviceData = await serviceResponse.json()
      
      if (serviceData.success) {
        console.log(`✅ ${service}: Success`)
      } else {
        console.log(`❌ ${service}: Failed - ${serviceData.error}`)
      }
    } catch (error) {
      console.log(`❌ ${service}: Error - ${error.message}`)
    }
  }
  
  // Test 4: Test OTP system
  console.log('\n4. Testing OTP System')
  try {
    const otpResponse = await fetch(`${baseURL}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'debug.otp@efuyegela.com'
      })
    })
    
    const otpData = await otpResponse.json()
    console.log(`📧 OTP Response:`, otpData)
    
    if (otpData.success) {
      console.log('✅ OTP system working')
    } else {
      console.log('❌ OTP system failed:', otpData.error)
    }
  } catch (error) {
    console.log('❌ OTP test error:', error.message)
  }
  
  // Test 5: Test database connection
  console.log('\n5. Testing Database Connection')
  try {
    // Test admin login to verify database connectivity
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gbonsa2@gmail.com',
        password: 'gemegold*0913'
      })
    })
    
    const loginData = await loginResponse.json()
    
    if (loginData.success) {
      console.log('✅ Database connection working (admin login successful)')
      
      // Test submissions retrieval
      const submissionsResponse = await fetch(`${baseURL}/api/admin/submissions`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        }
      })
      
      const submissionsData = await submissionsResponse.json()
      
      if (submissionsData.success) {
        console.log(`✅ Database read working (${submissionsData.data.length} submissions found)`)
      } else {
        console.log('❌ Database read failed:', submissionsData.error)
      }
    } else {
      console.log('❌ Database connection failed:', loginData.error)
    }
  } catch (error) {
    console.log('❌ Database test error:', error.message)
  }
  
  // Test 6: Test with invalid data
  console.log('\n6. Testing Form Validation')
  const invalidTests = [
    { name: 'Missing email', data: { name: 'Test', service: 'software-development' } },
    { name: 'Invalid email', data: { email: 'invalid-email', name: 'Test', service: 'software-development' } },
    { name: 'Missing service', data: { email: 'test@test.com', name: 'Test' } },
    { name: 'Invalid service', data: { email: 'test@test.com', name: 'Test', service: 'invalid-service' } }
  ]
  
  for (const test of invalidTests) {
    try {
      const response = await fetch(`${baseURL}/api/submit-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test.data)
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log(`⚠️ ${test.name}: Unexpectedly succeeded (validation may be missing)`)
      } else {
        console.log(`✅ ${test.name}: Properly rejected - ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Request error - ${error.message}`)
    }
  }
  
  console.log('\n🎯 Form Submission Debug Complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Check server logs for detailed error messages')
  console.log('2. Verify SmartForm component implementation')
  console.log('3. Check MongoDB connection and schema validation')
  console.log('4. Test browser console for client-side errors')
}

// Run the debug test
testFormSubmissionDebug().catch(console.error)
