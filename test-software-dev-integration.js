// Test Software Development Integration
async function testSoftwareDevIntegration() {
  console.log('💻 Testing Software Development Integration...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Test 1: Software Development Service Submission
  console.log('1. Testing Software Development Service Submission')
  try {
    const formData = {
      email: 'developer.test@efuyegela.com',
      name: 'Test Developer',
      company: 'Software Test Company',
      service: 'software-development',
      budget: '5k-10k',
      timeline: '2-3 months',
      description: 'Need custom software development for our business. Looking for a web application with user authentication, database integration, and API development. Prefer modern tech stack with React and Node.js.',
      phone: '123-456-7890',
      website: 'https://softwaretestcompany.com'
    }
    
    const submitResponse = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    
    const submitData = await submitResponse.json()
    if (submitData.success) {
      console.log('✅ Software development submission successful!')
      console.log('📝 Service:', formData.service)
      console.log('👤 Developer:', formData.name)
      console.log('💰 Budget:', formData.budget)
    } else {
      console.log('❌ Submission failed:', submitData.error)
    }
  } catch (error) {
    console.log('❌ Software dev submission error:', error.message)
  }
  
  // Test 2: Web Development Service Submission
  console.log('\n2. Testing Web Development Service Submission')
  try {
    const webFormData = {
      email: 'webdev.test@efuyegela.com',
      name: 'Test Web Developer',
      company: 'Web Solutions Inc',
      service: 'web-development',
      budget: '3k-5k',
      timeline: '1-2 months',
      description: 'Need a modern responsive website with e-commerce functionality. Looking for Next.js implementation with Stripe integration and content management system.',
      phone: '123-456-7891',
      website: 'https://websolutions.com'
    }
    
    const webSubmitResponse = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webFormData)
    })
    
    const webSubmitData = await webSubmitResponse.json()
    if (webSubmitData.success) {
      console.log('✅ Web development submission successful!')
      console.log('📝 Service:', webFormData.service)
      console.log('👤 Developer:', webFormData.name)
    } else {
      console.log('❌ Web submission failed:', webSubmitData.error)
    }
  } catch (error) {
    console.log('❌ Web dev submission error:', error.message)
  }
  
  // Test 3: Mobile Development Service Submission
  console.log('\n3. Testing Mobile Development Service Submission')
  try {
    const mobileFormData = {
      email: 'mobile.test@efuyegela.com',
      name: 'Test Mobile Developer',
      company: 'Mobile Apps Co',
      service: 'mobile-development',
      budget: '10k+',
      timeline: '3-6 months',
      description: 'Need iOS and Android mobile applications for our business. Looking for React Native development with offline capabilities, push notifications, and cloud synchronization.',
      phone: '123-456-7892',
      website: 'https://mobileapps.com'
    }
    
    const mobileSubmitResponse = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mobileFormData)
    })
    
    const mobileSubmitData = await mobileSubmitResponse.json()
    if (mobileSubmitData.success) {
      console.log('✅ Mobile development submission successful!')
      console.log('📝 Service:', mobileFormData.service)
      console.log('👤 Developer:', mobileFormData.name)
    } else {
      console.log('❌ Mobile submission failed:', mobileSubmitData.error)
    }
  } catch (error) {
    console.log('❌ Mobile dev submission error:', error.message)
  }
  
  // Test 4: Admin Dashboard Access to Software Submissions
  console.log('\n4. Testing Admin Access to Software Development Submissions')
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
      const token = loginData.token
      
      const submissionsResponse = await fetch(`${baseURL}/api/admin/submissions`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const submissionsData = await submissionsResponse.json()
      if (submissionsData.success) {
        console.log('✅ Admin can access software development submissions!')
        
        const softwareSubmissions = submissionsData.data.filter(sub => 
          ['software-development', 'web-development', 'mobile-development', 'enterprise-software', 'creative-software'].includes(sub.service)
        )
        
        console.log(`📝 Total software submissions: ${softwareSubmissions.length}`)
        console.log('💻 Software Development Services:')
        softwareSubmissions.slice(0, 5).forEach((sub, index) => {
          console.log(`   ${index + 1}. ${sub.name} - ${sub.service} (${sub.status})`)
        })
      } else {
        console.log('❌ Admin submissions access failed:', submissionsData.error)
      }
    } else {
      console.log('❌ Admin login failed:', loginData.error)
    }
  } catch (error) {
    console.log('❌ Admin test error:', error.message)
  }
  
  console.log('\n🎯 Software Development Integration Test Complete!')
  console.log('\n📋 Software Development Services Available:')
  console.log('💻 Software Development - Custom Applications & Solutions')
  console.log('🌐 Web Development - Websites & Web Applications')
  console.log('📱 Mobile Development - iOS & Android Apps')
  console.log('🏢 Enterprise Software - Business Management Systems')
  console.log('🎨 Creative Software - Tools for Creators & Artists')
  
  console.log('\n🌐 Access Information:')
  console.log(`🌐 Main Application: ${baseURL}`)
  console.log(`🔐 Admin Dashboard: ${baseURL}/admin`)
  console.log('🔐 Login: gbonsa2@gmail.com / gemegold*0913')
}

// Run the test
testSoftwareDevIntegration().catch(console.error)
