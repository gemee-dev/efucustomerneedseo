// Test Admin Dashboard Access
async function testAdminDashboardAccess() {
  console.log('🔐 Testing Admin Dashboard Access...\n')
  
  const baseURL = 'http://localhost:3000'
  
  // Test 1: Admin Login
  console.log('1. Testing Admin Login')
  try {
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
      console.log('✅ Login successful!')
      console.log(`👤 Welcome ${loginData.admin.name}`)
      console.log(`🔐 Role: ${loginData.admin.role}`)
      console.log(`📧 Email: ${loginData.admin.email}`)
      
      // Extract token for further requests
      const token = loginData.token
      
      // Test 2: Dashboard Data Access
      console.log('\n2. Testing Dashboard Data Access')
      const dashboardResponse = await fetch(`${baseURL}/api/admin/dashboard`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const dashboardData = await dashboardResponse.json()
      if (dashboardData.success) {
        console.log('✅ Dashboard data accessible!')
        console.log('📊 Statistics:', dashboardData.data.stats)
        console.log('📝 Recent submissions:', dashboardData.data.recentSubmissions?.length || 0)
      } else {
        console.log('❌ Dashboard access failed:', dashboardData.error)
      }
      
      // Test 3: Submissions Access
      console.log('\n3. Testing Submissions Access')
      const submissionsResponse = await fetch(`${baseURL}/api/admin/submissions`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const submissionsData = await submissionsResponse.json()
      if (submissionsData.success) {
        console.log('✅ Submissions accessible!')
        console.log(`📝 Total submissions: ${submissionsData.data.length}`)
        if (submissionsData.data.length > 0) {
          console.log('📋 Recent submissions:')
          submissionsData.data.slice(0, 3).forEach((sub, index) => {
            console.log(`   ${index + 1}. ${sub.name} - ${sub.service} (${sub.status})`)
          })
        }
      } else {
        console.log('❌ Submissions access failed:', submissionsData.error)
      }
      
    } else {
      console.log('❌ Login failed:', loginData.error)
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
  
  // Test 4: Alternative Admin Accounts
  console.log('\n4. Testing Alternative Admin Accounts')
  
  const altAdmins = [
    { email: 'gemechu@customerneedseo.com', password: 'admin123!@#', name: 'Gemechu' },
    { email: 'daniel@customerneedseo.com', password: 'admin123!@#', name: 'Daniel' }
  ]
  
  for (const admin of altAdmins) {
    try {
      const response = await fetch(`${baseURL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: admin.email,
          password: admin.password
        })
      })
      
      const data = await response.json()
      if (data.success) {
        console.log(`✅ ${admin.name} login successful`)
      } else {
        console.log(`❌ ${admin.name} login failed:`, data.error)
      }
    } catch (error) {
      console.log(`❌ ${admin.name} test error:`, error.message)
    }
  }
  
  console.log('\n🎯 Admin Dashboard Access Test Complete!')
  console.log('\n📋 Access URLs:')
  console.log(`🌐 Admin Dashboard: ${baseURL}/admin`)
  console.log(`🔐 Your Credentials: gbonsa2@gmail.com / gemegold*0913`)
  console.log(`🔐 Alt Credentials: gemechu@customerneedseo.com / admin123!@#`)
  console.log(`🔐 Alt Credentials: daniel@customerneedseo.com / admin123!@#`)
}

// Run the test
testAdminDashboardAccess().catch(console.error)
