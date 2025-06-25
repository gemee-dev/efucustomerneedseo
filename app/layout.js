import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Professional Forms - Get Your Project Started",
  description:
    "Submit your project requirements through our professional intake form system. Get personalized quotes for web development, design, marketing, and consulting services.",
  keywords: "web development, design, marketing, consulting, project intake, quote request, professional forms, client onboarding",
  authors: [{ name: "Professional Forms" }],
  openGraph: {
    title: "Professional Forms - Get Your Project Started",
    description: "Submit your project requirements through our professional intake form system.",
    type: "website",
    url: "https://professionalforms.com",
    images: [
      {
        url: "https://professionalforms.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Professional Forms System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Forms - Get Your Project Started",
    description: "Submit your project requirements through our professional intake form system.",
    images: ["https://professionalforms.com/og-image.jpg"],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
