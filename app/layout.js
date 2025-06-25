import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Customer Need SEO - Get Your Project Started",
  description:
    "Submit your project requirements through Customer Need SEO intake form system. Get personalized quotes for SEO services, web development, design, marketing, and digital consulting.",
  keywords: "SEO services, search engine optimization, web development, digital marketing, SEO consulting, project intake, quote request, customer needs, SEO analysis",
  authors: [{ name: "Customer Need SEO" }],
  openGraph: {
    title: "Customer Need SEO - Get Your Project Started",
    description: "Submit your project requirements through Customer Need SEO intake form system.",
    type: "website",
    url: "https://customerneedseo.com",
    images: [
      {
        url: "https://customerneedseo.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Customer Need SEO System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Need SEO - Get Your Project Started",
    description: "Submit your project requirements through Customer Need SEO intake form system.",
    images: ["https://customerneedseo.com/og-image.jpg"],
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
