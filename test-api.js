// Simple API test script
async function testAPI() {
  const baseURL = 'http://localhost:3000'
  
  console.log('🧪 Testing Customer Need SEO API Endpoints...\n')
  
  // Test 1: Send OTP
  console.log('1. Testing /api/send-otp')
  try {
    const response = await fetch(`${baseURL}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' })
    })
    
    const data = await response.json()
    console.log('✅ Send OTP Response:', data)
    
    if (data.demo && data.demo.otp) {
      console.log(`📧 Generated OTP: ${data.demo.otp}`)
      
      // Test 2: Verify OTP
      console.log('\n2. Testing /api/verify-otp')
      const verifyResponse = await fetch(`${baseURL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'test@example.com', 
          otp: data.demo.otp 
        })
      })
      
      const verifyData = await verifyResponse.json()
      console.log('✅ Verify OTP Response:', verifyData)
    }
  } catch (error) {
    console.log('❌ Send OTP Error:', error.message)
  }
  
  // Test 3: Submit Form
  console.log('\n3. Testing /api/submit-form')
  try {
    const formData = {
      email: 'test@example.com',
      name: 'Test User',
      company: 'Test Company',
      service: 'seo-audit',
      budget: '1k-3k',
      timeline: '1-2 months',
      description: 'Test SEO audit request',
      phone: '123-456-7890',
      website: 'https://example.com'
    }
    
    const submitResponse = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    const submitData = await submitResponse.json()
    console.log('✅ Submit Form Response:', submitData)
  } catch (error) {
    console.log('❌ Submit Form Error:', error.message)
  }
  
  // Test 4: Admin Login
  console.log('\n4. Testing /api/admin/login')
  try {
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'gemechu@customerneedseo.com', 
        password: 'admin123!@#' 
      })
    })
    
    const loginData = await loginResponse.json()
    console.log('✅ Admin Login Response:', loginData)
  } catch (error) {
    console.log('❌ Admin Login Error:', error.message)
  }
  
  console.log('\n🎉 API Testing Complete!')
}

// Run the test
testAPI().catch(console.error)
