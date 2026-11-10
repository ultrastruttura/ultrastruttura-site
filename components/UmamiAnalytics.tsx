import Script from 'next/script'

/**
 * Umami Analytics (privacy-friendly).
 *
 * Local (.env.local):
 *   NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *   NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
 *
 * GitHub Actions secrets (build):
 *   UMAMI_WEBSITE_ID
 *   UMAMI_SCRIPT_URL  (opzionale; default cloud.umami.is)
 *
 * Self-hosted: usa l'URL del tuo script, es. https://analytics.tuodominio.com/script.js
 */
export default function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const scriptUrl =
    process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js'

  if (!websiteId) return null

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
      defer
    />
  )
}
