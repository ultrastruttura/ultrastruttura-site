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
const DEFAULT_WEBSITE_ID = '931562eb-5ba8-485f-a4d7-69b9a59ba2b3'
const DEFAULT_SCRIPT_URL = 'https://cloud.umami.is/script.js'

export default function UmamiAnalytics() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || DEFAULT_WEBSITE_ID
  const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || DEFAULT_SCRIPT_URL

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
      defer
    />
  )
}
