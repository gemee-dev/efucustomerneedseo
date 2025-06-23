import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Intake Form - Get Your Project Started",
  description:
    "Submit your project requirements through our smart intake form. Get personalized quotes for web development, design, marketing, and consulting services.",
  keywords: "web development, design, marketing, consulting, project intake, quote request",
  authors: [{ name: "Your Company" }],
  openGraph: {
    title: "Smart Intake Form - Get Your Project Started",
    description: "Submit your project requirements through our smart intake form.",
    type: "website",
    url: "https://your-domain.com",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Intake Form",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Intake Form - Get Your Project Started",
    description: "Submit your project requirements through our smart intake form.",
    images: ["https://your-domain.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
