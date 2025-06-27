// Test Admin Dashboard 404 Issue
async function testAdminDashboard404() {
  console.log('🔍 Testing Admin Dashboard 404 Issue...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Test 1: Check main page
  console.log('1. Testing Main Page')
  try {
    const response = await fetch(baseURL)
    console.log(`📊 Main Page Status: ${response.status} ${response.statusText}`)
    
    if (response.ok) {
      console.log('✅ Main page loads correctly')
    } else {
      console.log('❌ Main page has issues')
    }
  } catch (error) {
    console.log('❌ Main page error:', error.message)
  }
  
  // Test 2: Check admin dashboard page
  console.log('\n2. Testing Admin Dashboard Page')
  try {
    const response = await fetch(`${baseURL}/admin`)
    console.log(`📊 Admin Dashboard Status: ${response.status} ${response.statusText}`)
    console.log(`📊 Response Headers:`, Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log(`📊 Response Length: ${responseText.length} characters`)
    
    if (response.status === 404) {
      console.log('❌ Confirmed: Admin dashboard returns 404')
      console.log('📄 Response preview:', responseText.substring(0, 200) + '...')
    } else if (response.ok) {
      console.log('✅ Admin dashboard loads correctly')
      console.log('📄 Response preview:', responseText.substring(0, 200) + '...')
    } else {
      console.log(`⚠️ Admin dashboard returns ${response.status}`)
      console.log('📄 Response preview:', responseText.substring(0, 200) + '...')
    }
  } catch (error) {
    console.log('❌ Admin dashboard error:', error.message)
  }
  
  // Test 3: Check admin API endpoints
  console.log('\n3. Testing Admin API Endpoints')
  
  const apiEndpoints = [
    '/api/admin/login',
    '/api/admin/dashboard',
    '/api/admin/submissions'
  ]
  
  for (const endpoint of apiEndpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint}`)
      console.log(`📊 ${endpoint}: ${response.status} ${response.statusText}`)
      
      if (response.status === 405) {
        console.log(`   ✅ ${endpoint}: Method not allowed (expected for GET on POST endpoint)`)
      } else if (response.status === 401) {
        console.log(`   ✅ ${endpoint}: Unauthorized (expected for protected endpoint)`)
      } else if (response.ok) {
        console.log(`   ✅ ${endpoint}: OK`)
      } else {
        console.log(`   ❌ ${endpoint}: Unexpected status`)
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: Error - ${error.message}`)
    }
  }
  
  // Test 4: Test admin login API
  console.log('\n4. Testing Admin Login API')
  try {
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'gbonsa2@gmail.com',
        password: 'gemegold*0913'
      })
    })
    
    console.log(`📊 Login API Status: ${loginResponse.status} ${loginResponse.statusText}`)
    
    const loginData = await loginResponse.json()
    
    if (loginData.success) {
      console.log('✅ Admin login API working')
      console.log(`👤 Admin: ${loginData.admin.name}`)
      console.log(`🔐 Token received: ${loginData.token ? 'Yes' : 'No'}`)
    } else {
      console.log('❌ Admin login API failed:', loginData.error)
    }
  } catch (error) {
    console.log('❌ Admin login API error:', error.message)
  }
  
  // Test 5: Check Next.js routing
  console.log('\n5. Testing Next.js Routing Structure')
  
  const testRoutes = [
    '/',
    '/admin',
    '/api/submit-form',
    '/api/send-otp',
    '/nonexistent-page'
  ]
  
  for (const route of testRoutes) {
    try {
      const response = await fetch(`${baseURL}${route}`)
      console.log(`📊 ${route}: ${response.status} ${response.statusText}`)
      
      if (route === '/nonexistent-page' && response.status === 404) {
        console.log(`   ✅ 404 handling working for non-existent pages`)
      } else if (route === '/admin' && response.status === 404) {
        console.log(`   ❌ Admin page incorrectly returns 404`)
      } else if (response.ok) {
        console.log(`   ✅ ${route} loads correctly`)
      }
    } catch (error) {
      console.log(`   ❌ ${route}: Error - ${error.message}`)
    }
  }
  
  // Test 6: Check server logs
  console.log('\n6. Server Information')
  console.log(`🌐 Base URL: ${baseURL}`)
  console.log(`📁 Expected admin page: ${baseURL}/admin`)
  console.log(`📂 Expected file location: app/admin/page.js`)
  
  console.log('\n🎯 Admin Dashboard 404 Test Complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Check if app/admin/page.js exists and is properly formatted')
  console.log('2. Verify Next.js routing configuration')
  console.log('3. Check for any compilation errors in the admin page')
  console.log('4. Restart development server if needed')
  console.log('5. Check browser console for JavaScript errors')
}

// Run the test
testAdminDashboard404().catch(console.error)
