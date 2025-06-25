import { NextResponse } from "next/server"
import { Submission } from "@/lib/models/Submission"
import { User } from "@/lib/models/User"
import nodemailer from "nodemailer"

export async function POST(request) {
  try {
    const formData = await request.json()

    // Enhanced validation
    const requiredFields = ['name', 'email', 'service', 'description']
    const missingFields = requiredFields.filter(field => !formData[field])

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json({
        error: "Invalid email format"
      }, { status: 400 })
    }

    // Get or create user
    const user = await User.getOrCreate({
      email: formData.email,
      name: formData.name,
      company: formData.company,
      phone: formData.phone
    })

    // Prepare submission data
    const submissionData = {
      user_id: user.id,
      email: formData.email,
      name: formData.name,
      company: formData.company || null,
      service: formData.service,
      budget: formData.budget || null,
      timeline: formData.timeline || null,
      description: formData.description,
      phone: formData.phone || null,
      website: formData.website || null,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
      user_agent: request.headers.get('user-agent') || null
    }

    // Save to database
    const submission = await Submission.create(submissionData)

    // Send notifications (async, don't wait)
    Promise.all([
      sendSlackNotification(submission),
      logToGoogleSheets(submission),
      sendConfirmationEmail(submission)
    ]).catch(error => {
      console.error("Notification error:", error)
    })

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: "Form submitted successfully",
      data: {
        id: submission.id,
        submittedAt: submission.created_at,
        status: submission.status
      }
    })

  } catch (error) {
    console.error("Form submission error:", error)
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 })
  }
}

async function sendConfirmationEmail(submission) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@smartforms.com',
      to: submission.email,
      subject: 'Form Submission Received - Smart Forms',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Form Submission Received</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Smart Forms</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">Form Submission Received</p>
          </div>

          <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Thank you, ${submission.name}!</h2>

            <p style="margin: 20px 0; color: #666;">We've received your form submission and will get back to you within 24 hours.</p>

            <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 20px; margin: 30px 0;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Submission Details:</h3>
              <p style="margin: 5px 0;"><strong>Service:</strong> ${submission.service}</p>
              <p style="margin: 5px 0;"><strong>Company:</strong> ${submission.company || 'Not specified'}</p>
              <p style="margin: 5px 0;"><strong>Budget:</strong> ${submission.budget || 'Not specified'}</p>
              <p style="margin: 5px 0;"><strong>Timeline:</strong> ${submission.timeline || 'Not specified'}</p>
              <p style="margin: 5px 0;"><strong>Submission ID:</strong> #${submission.id}</p>
            </div>

            <p style="margin: 20px 0; color: #666;">If you have any questions, feel free to reply to this email.</p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #9ca3af; font-size: 14px; margin: 0;">
              Best regards,<br>
              The Smart Forms Team
            </p>
          </div>
        </body>
        </html>
      `,
      text: `Thank you, ${submission.name}!\n\nWe've received your form submission for ${submission.service} and will get back to you within 24 hours.\n\nSubmission ID: #${submission.id}\n\nBest regards,\nThe Smart Forms Team`
    }

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions)
      console.log(`📧 Confirmation email sent to ${submission.email}`)
    } else {
      console.log(`📧 Demo mode - Confirmation email for ${submission.email}`)
    }

  } catch (error) {
    console.error("Confirmation email error:", error)
  }
}

async function sendSlackNotification(data) {
  try {
    console.log(`🔔 Slack notification: New submission from ${data.name}`)

    // In production, use Slack webhook:
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (webhookUrl) {
      const slackMessage = {
        text: `🎉 New Form Submission from ${data.name}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🎉 New Form Submission'
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Name:*\n${data.name}` },
              { type: 'mrkdwn', text: `*Email:*\n${data.email}` },
              { type: 'mrkdwn', text: `*Service:*\n${data.service}` },
              { type: 'mrkdwn', text: `*Company:*\n${data.company || 'Not specified'}` }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Description:*\n${data.description}`
            }
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Submitted: ${new Date(data.submittedAt).toLocaleString()} | ID: ${data.id}`
              }
            ]
          }
        ]
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      })
    }
  } catch (error) {
    console.error("Slack notification error:", error)
  }
}

async function logToGoogleSheets(data: any): Promise<void> {
  // Mock Google Sheets logging
  console.log("Logging to Google Sheets:", data.name)

  // Example Google Sheets API implementation:
  /*
  const sheets = google.sheets({ version: 'v4', auth: googleAuth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'A:Z',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        new Date().toISOString(),
        data.name,
        data.email,
        data.company,
        data.service,
        data.budget,
        data.timeline,
        data.description
      ]]
    }
  })
  */
}

async function sendConfirmationEmail(data: any): Promise<void> {
  // Mock confirmation email
  console.log("Sending confirmation email to:", data.email)

  // Example email implementation:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY)
  
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: data.email,
    subject: 'Project Inquiry Received',
    html: `
      <h2>Thank you for your project inquiry!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your project inquiry and will get back to you within 24 hours.</p>
      <h3>Your submission details:</h3>
      <ul>
        <li><strong>Service:</strong> ${data.service}</li>
        <li><strong>Budget:</strong> ${data.budget || 'Not specified'}</li>
        <li><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</li>
      </ul>
      <p>Best regards,<br>Your Company Team</p>
    `
  })
  */
}
