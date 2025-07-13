"use client"

import { useState } from "react"
import { AdZone } from "@/components/ad-zone"

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "", email: "", service: "", description: "", company: "", phone: "", budget: "", timeline: "",
    // Web Development
    frontendFramework: "", backendLanguage: "", backendFramework: "", database: "", webFeatures: "", hosting: "",
    // Mobile Development
    mobileStack: "", targetPlatforms: "", appType: "", mobileFeatures: "", backendIntegration: "", appStoreDeployment: "",
    // Software Development
    softwareType: "", programmingLanguage: "", targetPlatform: "", softwareFeatures: "", integrationNeeds: "", performanceRequirements: "",
    // Publishers
    contentType: "", contentGenre: "", contentLength: "", distributionChannels: "",
    // Consultants
    consultingArea: "", businessStage: "", teamSize: "", currentChallenges: "", projectScope: "", successMetrics: "",
    // Events
    eventType: "", eventFormat: "", attendeeCount: "", eventDuration: "", eventGoals: "", specialRequirements: "",
    // Enterprise Software
    companySize: "", currentSystems: "", securityRequirements: "", scalabilityNeeds: "",
    // Legacy fields (keeping for compatibility)
    techStack: "", platform: "", designStyle: "", targetAudience: "", features: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploadLoading, setUploadLoading] = useState(false)

  // Get dynamic questions based on selected service
  const getDynamicQuestions = (service) => {
    switch (service) {
      case "web-development":
        return [
          {
            key: "frontendFramework",
            label: "Frontend Framework/Library",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select frontend framework" },
              { value: "react", label: "React" },
              { value: "nextjs", label: "Next.js" },
              { value: "vue", label: "Vue.js" },
              { value: "nuxt", label: "Nuxt.js" },
              { value: "angular", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vanilla-js", label: "Vanilla JavaScript" },
              { value: "no-preference", label: "No preference / Recommend" }
            ]
          },
          {
            key: "backendLanguage",
            label: "Backend Programming Language",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select backend language" },
              { value: "javascript", label: "JavaScript (Node.js)" },
              { value: "python", label: "Python" },
              { value: "php", label: "PHP" },
              { value: "java", label: "Java" },
              { value: "csharp", label: "C# (.NET)" },
              { value: "ruby", label: "Ruby" },
              { value: "go", label: "Go" },
              { value: "no-preference", label: "No preference / Recommend" }
            ]
          },
          {
            key: "backendFramework",
            label: "Backend Framework",
            type: "select",
            options: [
              { value: "", label: "Select backend framework" },
              { value: "express", label: "Express.js (Node.js)" },
              { value: "django", label: "Django (Python)" },
              { value: "flask", label: "Flask (Python)" },
              { value: "laravel", label: "Laravel (PHP)" },
              { value: "spring", label: "Spring (Java)" },
              { value: "dotnet", label: ".NET (C#)" },
              { value: "rails", label: "Ruby on Rails" },
              { value: "gin", label: "Gin (Go)" }
            ]
          },
          {
            key: "database",
            label: "Database Technology",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select database" },
              { value: "mysql", label: "MySQL" },
              { value: "postgresql", label: "PostgreSQL" },
              { value: "mongodb", label: "MongoDB" },
              { value: "sqlite", label: "SQLite" },
              { value: "redis", label: "Redis" },
              { value: "firebase", label: "Firebase Firestore" },
              { value: "no-preference", label: "No preference / Recommend" }
            ]
          },
          {
            key: "webFeatures",
            label: "Web Application Features",
            type: "textarea",
            required: true,
            placeholder: "List web-specific features (user authentication, payment processing, admin dashboard, API endpoints, real-time updates, etc.)"
          },
          {
            key: "hosting",
            label: "Hosting & Deployment",
            type: "select",
            options: [
              { value: "", label: "Select hosting preference" },
              { value: "vercel", label: "Vercel" },
              { value: "netlify", label: "Netlify" },
              { value: "aws", label: "AWS" },
              { value: "azure", label: "Microsoft Azure" },
              { value: "gcp", label: "Google Cloud Platform" },
              { value: "digitalocean", label: "DigitalOcean" },
              { value: "shared-hosting", label: "Shared Hosting" }
            ]
          }
        ]

      case "mobile-development":
        return [
          {
            key: "mobileStack",
            label: "Mobile Development Technology",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select mobile technology" },
              { value: "react-native", label: "React Native" },
              { value: "flutter", label: "Flutter" },
              { value: "native-ios", label: "Native iOS (Swift)" },
              { value: "native-android", label: "Native Android (Kotlin/Java)" },
              { value: "xamarin", label: "Xamarin" },
              { value: "ionic", label: "Ionic" },
              { value: "cordova", label: "Apache Cordova/PhoneGap" },
              { value: "no-preference", label: "No preference / Recommend" }
            ]
          },
          {
            key: "targetPlatforms",
            label: "Target Mobile Platforms",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select target platforms" },
              { value: "ios-only", label: "iOS Only" },
              { value: "android-only", label: "Android Only" },
              { value: "both-platforms", label: "Both iOS & Android" },
              { value: "cross-platform", label: "Cross-platform Solution" }
            ]
          },
          {
            key: "appType",
            label: "Mobile App Type",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select app type" },
              { value: "native", label: "Native Mobile App" },
              { value: "hybrid", label: "Hybrid App" },
              { value: "pwa", label: "Progressive Web App (PWA)" },
              { value: "cross-platform", label: "Cross-platform App" }
            ]
          },
          {
            key: "mobileFeatures",
            label: "Mobile-Specific Features",
            type: "textarea",
            required: true,
            placeholder: "List mobile features (push notifications, camera access, GPS/location, offline mode, biometric authentication, device sensors, etc.)"
          },
          {
            key: "backendIntegration",
            label: "Backend & API Integration",
            type: "select",
            options: [
              { value: "", label: "Select backend needs" },
              { value: "rest-api", label: "REST API" },
              { value: "graphql", label: "GraphQL API" },
              { value: "firebase", label: "Firebase Backend" },
              { value: "aws-amplify", label: "AWS Amplify" },
              { value: "custom-backend", label: "Custom Backend Development" },
              { value: "existing-api", label: "Integrate with Existing API" }
            ]
          },
          {
            key: "appStoreDeployment",
            label: "App Store Deployment",
            type: "select",
            options: [
              { value: "", label: "Select deployment target" },
              { value: "app-store", label: "Apple App Store" },
              { value: "google-play", label: "Google Play Store" },
              { value: "both-stores", label: "Both App Stores" },
              { value: "enterprise", label: "Enterprise Distribution" },
              { value: "beta-testing", label: "Beta Testing Only" }
            ]
          }
        ]

      case "software-development":
        return [
          {
            key: "softwareType",
            label: "Type of Software",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select software type" },
              { value: "desktop-app", label: "Desktop Application" },
              { value: "web-app", label: "Web Application" },
              { value: "mobile-app", label: "Mobile Application" },
              { value: "api-service", label: "API/Web Service" },
              { value: "automation-tool", label: "Automation Tool" },
              { value: "data-processing", label: "Data Processing Software" },
              { value: "custom-solution", label: "Custom Software Solution" }
            ]
          },
          {
            key: "programmingLanguage",
            label: "Preferred Programming Language",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select programming language" },
              { value: "python", label: "Python" },
              { value: "javascript", label: "JavaScript/TypeScript" },
              { value: "java", label: "Java" },
              { value: "csharp", label: "C#" },
              { value: "cpp", label: "C++" },
              { value: "go", label: "Go" },
              { value: "rust", label: "Rust" },
              { value: "php", label: "PHP" },
              { value: "ruby", label: "Ruby" },
              { value: "no-preference", label: "No preference / Recommend" }
            ]
          },
          {
            key: "targetPlatform",
            label: "Target Platform",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select target platform" },
              { value: "windows", label: "Windows" },
              { value: "macos", label: "macOS" },
              { value: "linux", label: "Linux" },
              { value: "cross-platform", label: "Cross-platform (Windows/Mac/Linux)" },
              { value: "web-based", label: "Web-based" },
              { value: "cloud", label: "Cloud/Server-based" }
            ]
          },
          {
            key: "softwareFeatures",
            label: "Software Features & Requirements",
            type: "textarea",
            required: true,
            placeholder: "Describe the main features and functionality needed for your software"
          },
          {
            key: "integrationNeeds",
            label: "Integration Requirements",
            type: "textarea",
            placeholder: "Any specific integrations needed (databases, APIs, third-party services, hardware, etc.)"
          },
          {
            key: "performanceRequirements",
            label: "Performance Requirements",
            type: "select",
            options: [
              { value: "", label: "Select performance needs" },
              { value: "standard", label: "Standard Performance" },
              { value: "high-performance", label: "High Performance" },
              { value: "real-time", label: "Real-time Processing" },
              { value: "enterprise-scale", label: "Enterprise Scale" }
            ]
          }
        ]

      case "efuyegela-publishers":
        return [
          {
            key: "contentType",
            label: "Type of Content",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select content type" },
              { value: "book", label: "Book Publishing" },
              { value: "ebook", label: "E-book Publishing" },
              { value: "magazine", label: "Magazine/Periodical" },
              { value: "digital-content", label: "Digital Content" },
              { value: "educational", label: "Educational Materials" },
              { value: "creative-portfolio", label: "Creative Portfolio" },
              { value: "blog-content", label: "Blog Content" },
              { value: "newsletter", label: "Newsletter" }
            ]
          },
          {
            key: "contentGenre",
            label: "Content Genre/Category",
            type: "select",
            options: [
              { value: "", label: "Select genre" },
              { value: "fiction", label: "Fiction" },
              { value: "non-fiction", label: "Non-Fiction" },
              { value: "educational", label: "Educational" },
              { value: "business", label: "Business" },
              { value: "technology", label: "Technology" },
              { value: "lifestyle", label: "Lifestyle" },
              { value: "health", label: "Health & Wellness" },
              { value: "arts", label: "Arts & Culture" },
              { value: "other", label: "Other" }
            ]
          },
          {
            key: "targetAudience",
            label: "Target Audience",
            type: "textarea",
            required: true,
            placeholder: "Describe your target audience in detail (age range, interests, demographics, reading habits, etc.)"
          },
          {
            key: "contentLength",
            label: "Expected Content Length",
            type: "select",
            options: [
              { value: "", label: "Select content length" },
              { value: "short-form", label: "Short-form (Articles, Blog posts)" },
              { value: "medium-form", label: "Medium-form (Guides, Reports)" },
              { value: "long-form", label: "Long-form (Books, Manuals)" },
              { value: "series", label: "Content Series" },
              { value: "ongoing", label: "Ongoing Publication" }
            ]
          },
          {
            key: "distributionChannels",
            label: "Distribution Channels",
            type: "textarea",
            placeholder: "Where do you plan to distribute? (Print, digital platforms, websites, social media, etc.)"
          }
        ]

      case "efuyegela-consultants":
        return [
          {
            key: "consultingArea",
            label: "Primary Consulting Area",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select consulting area" },
              { value: "business-strategy", label: "Business Strategy" },
              { value: "digital-transformation", label: "Digital Transformation" },
              { value: "creative-direction", label: "Creative Direction" },
              { value: "market-analysis", label: "Market Analysis" },
              { value: "process-optimization", label: "Process Optimization" },
              { value: "brand-development", label: "Brand Development" },
              { value: "marketing-strategy", label: "Marketing Strategy" },
              { value: "organizational-change", label: "Organizational Change" },
              { value: "technology-consulting", label: "Technology Consulting" }
            ]
          },
          {
            key: "businessStage",
            label: "Current Business Stage",
            type: "select",
            options: [
              { value: "", label: "Select business stage" },
              { value: "startup", label: "Startup (0-2 years)" },
              { value: "growth", label: "Growth Stage (2-5 years)" },
              { value: "established", label: "Established (5+ years)" },
              { value: "enterprise", label: "Enterprise/Large Corporation" },
              { value: "non-profit", label: "Non-profit Organization" }
            ]
          },
          {
            key: "teamSize",
            label: "Team/Organization Size",
            type: "select",
            options: [
              { value: "", label: "Select team size" },
              { value: "solo", label: "Solo/Individual" },
              { value: "small", label: "Small Team (2-10 people)" },
              { value: "medium", label: "Medium Team (11-50 people)" },
              { value: "large", label: "Large Team (51-200 people)" },
              { value: "enterprise", label: "Enterprise (200+ people)" }
            ]
          },
          {
            key: "currentChallenges",
            label: "Current Challenges",
            type: "textarea",
            required: true,
            placeholder: "Describe the main challenges you're facing that you need consulting help with"
          },
          {
            key: "projectScope",
            label: "Desired Project Scope",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select project scope" },
              { value: "assessment", label: "Initial Assessment & Recommendations" },
              { value: "strategy-development", label: "Strategy Development" },
              { value: "implementation", label: "Full Implementation Support" },
              { value: "ongoing-support", label: "Ongoing Advisory Support" },
              { value: "training", label: "Team Training & Development" },
              { value: "comprehensive", label: "Comprehensive Transformation" }
            ]
          },
          {
            key: "successMetrics",
            label: "Success Metrics",
            type: "textarea",
            placeholder: "How will you measure success? What are your key performance indicators?"
          }
        ]

      case "efuyegela-events":
        return [
          {
            key: "eventType",
            label: "Event Type",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select event type" },
              { value: "product-launch", label: "Product Launch" },
              { value: "conference", label: "Conference/Summit" },
              { value: "workshop", label: "Workshop/Training" },
              { value: "networking", label: "Networking Event" },
              { value: "virtual-event", label: "Virtual Event" },
              { value: "hybrid-event", label: "Hybrid Event (In-person + Virtual)" },
              { value: "trade-show", label: "Trade Show/Exhibition" },
              { value: "seminar", label: "Seminar/Webinar" },
              { value: "celebration", label: "Celebration/Awards" }
            ]
          },
          {
            key: "eventFormat",
            label: "Event Format",
            type: "select",
            options: [
              { value: "", label: "Select event format" },
              { value: "in-person", label: "In-person Only" },
              { value: "virtual", label: "Virtual Only" },
              { value: "hybrid", label: "Hybrid (Both)" }
            ]
          },
          {
            key: "attendeeCount",
            label: "Expected Number of Attendees",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select attendee count" },
              { value: "small", label: "Small (10-50 attendees)" },
              { value: "medium", label: "Medium (51-200 attendees)" },
              { value: "large", label: "Large (201-500 attendees)" },
              { value: "very-large", label: "Very Large (500+ attendees)" }
            ]
          },
          {
            key: "targetAudience",
            label: "Target Audience",
            type: "textarea",
            required: true,
            placeholder: "Describe your target audience (demographics, interests, professional background, etc.)"
          },
          {
            key: "eventDuration",
            label: "Event Duration",
            type: "select",
            options: [
              { value: "", label: "Select duration" },
              { value: "half-day", label: "Half Day (2-4 hours)" },
              { value: "full-day", label: "Full Day (6-8 hours)" },
              { value: "multi-day", label: "Multi-day (2-3 days)" },
              { value: "week-long", label: "Week-long" },
              { value: "ongoing", label: "Ongoing Series" }
            ]
          },
          {
            key: "eventGoals",
            label: "Event Goals & Objectives",
            type: "textarea",
            required: true,
            placeholder: "What are the main goals and objectives for this event? What do you want attendees to achieve?"
          },
          {
            key: "specialRequirements",
            label: "Special Requirements",
            type: "textarea",
            placeholder: "Any special requirements? (AV equipment, catering, accessibility, technology needs, etc.)"
          }
        ]

      case "enterprise-software":
        return [
          {
            key: "softwareType",
            label: "Type of Enterprise Software",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select software type" },
              { value: "erp", label: "ERP (Enterprise Resource Planning)" },
              { value: "crm", label: "CRM (Customer Relationship Management)" },
              { value: "hrms", label: "HRMS (Human Resource Management)" },
              { value: "inventory", label: "Inventory Management" },
              { value: "accounting", label: "Accounting & Finance" },
              { value: "project-management", label: "Project Management" },
              { value: "business-intelligence", label: "Business Intelligence/Analytics" },
              { value: "workflow", label: "Workflow Management" },
              { value: "custom", label: "Custom Enterprise Solution" }
            ]
          },
          {
            key: "companySize",
            label: "Company Size",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select company size" },
              { value: "small", label: "Small (10-50 employees)" },
              { value: "medium", label: "Medium (51-200 employees)" },
              { value: "large", label: "Large (201-1000 employees)" },
              { value: "enterprise", label: "Enterprise (1000+ employees)" }
            ]
          },
          {
            key: "techStack",
            label: "Technology Preference",
            type: "select",
            required: true,
            options: [
              { value: "", label: "Select technology preference" },
              { value: "microsoft-stack", label: "Microsoft Stack (.NET, SQL Server)" },
              { value: "java-enterprise", label: "Java Enterprise (Spring, Oracle)" },
              { value: "cloud-native", label: "Cloud Native (AWS/Azure/GCP)" },
              { value: "open-source", label: "Open Source Solutions" },
              { value: "hybrid", label: "Hybrid Approach" },
              { value: "no-preference", label: "No preference / Recommend" }
            ]
          },
          {
            key: "currentSystems",
            label: "Current Systems in Use",
            type: "textarea",
            required: true,
            placeholder: "List current software systems, databases, and tools your company uses"
          },
          {
            key: "integrationNeeds",
            label: "Integration Requirements",
            type: "textarea",
            required: true,
            placeholder: "Describe existing systems that need integration (ERP, CRM, databases, third-party APIs, etc.)"
          },
          {
            key: "securityRequirements",
            label: "Security & Compliance Requirements",
            type: "textarea",
            placeholder: "Any specific security standards or compliance requirements? (GDPR, HIPAA, SOX, etc.)"
          },
          {
            key: "scalabilityNeeds",
            label: "Scalability Requirements",
            type: "select",
            options: [
              { value: "", label: "Select scalability needs" },
              { value: "current", label: "Current size only" },
              { value: "moderate", label: "Moderate growth (2x in 2 years)" },
              { value: "high", label: "High growth (5x in 2 years)" },
              { value: "enterprise", label: "Enterprise scale (unlimited)" }
            ]
          }
        ]

      default:
        return []
    }
  }

  const handleFileUpload = async (files) => {
    setUploadLoading(true)
    const uploadedFileData = []
    let hasErrors = false

    for (const file of files) {
      try {
        // Validate file size on frontend first
        if (file.size > 5 * 1024 * 1024) {
          alert(`File "${file.name}" is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum 5MB allowed.`)
          hasErrors = true
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        console.log(`📤 Uploading file: ${file.name} (${Math.round(file.size / 1024)}KB)`)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ File upload successful:', result)
          uploadedFileData.push({
            name: result.originalName || file.name,
            size: result.size || file.size,
            type: result.type || file.type,
            url: result.url,
            uploadedAt: result.uploadedAt || new Date().toISOString()
          })
        } else {
          const errorResult = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('❌ File upload failed:', errorResult)
          alert(`Failed to upload "${file.name}": ${errorResult.error || 'Server error'}`)
          hasErrors = true
        }
      } catch (error) {
        console.error('File upload error:', error)
        alert(`Error uploading "${file.name}": ${error.message}`)
        hasErrors = true
      }
    }

    if (uploadedFileData.length > 0) {
      setUploadedFiles(prev => [...prev, ...uploadedFileData])
    }

    if (!hasErrors && uploadedFileData.length > 0) {
      alert(`Successfully uploaded ${uploadedFileData.length} file(s)`)
    }

    setUploadLoading(false)
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const validateDynamicFields = () => {
    const dynamicQuestions = getDynamicQuestions(formData.service)
    const requiredFields = dynamicQuestions.filter(q => q.required)

    for (const field of requiredFields) {
      if (!formData[field.key] || formData[field.key].trim() === '') {
        alert(`Please fill in the required field: ${field.label}`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate dynamic fields
    if (!validateDynamicFields()) {
      return
    }

    setLoading(true)

    try {
      const submissionData = {
        ...formData,
        files: uploadedFiles,
        submittedAt: new Date().toISOString()
      }

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          setShowForm(false)
          setSuccess(false)
          setFormData({
            name: "", email: "", service: "", description: "", company: "", phone: "", budget: "", timeline: "",
            // Web Development
            frontendFramework: "", backendLanguage: "", backendFramework: "", database: "", webFeatures: "", hosting: "",
            // Mobile Development
            mobileStack: "", targetPlatforms: "", appType: "", mobileFeatures: "", backendIntegration: "", appStoreDeployment: "",
            // Software Development
            softwareType: "", programmingLanguage: "", targetPlatform: "", softwareFeatures: "", integrationNeeds: "", performanceRequirements: "",
            // Publishers
            contentType: "", contentGenre: "", contentLength: "", distributionChannels: "",
            // Consultants
            consultingArea: "", businessStage: "", teamSize: "", currentChallenges: "", projectScope: "", successMetrics: "",
            // Events
            eventType: "", eventFormat: "", attendeeCount: "", eventDuration: "", eventGoals: "", specialRequirements: "",
            // Enterprise Software
            companySize: "", currentSystems: "", securityRequirements: "", scalabilityNeeds: "",
            // Legacy fields (keeping for compatibility)
            techStack: "", platform: "", designStyle: "", targetAudience: "", features: ""
          })
          setUploadedFiles([])
        }, 2000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4 leading-tight" style={{
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Efuyegela
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Creative ecosystem solutions and software development
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Start Project
          </button>

          {/* Google Ad - Horizontal below Start Project button */}
          <div className="mt-6 w-full max-w-2xl mx-auto">
            <AdZone position="horizontal" enableGoogleAds={true} />
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {success ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
                  <p className="text-gray-600">Your project request has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Project</h2>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed *</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({...formData, service: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="efuyegela-publishers">Efuyegela Publishers - Creative Publishing</option>
                      <option value="efuyegela-consultants">Efuyegela Consultants - Turn-key Solutions</option>
                      <option value="efuyegela-collectives">Efuyegela Collectives - Community Ecosystem</option>
                      <option value="efuyegela-intelligence">Efuyegela Intelligence - Ecosystem Mapping</option>
                      <option value="efuyegela-events">Efuyegela Events - Product Launch & Marketing</option>
                      <option value="efuyegela-content">Efuyegela Content - Frameworks & Products</option>
                      <option value="software-development">Software Development - Custom Applications</option>
                      <option value="web-development">Web Development - Websites & Web Apps</option>
                      <option value="mobile-development">Mobile Development - iOS & Android</option>
                      <option value="enterprise-software">Enterprise Software - Business Systems</option>
                      <option value="creative-software">Creative Software - Tools for Creators</option>
                    </select>
                  </div>

                  {/* Dynamic Questions Based on Service */}
                  {formData.service && getDynamicQuestions(formData.service).length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h3 className="text-md font-semibold text-blue-900 mb-3">Service-Specific Questions</h3>
                      <div className="space-y-4">
                        {getDynamicQuestions(formData.service).map((question) => (
                          <div key={question.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {question.label} {question.required && <span className="text-red-500">*</span>}
                            </label>
                            {question.type === "select" ? (
                              <select
                                value={formData[question.key] || ""}
                                onChange={(e) => setFormData({...formData, [question.key]: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {question.options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : question.type === "textarea" ? (
                              <textarea
                                value={formData[question.key] || ""}
                                onChange={(e) => setFormData({...formData, [question.key]: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder={question.placeholder}
                              />
                            ) : (
                              <input
                                type="text"
                                value={formData[question.key] || ""}
                                onChange={(e) => setFormData({...formData, [question.key]: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={question.placeholder}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-5k">Under $5,000</option>
                        <option value="5k-15k">$5,000 - $15,000</option>
                        <option value="15k-50k">$15,000 - $50,000</option>
                        <option value="50k-plus">$50,000+</option>
                        <option value="discuss">Let's discuss</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select timeline</option>
                        <option value="asap">ASAP</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="3-months">Within 3 months</option>
                        <option value="6-months">Within 6 months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      placeholder="Tell us about your project, goals, and any specific requirements..."
                    />
                  </div>

                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Files</label>
                    <p className="text-xs text-gray-500 mb-2">Upload any relevant documents, images, or files related to your project (Max 5MB each)</p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-gray-600">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm">
                            <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload files</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, Images, ZIP up to 5MB each</p>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Files Display */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <div className="flex items-center">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {uploadLoading && (
                      <div className="mt-2 text-center">
                        <div className="inline-flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm text-gray-600">Uploading files...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}



        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Creative Ecosystem</h3>
                <p className="text-gray-600 text-sm">Six specialized divisions supporting creators.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Software Development</h3>
                <p className="text-gray-600 text-sm">Custom software solutions for your ideas.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Why Choose Efuyegela</h3>
                <p className="text-gray-600 text-sm">Complete ecosystem and creator-focused solutions.</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-orange-100">
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Expert Support</h3>
                <p className="text-gray-600 text-sm">Professional guidance throughout your creative journey.</p>
              </div>
            </div>
          </div>

          {/* Sidebar with Admin Ads Only */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-8 space-y-4 sm:space-y-6">
              {/* Admin Created Ads Space */}
              <div className="w-full max-w-sm mx-auto lg:max-w-none">
                <AdZone position="admin-sidebar" enableGoogleAds={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Created Ads - Footer */}
        <div className="mt-8 sm:mt-12 w-full overflow-hidden">
          <AdZone position="admin-footer" enableGoogleAds={false} />
        </div>
      </div>
    </div>
  )
}
