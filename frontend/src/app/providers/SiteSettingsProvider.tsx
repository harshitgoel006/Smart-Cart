import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getJson } from '../../services/apiClient'

export type SiteSettings = {
  brand?: { logoUrl?: string; faviconUrl?: string; email?: string; phone?: string; address?: string }
  announcement?: { enabled?: boolean; text?: string; code?: string }
  theme?: { primaryColor?: string; backgroundColor?: string; accentColor?: string; headingFont?: string; bodyFont?: string }
  features?: { aiRecommendations?: boolean; askAi?: boolean; wishlist?: boolean; reviews?: boolean; coupons?: boolean }
  homepage?: { heroSlides?: Array<{ imageUrl?: string; eyebrow?: string; title?: string; description?: string; ctaLabel?: string; ctaLink?: string; enabled?: boolean; order?: number }>; sections?: Array<{ key: string; enabled?: boolean; order?: number }> }
  seo?: { title?: string; description?: string; ogImage?: string }
  maintenanceMode?: boolean
}

const SiteSettingsContext = createContext<SiteSettings>({})
export const useSiteSettings = () => useContext(SiteSettingsContext)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({})
  useEffect(() => {
    getJson<SiteSettings>('/site-settings').then(setSettings).catch(() => undefined)
  }, [])
  useEffect(() => {
    const theme = settings.theme
    if (theme) {
      const root = document.documentElement
      if (theme.primaryColor) root.style.setProperty('--admin-primary', theme.primaryColor)
      if (theme.backgroundColor) root.style.setProperty('--site-background', theme.backgroundColor)
      if (theme.accentColor) root.style.setProperty('--site-accent', theme.accentColor)
    }
    if (settings.seo?.title) document.title = settings.seo.title
    if (settings.brand?.faviconUrl) {
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]') || document.createElement('link')
      link.rel = 'icon'; link.href = settings.brand.faviconUrl; document.head.appendChild(link)
    }
  }, [settings])
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}
