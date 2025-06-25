"use client"

import Head from "next/head"

export function SEOHead() {
  const siteUrl = "https://smartforms.com"
  const title = "Smart Forms - Professional Project Intake System"
  const description =
    "Streamline your client onboarding with our professional intake form system. Get detailed project requirements for web development, design, marketing, and consulting services. Fast, secure, and efficient."
  const image = `${siteUrl}/og-image.jpg`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description: description,
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      category: "Professional Services",
      availability: "https://schema.org/InStock",
      priceRange: "$$"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150"
    },
    provider: {
      "@type": "Organization",
      name: "Smart Forms",
      url: siteUrl
    }
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="project intake form, client onboarding, web development quotes, design services, marketing consultation, business forms, professional services, project management" />
      <meta name="author" content="Smart Forms" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content="Smart Forms" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
    </Head>
  )
}
