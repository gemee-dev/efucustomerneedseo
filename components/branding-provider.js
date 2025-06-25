"use client"

import { createContext, useContext } from "react"

const defaultBranding = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  logo: "/logo.png",
  companyName: "Your Company",
  favicon: "/favicon.ico",
}

const BrandingContext = createContext(defaultBranding)

export function BrandingProvider({ children }) {
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
