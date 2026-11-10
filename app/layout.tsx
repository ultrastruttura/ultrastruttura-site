import type { Metadata } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import ScrollProgress from '@/components/ScrollProgress'
import ErrorBoundary from '@/components/ErrorBoundary'
import GoogleSearchConsole from '@/components/GoogleSearchConsole'
import { artworks, siteSettings, socialLinks } from '@/data/artworks'

const ogArtwork =
  artworks.find((a) => a.id === 260504)?.image ||
  artworks[0]?.image ||
  '/logo.webp'

export const metadata: Metadata = {
  title: siteSettings.seoTitle,
  description: siteSettings.seoDescription,
  keywords: [
    'ultrastruttura',
    'andrea baldelli',
    'pittura astratta contemporanea',
    'dipinto astratto milano',
    'arte astratta lombardia',
    'pittura astratta nord italia',
    'quadri per uffici milano',
    'commissioni artistiche lombardia',
    'arte per interior designer',
    'dipinto astratto originale',
    'opera su zinco resina epossidica',
    'contemporary abstract painting italy',
    'italian abstract artist bergamo',
    'art for galleries and collectors',
  ].join(', '),
  authors: [{ name: siteSettings.artistName }],
  creator: siteSettings.artistName,
  publisher: siteSettings.brandName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.webp',
    apple: '/favicon.webp',
  },
  openGraph: {
    title: siteSettings.seoTitle,
    description: siteSettings.seoDescription,
    type: 'website',
    locale: 'it_IT',
    alternateLocale: ['en_US'],
    siteName: siteSettings.brandName,
    url: 'https://ultrastruttura.com',
    images: [
      {
        url: `https://ultrastruttura.com${ogArtwork}`,
        width: 1200,
        height: 1600,
        alt: 'Ultrastruttura — pittura astratta contemporanea di Andrea Baldelli, Milano e Nord Italia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteSettings.seoTitle,
    description: siteSettings.seoDescription,
    creator: socialLinks.twitterHandle || undefined,
    images: [`https://ultrastruttura.com${ogArtwork}`],
  },
  other: {
    'instagram:creator': '@ultrastruttura',
    ...(process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION && {
      'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_VERIFICATION,
    }),
  },
  alternates: {
    canonical: 'https://ultrastruttura.com',
    languages: {
      'it': 'https://ultrastruttura.com',
      'x-default': 'https://ultrastruttura.com',
    },
  },
  category: 'Art',
  classification: 'Contemporary Abstract Art',
  referrer: 'origin-when-cross-origin',
  applicationName: 'Ultrastruttura',
  generator: 'Next.js',
  metadataBase: new URL('https://ultrastruttura.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <GoogleSearchConsole />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="canonical" href="https://ultrastruttura.com" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link
          rel="preload"
          href="/logo.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/favicon.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body>
        <ErrorBoundary>
          <StructuredData />
          <ScrollProgress />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
