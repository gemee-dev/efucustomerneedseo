"use client"

import Head from "next/head"

export function SEOHead() {
  const siteUrl = "https://customerneedseo.com"
  const title = "Customer Need SEO - Professional SEO & Digital Services"
  const description =
    "Streamline your SEO and digital marketing needs with Customer Need SEO. Get detailed project requirements for SEO services, web development, design, marketing, and digital consulting. Fast, secure, and efficient."
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
      name: "Customer Need SEO",
      url: siteUrl
    }
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="SEO services, search engine optimization, digital marketing, web development, SEO consulting, customer needs analysis, SEO audit, keyword research, local SEO, technical SEO" />
      <meta name="author" content="Customer Need SEO" />
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
      <meta property="og:site_name" content="Customer Need SEO" />
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
