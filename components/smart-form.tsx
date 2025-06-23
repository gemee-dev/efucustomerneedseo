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

interface SmartFormProps {
  email: string
  onSubmit: (data: any) => void
}

const serviceOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app", label: "Mobile App Development" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "consulting", label: "Business Consulting" },
  { value: "other", label: "Other" },
]

const budgetRanges = [
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k+", label: "$50,000+" },
]

const timelineOptions = [
  { value: "1-2-weeks", label: "1-2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "2-3-months", label: "2-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-months+", label: "6+ months" },
]

export function SmartForm({ email, onSubmit }: SmartFormProps) {
  const [selectedService, setSelectedService] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
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

  const onFormSubmit = async (data: any) => {
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
      case "web-development":
        return (
          <div className="space-y-4">
            <div>
              <Label>Tech Stack Preferences</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["React", "Next.js", "Vue.js", "Angular", "Node.js", "Python"].map((tech) => (
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Project</h2>
        <p className="text-gray-600">We'll use this information to provide you with the best service</p>
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
        <Checkbox id="bookCalendar" onCheckedChange={(checked) => setValue("bookCalendar", checked as boolean)} />
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
