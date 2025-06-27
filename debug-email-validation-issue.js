// Debug Email Validation Issue
async function debugEmailValidationIssue() {
  console.log('🔍 Debugging Email Validation Issue...\n')
  
  const baseURL = 'http://localhost:3002'
  
  // Test 1: Basic form submission with email
  console.log('1. Testing Basic Form Submission with Email')
  
  const testData = {
    email: 'test.email@efuyegela.com',
    name: 'Test User',
    company: 'Test Company',
    service: 'software-development',
    budget: '3k-5k',
    timeline: '1-2 months',
    description: 'Testing email validation issue',
    phone: '123-456-7890',
    website: 'https://testcompany.com'
  }
  
  console.log('📝 Sending test data:')
  console.log(JSON.stringify(testData, null, 2))
  
  try {
    const response = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`)
    console.log(`📊 Response Headers:`, Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
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
    console.log('❌ Request failed:', error.message)
  }
  
  // Test 2: Test with different email formats
  console.log('\n2. Testing Different Email Formats')
  
  const emailTests = [
    'simple@test.com',
    'user.name@domain.com',
    'user+tag@domain.co.uk',
    'user123@test-domain.com',
    'test@efuyegela.com',
    '', // Empty email
    'invalid-email', // Invalid format
    'user@', // Incomplete
    '@domain.com' // Missing user
  ]
  
  for (const email of emailTests) {
    try {
      const emailTestData = {
        email: email,
        name: 'Test User',
        service: 'web-development',
        description: 'Testing email format'
      }
      
      console.log(`\n   Testing email: "${email}"`)
      
      const response = await fetch(`${baseURL}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailTestData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log(`   ✅ Accepted: ${email}`)
      } else {
        console.log(`   ❌ Rejected: ${email} - ${result.error}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${email} - ${error.message}`)
    }
  }
  
  // Test 3: Test with missing fields
  console.log('\n3. Testing Missing Fields Scenarios')
  
  const missingFieldTests = [
    {
      name: 'Missing email only',
      data: { name: 'Test', service: 'software-development', description: 'Test' }
    },
    {
      name: 'Missing name only',
      data: { email: 'test@test.com', service: 'software-development', description: 'Test' }
    },
    {
      name: 'Missing service only',
      data: { email: 'test@test.com', name: 'Test', description: 'Test' }
    },
    {
      name: 'Missing description only',
      data: { email: 'test@test.com', name: 'Test', service: 'software-development' }
    },
    {
      name: 'All required fields present',
      data: { email: 'test@test.com', name: 'Test', service: 'software-development', description: 'Test' }
    }
  ]
  
  for (const test of missingFieldTests) {
    try {
      console.log(`\n   Testing: ${test.name}`)
      console.log(`   Data: ${JSON.stringify(test.data)}`)
      
      const response = await fetch(`${baseURL}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log(`   ✅ Accepted`)
      } else {
        console.log(`   ❌ Rejected: ${result.error}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
  
  // Test 4: Test with null/undefined values
  console.log('\n4. Testing Null/Undefined Values')
  
  const nullTests = [
    {
      name: 'Email as null',
      data: { email: null, name: 'Test', service: 'software-development', description: 'Test' }
    },
    {
      name: 'Email as undefined',
      data: { email: undefined, name: 'Test', service: 'software-development', description: 'Test' }
    },
    {
      name: 'Email as empty string',
      data: { email: '', name: 'Test', service: 'software-development', description: 'Test' }
    },
    {
      name: 'Email as whitespace',
      data: { email: '   ', name: 'Test', service: 'software-development', description: 'Test' }
    }
  ]
  
  for (const test of nullTests) {
    try {
      console.log(`\n   Testing: ${test.name}`)
      
      const response = await fetch(`${baseURL}/api/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data)
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log(`   ✅ Accepted`)
      } else {
        console.log(`   ❌ Rejected: ${result.error}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
  
  // Test 5: Test with extra fields
  console.log('\n5. Testing with Extra Fields')
  
  const extraFieldsData = {
    email: 'extra.fields@test.com',
    name: 'Extra Fields Test',
    service: 'software-development',
    description: 'Testing with extra fields',
    company: 'Extra Company',
    phone: '123-456-7890',
    website: 'https://extra.com',
    budget: '5k-10k',
    timeline: '2-3 months',
    extraField1: 'should be ignored',
    extraField2: 123,
    extraField3: { nested: 'object' }
  }
  
  try {
    console.log('📝 Sending data with extra fields...')
    
    const response = await fetch(`${baseURL}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extraFieldsData)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Extra fields test successful')
    } else {
      console.log('❌ Extra fields test failed:', result.error)
    }
  } catch (error) {
    console.log('❌ Extra fields test error:', error.message)
  }
  
  console.log('\n🎯 Email Validation Debug Complete!')
  console.log('\n📋 Next Steps:')
  console.log('1. Check SmartForm component field mapping')
  console.log('2. Verify API validation logic')
  console.log('3. Test form UI directly in browser')
}

// Run the debug
debugEmailValidationIssue().catch(console.error)
