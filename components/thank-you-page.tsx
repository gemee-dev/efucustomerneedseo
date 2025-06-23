"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Calendar, Mail, Download } from "lucide-react"

interface ThankYouPageProps {
  email: string
  formData: any
}

export function ThankYouPage({ email, formData }: ThankYouPageProps) {
  useEffect(() => {
    // Track conversion
    window.gtag?.("event", "conversion", {
      event_category: "form",
      event_label: "intake_form_complete",
      value: 1,
    })
  }, [])

  const downloadSummary = () => {
    const summary = `
Project Summary
===============

Email: ${email}
Name: ${formData.name}
Company: ${formData.company || "N/A"}
Service: ${formData.service}
Budget: ${formData.budget || "Not specified"}
Timeline: ${formData.timeline || "Not specified"}

Description:
${formData.description}

Submitted: ${new Date(formData.submittedAt).toLocaleString()}
    `

    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "project-summary.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-lg text-gray-600">Your project request has been submitted successfully.</p>
      </div>

      <Alert className="border-green-200 bg-green-50 text-left">
        <Mail className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>What happens next?</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• You'll receive a confirmation email within 5 minutes</li>
            <li>• Our team will review your project within 24 hours</li>
            <li>• We'll send you a detailed proposal within 2-3 business days</li>
            {formData.bookCalendar && <li>• You'll receive a calendar invite for your consultation call</li>}
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Project Details</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Service:</strong> {formData.service}
            </p>
            <p>
              <strong>Budget:</strong> {formData.budget || "Not specified"}
            </p>
            <p>
              <strong>Timeline:</strong> {formData.timeline || "Not specified"}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Contact Info</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            {formData.company && (
              <p>
                <strong>Company:</strong> {formData.company}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={downloadSummary} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Summary
        </Button>

        {!formData.bookCalendar && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule a Call
          </Button>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p>Reference ID: {formData.submittedAt}</p>
        <p>Need help? Contact us at support@company.com</p>
      </div>
    </div>
  )
}
