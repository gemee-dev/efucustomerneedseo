"use client"

import { createContext, useContext, type ReactNode } from "react"

interface BrandingConfig {
  primaryColor: string
  secondaryColor: string
  logo: string
  companyName: string
  favicon: string
}

const defaultBranding: BrandingConfig = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  logo: "/logo.png",
  companyName: "Your Company",
  favicon: "/favicon.ico",
}

const BrandingContext = createContext<BrandingConfig>(defaultBranding)

export function BrandingProvider({ children }: { children: ReactNode }) {
  // In a real app, this would come from a database or config
  const branding = defaultBranding

  return (
    <BrandingContext.Provider value={branding}>
      <style jsx global>{`
        :root {
          --primary-color: ${branding.primaryColor};
          --secondary-color: ${branding.secondaryColor};
        }
      `}</style>
      {children}
    </BrandingContext.Provider>
  )
}

export const useBranding = () => useContext(BrandingContext)
