import { connectToMongoose } from '../mongodb.js'
import { Submission as SubmissionModel } from '../schemas/index.js'

// In-memory fallback for development when MongoDB is not available
// Use global to persist across requests in development
if (!global.inMemorySubmissions) {
  global.inMemorySubmissions = new Map()
}
const inMemorySubmissions = global.inMemorySubmissions

export class Submission {
  static async create(submissionData) {
    const {
      user_id,
      email,
      name,
      company,
      service,
      budget,
      timeline,
      description,
      phone,
      website,
      files,
      // Web Development fields
      frontendFramework,
      backendLanguage,
      backendFramework,
      database,
      webFeatures,
      hosting,
      // Mobile Development fields
      mobileStack,
      targetPlatforms,
      appType,
      mobileFeatures,
      backendIntegration,
      appStoreDeployment,
      // Software Development fields
      softwareType,
      programmingLanguage,
      targetPlatform,
      softwareFeatures,
      integrationNeeds,
      performanceRequirements,
      // Publishers fields
      contentType,
      contentGenre,
      contentLength,
      distributionChannels,
      // Consultants fields
      consultingArea,
      businessStage,
      teamSize,
      currentChallenges,
      projectScope,
      successMetrics,
      // Events fields
      eventType,
      eventFormat,
      attendeeCount,
      eventDuration,
      eventGoals,
      specialRequirements,
      // Enterprise Software fields
      companySize,
      currentSystems,
      securityRequirements,
      scalabilityNeeds,
      // Legacy fields
      techStack,
      platform,
      designStyle,
      targetAudience,
      features,
      ip_address,
      user_agent,
      submitted_at
    } = submissionData

    try {
      await connectToMongoose()

      const submission = new SubmissionModel({
        user_id,
        email,
        name,
        company,
        service,
        budget,
        timeline,
        description,
        phone,
        website,
        files,
        // Web Development fields
        frontend_framework: frontendFramework,
        backend_language: backendLanguage,
        backend_framework: backendFramework,
        database,
        web_features: webFeatures,
        hosting,
        // Mobile Development fields
        mobile_stack: mobileStack,
        target_platforms: targetPlatforms,
        app_type: appType,
        mobile_features: mobileFeatures,
        backend_integration: backendIntegration,
        app_store_deployment: appStoreDeployment,
        // Software Development fields
        software_type: softwareType,
        programming_language: programmingLanguage,
        target_platform: targetPlatform,
        software_features: softwareFeatures,
        integration_needs: integrationNeeds,
        performance_requirements: performanceRequirements,
        // Publishers fields
        content_type: contentType,
        content_genre: contentGenre,
        content_length: contentLength,
        distribution_channels: distributionChannels,
        // Consultants fields
        consulting_area: consultingArea,
        business_stage: businessStage,
        team_size: teamSize,
        current_challenges: currentChallenges,
        project_scope: projectScope,
        success_metrics: successMetrics,
        // Events fields
        event_type: eventType,
        event_format: eventFormat,
        attendee_count: attendeeCount,
        event_duration: eventDuration,
        event_goals: eventGoals,
        special_requirements: specialRequirements,
        // Enterprise Software fields
        company_size: companySize,
        current_systems: currentSystems,
        security_requirements: securityRequirements,
        scalability_needs: scalabilityNeeds,
        // Legacy fields
        tech_stack: techStack,
        platform,
        design_style: designStyle,
        target_audience: targetAudience,
        features,
        ip_address,
        user_agent,
        submitted_at,
        status: 'received'
      })

      const savedSubmission = await submission.save()
      return savedSubmission.toObject()
    } catch (error) {
      // Fallback to in-memory storage
      console.log('⚠️ MongoDB not available, using in-memory submission storage')
      const submission = {
        _id: inMemorySubmissions.size + 1,
        user_id,
        email,
        name,
        company,
        service,
        budget,
        timeline,
        description,
        phone,
        website,
        files,
        // All dynamic fields
        frontend_framework: frontendFramework,
        backend_language: backendLanguage,
        backend_framework: backendFramework,
        database,
        web_features: webFeatures,
        hosting,
        mobile_stack: mobileStack,
        target_platforms: targetPlatforms,
        app_type: appType,
        mobile_features: mobileFeatures,
        backend_integration: backendIntegration,
        app_store_deployment: appStoreDeployment,
        software_type: softwareType,
        programming_language: programmingLanguage,
        target_platform: targetPlatform,
        software_features: softwareFeatures,
        integration_needs: integrationNeeds,
        performance_requirements: performanceRequirements,
        content_type: contentType,
        content_genre: contentGenre,
        content_length: contentLength,
        distribution_channels: distributionChannels,
        consulting_area: consultingArea,
        business_stage: businessStage,
        team_size: teamSize,
        current_challenges: currentChallenges,
        project_scope: projectScope,
        success_metrics: successMetrics,
        event_type: eventType,
        event_format: eventFormat,
        attendee_count: attendeeCount,
        event_duration: eventDuration,
        event_goals: eventGoals,
        special_requirements: specialRequirements,
        company_size: companySize,
        current_systems: currentSystems,
        security_requirements: securityRequirements,
        scalability_needs: scalabilityNeeds,
        // Legacy fields
        tech_stack: techStack,
        platform,
        design_style: designStyle,
        target_audience: targetAudience,
        features,
        status: 'received',
        ip_address,
        user_agent,
        submitted_at: submitted_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      inMemorySubmissions.set(submission._id, submission)
      console.log(`📝 Submission stored in memory: ${submission._id} from ${email}`)
      return submission
    }
  }

  static async findById(id) {
    try {
      await connectToMongoose()
      const submission = await SubmissionModel.findById(id).lean()
      return submission
    } catch (error) {
      // Fallback to in-memory storage
      return inMemorySubmissions.get(parseInt(id)) || null
    }
  }

  static async findByEmail(email, limit = 10) {
    try {
      await connectToMongoose()
      const submissions = await SubmissionModel
        .find({ email })
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()
      return submissions
    } catch (error) {
      // Fallback to in-memory storage
      const submissions = Array.from(inMemorySubmissions.values())
        .filter(s => s.email === email)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit)
      return submissions
    }
  }

  static async updateStatus(id, status) {
    try {
      await connectToMongoose()
      const submission = await SubmissionModel.findByIdAndUpdate(
        id,
        { status, updated_at: new Date() },
        { new: true }
      ).lean()
      return submission
    } catch (error) {
      // Fallback to in-memory storage
      const submission = inMemorySubmissions.get(parseInt(id))
      if (submission) {
        submission.status = status
        submission.updated_at = new Date().toISOString()
        inMemorySubmissions.set(parseInt(id), submission)
        return submission
      }
      return null
    }
  }

  static async getAll(limit = 50, offset = 0) {
    try {
      await connectToMongoose()

      const submissions = await SubmissionModel
        .find({})
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .lean()

      console.log(`📊 Retrieved ${submissions.length} submissions from MongoDB`)
      return submissions
    } catch (error) {
      console.log('⚠️ MongoDB query failed, using in-memory storage:', error.message)
      // Fallback to in-memory storage
      const submissions = Array.from(inMemorySubmissions.values())
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(offset, offset + limit)
      console.log(`📊 Retrieved ${submissions.length} submissions from memory`)
      return submissions
    }
  }

  static async getByStatus(status, limit = 50) {
    try {
      await connectToMongoose()
      const submissions = await SubmissionModel
        .find({ status })
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()
      return submissions
    } catch (error) {
      // Fallback to in-memory storage
      const submissions = Array.from(inMemorySubmissions.values())
        .filter(s => s.status === status)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit)
      return submissions
    }
  }

  static async getStats() {
    try {
      await connectToMongoose()

      // Get total count
      const total = await SubmissionModel.countDocuments({})

      // Get count by status
      const statusAggregation = await SubmissionModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
      const byStatus = statusAggregation.reduce((acc, item) => {
        acc[item._id] = item.count
        return acc
      }, {})

      // Get count by service
      const serviceAggregation = await SubmissionModel.aggregate([
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
      const byService = serviceAggregation.map(item => ({
        service: item._id,
        count: item.count
      }))

      // Get recent submissions (last 7 days)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const recent = await SubmissionModel.countDocuments({
        created_at: { $gte: weekAgo }
      })

      // Get this month's submissions
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const thisMonth = await SubmissionModel.countDocuments({
        created_at: { $gte: monthStart }
      })

      return {
        total,
        byStatus,
        byService,
        recent,
        thisMonth
      }
    } catch (error) {
      console.log('⚠️ MongoDB stats query failed, using in-memory storage:', error.message)
      // Fallback to in-memory storage stats
      const submissions = Array.from(inMemorySubmissions.values())
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const byStatus = {}
      const serviceCount = {}

      submissions.forEach(sub => {
        byStatus[sub.status] = (byStatus[sub.status] || 0) + 1
        serviceCount[sub.service] = (serviceCount[sub.service] || 0) + 1
      })

      const byService = Object.entries(serviceCount)
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return {
        total: submissions.length,
        byStatus,
        byService,
        recent: submissions.filter(s => new Date(s.created_at) > weekAgo).length,
        thisMonth: submissions.filter(s => new Date(s.created_at) > monthStart).length
      }
    }
  }

  static async search(searchTerm, limit = 20) {
    try {
      await connectToMongoose()
      const submissions = await SubmissionModel
        .find({
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { company: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
          ]
        })
        .sort({ created_at: -1 })
        .limit(limit)
        .lean()
      return submissions
    } catch (error) {
      // Fallback to in-memory storage
      const submissions = Array.from(inMemorySubmissions.values())
        .filter(s =>
          s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, limit)
      return submissions
    }
  }
}
