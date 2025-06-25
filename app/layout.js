import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Customer Need SEO - Technology-Based SEO Events & Consultancy Services",
  description:
    "Technology-driven SEO events and consultancy services by Customer Need SEO. Expert SEO consulting, digital marketing events, technology solutions, and strategic SEO guidance for businesses seeking advanced search optimization.",
  keywords: "Customer Need SEO, technology-based SEO, SEO events, SEO consultancy, digital marketing consulting, SEO technology solutions, search optimization events, SEO strategy consulting, technical SEO services",
  authors: [{ name: "Customer Need SEO" }],
  openGraph: {
    title: "Customer Need SEO - Technology-Based SEO Events & Consultancy",
    description: "Technology-driven SEO events and consultancy services. Expert SEO consulting, digital marketing events, and strategic technology solutions for advanced search optimization.",
    type: "website",
    url: "https://customerneedseo.com",
    images: [
      {
        url: "https://customerneedseo.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Customer Need SEO - Professional SEO Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Customer Need SEO - Technology-Based SEO Events & Consultancy",
    description: "Technology-driven SEO events and consultancy services. Expert SEO consulting and strategic technology solutions for businesses.",
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
