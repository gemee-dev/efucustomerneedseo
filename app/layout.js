import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Efuyegela - Creative Ecosystem & Software Development | Publishers, Consultants, Intelligence & Events",
  description:
    "Efuyegela connects creators and provides comprehensive solutions through our six divisions plus software development: Publishers, Consultants, Collectives, Intelligence, Events, Content, and custom software solutions. We help creatives shape ideas, raise funds, find markets, and create value through technology.",
  keywords: "Efuyegela, creative ecosystem, software development, web development, mobile apps, publishers, consultants, intelligence, events, content, collectives, creative solutions, ecosystem mapping, product development, service delivery",
  authors: [{ name: "Efuyegela" }],
  openGraph: {
    title: "Efuyegela - Creative Ecosystem & Software Development",
    description: "Efuyegela connects creators and provides comprehensive solutions through Publishers, Consultants, Collectives, Intelligence, Events, Content divisions plus custom software development.",
    type: "website",
    url: "https://efuyegela.com",
    images: [
      {
        url: "https://efuyegela.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Efuyegela - Creative Ecosystem & Software Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Efuyegela - Creative Ecosystem & Software Development",
    description: "Efuyegela connects creators and provides comprehensive solutions through our six divisions plus software development: Publishers, Consultants, Intelligence, Events, and more.",
    images: ["https://efuyegela.com/twitter-image.jpg"],
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

}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
