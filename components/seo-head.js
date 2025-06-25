"use client"

import Head from "next/head"

export function SEOHead() {
  const siteUrl = "https://customerneedseo.com"
  const title = "Customer Need SEO - Technology-Based SEO Events & Consultancy Solutions"
  const description =
    "Technology-driven SEO events and consultancy services by Customer Need SEO. Expert SEO consulting, digital marketing events, strategic technology solutions, and advanced search optimization guidance for businesses seeking cutting-edge SEO expertise."
  const image = `${siteUrl}/og-image.jpg`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Customer Need SEO",
    description: description,
    url: siteUrl,
    serviceType: "Technology-Based SEO Consultancy & Events",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Technology-Based SEO Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SEO Technology Consulting",
            description: "Advanced technology-driven SEO consulting and strategy development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Digital Marketing Events",
            description: "SEO workshops, seminars, and digital marketing events"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Technical SEO Solutions",
            description: "Technology-based technical SEO implementation and optimization"
          }
        }
      ]
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150"
    },
    provider: {
      "@type": "Organization",
      name: "Customer Need SEO",
      url: siteUrl,
      sameAs: [
        "https://www.linkedin.com/company/customer-need-seo",
        "https://twitter.com/customerneedseo"
      ]
    }
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Customer Need SEO, technology-based SEO, SEO events, SEO consultancy, digital marketing consulting, SEO technology solutions, search optimization events, SEO strategy consulting, technical SEO services, SEO workshops, digital marketing events" />
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
