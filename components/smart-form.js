"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/file-upload"
import { CalendarBooking } from "@/components/calendar-booking"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"

const serviceOptions = [
  { value: "efuyegela-publishers", label: "Efuyegela Publishers - Creative Publishing & Content Creation" },
  { value: "efuyegela-consultants", label: "Efuyegela Consultants - Turn-key Solution Provider" },
  { value: "efuyegela-collectives", label: "Efuyegela Collectives - Diverse Community Ecosystem" },
  { value: "efuyegela-intelligence", label: "Efuyegela Intelligence - Ecosystem Mapping & Research" },
  { value: "efuyegela-events", label: "Efuyegela Events - Product/Service Launch & Marketing" },
  { value: "efuyegela-content", label: "Efuyegela Content - Off-the-shelf Frameworks & Products" },
  { value: "software-development", label: "Software Development - Custom Applications & Solutions" },
  { value: "web-development", label: "Web Development - Websites & Web Applications" },
  { value: "mobile-development", label: "Mobile Development - iOS & Android Apps" },
  { value: "enterprise-software", label: "Enterprise Software - Business Management Systems" },
  { value: "creative-software", label: "Creative Software - Tools for Creators & Artists" },
  { value: "creative-funding", label: "Creative Funding & Investment Support" },
  { value: "market-development", label: "Market Development & Creator Support" },
  { value: "custom-creative-solutions", label: "Custom Creative Solutions" },
]

const budgetRanges = [
  { value: "500-1k", label: "$500 - $1,000" },
  { value: "1k-3k", label: "$1,000 - $3,000" },
  { value: "3k-5k", label: "$3,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k+", label: "$10,000+" },
]

const timelineOptions = [
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "2-3-months", label: "2-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-months+", label: "6+ months" },
]

export function SmartForm({ email, onSubmit }) {
  const [selectedService, setSelectedService] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
      name: "",
      company: "",
      phone: "",
      service: "",
      budget: "",
      timeline: "",
      description: "",
      techStack: [],
      designPreferences: "",
      marketingGoals: "",
      consultingArea: "",
      bookCalendar: false,
    },
  })

  const watchedService = watch("service")

  useEffect(() => {
    setSelectedService(watchedService)
  }, [watchedService])

  const onFormSubmit = async (data) => {
    setLoading(true)
    setError("")

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      const formData = {
        ...data,
        files: uploadedFiles,
        submittedAt: new Date().toISOString(),
      }

      console.log("Form submitted:", formData)
      onSubmit(formData)
    } catch (err) {
      setError("Failed to submit form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderDynamicFields = () => {
    switch (selectedService) {
      case "software-development":
      case "web-development":
        return (
          <div className="space-y-4">
            <div>
              <Label>Tech Stack Preferences</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["React", "Next.js", "Vue.js", "Angular", "Node.js", "Python", "JavaScript", "TypeScript"].map((tech) => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={tech}
                      onCheckedChange={(checked) => {
                        const current = watch("techStack") || []
                        if (checked) {
                          setValue("techStack", [...current, tech])
                        } else {
                          setValue(
                            "techStack",
                            current.filter((t) => t !== tech),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={tech} className="text-sm">
                      {tech}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Select onValueChange={(value) => setValue("projectType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-app">Web Application</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="api">API Development</SelectItem>
                  <SelectItem value="database">Database Design</SelectItem>
                  <SelectItem value="full-stack">Full Stack Solution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "mobile-development":
        return (
          <div className="space-y-4">
            <div>
              <Label>Platform Preferences</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["iOS", "Android", "React Native", "Flutter", "Xamarin", "Progressive Web App"].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      onCheckedChange={(checked) => {
                        const current = watch("platforms") || []
                        if (checked) {
                          setValue("platforms", [...current, platform])
                        } else {
                          setValue(
                            "platforms",
                            current.filter((p) => p !== platform),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={platform} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "enterprise-software":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select onValueChange={(value) => setValue("businessType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="creative">Creative Industry</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="systemRequirements">System Requirements</Label>
              <Textarea
                id="systemRequirements"
                {...register("systemRequirements")}
                placeholder="Describe your business processes, user requirements, integration needs..."
                className="mt-1"
              />
            </div>
          </div>
        )

      case "creative-software":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="creativeField">Creative Field</Label>
              <Select onValueChange={(value) => setValue("creativeField", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select creative field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graphic-design">Graphic Design</SelectItem>
                  <SelectItem value="video-editing">Video Editing</SelectItem>
                  <SelectItem value="music-production">Music Production</SelectItem>
                  <SelectItem value="writing">Writing & Publishing</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="3d-modeling">3D Modeling</SelectItem>
                  <SelectItem value="game-development">Game Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "ui-ux-design":
        return (
          <div>
            <Label htmlFor="designPreferences">Design Preferences</Label>
            <Textarea
              id="designPreferences"
              {...register("designPreferences")}
              placeholder="Describe your design style preferences, color schemes, inspiration..."
              className="mt-1"
            />
          </div>
        )

      case "digital-marketing":
        return (
          <div>
            <Label htmlFor="marketingGoals">Marketing Goals</Label>
            <Textarea
              id="marketingGoals"
              {...register("marketingGoals")}
              placeholder="What are your marketing objectives? Target audience? Current challenges?"
              className="mt-1"
            />
          </div>
        )

      case "consulting":
        return (
          <div>
            <Label htmlFor="consultingArea">Consulting Area</Label>
            <Select onValueChange={(value) => setValue("consultingArea", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select consulting area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strategy">Business Strategy</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Creative & Software Needs</h2>
        <p className="text-gray-600">Share your requirements for our creative ecosystem solutions, software development, publishing, consulting, or events</p>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register("name", { required: "Name is required" })} className="mt-1" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
      </div>

      {/* Service Selection */}
      <div>
        <Label htmlFor="service">Service Needed *</Label>
        <Select onValueChange={(value) => setValue("service", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service && <p className="text-red-500 text-sm mt-1">Please select a service</p>}
      </div>

      {/* Dynamic Fields */}
      {renderDynamicFields()}

      {/* Budget and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budget">Budget Range</Label>
          <Select onValueChange={(value) => setValue("budget", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Select onValueChange={(value) => setValue("timeline", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <Label htmlFor="description">Project Description *</Label>
        <Textarea
          id="description"
          {...register("description", { required: "Project description is required" })}
          placeholder="Please describe your project in detail..."
          className="mt-1"
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* File Upload */}
      <div>
        <Label>Supporting Documents</Label>
        <FileUpload onFilesUploaded={setUploadedFiles} />
      </div>

      {/* Calendar Booking Option */}
      <div className="flex items-center space-x-2">
        <Checkbox id="bookCalendar" onCheckedChange={(checked) => setValue("bookCalendar", checked)} />
        <Label htmlFor="bookCalendar">I'd like to schedule a consultation call</Label>
      </div>

      {watch("bookCalendar") && (
        <div className="mt-4">
          <CalendarBooking email={email} />
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Project Request
          </>
        )}
      </Button>
    </form>
  )
}
