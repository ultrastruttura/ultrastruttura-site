import type { Metadata } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import ScrollProgress from '@/components/ScrollProgress'
import ErrorBoundary from '@/components/ErrorBoundary'
import GoogleSearchConsole from '@/components/GoogleSearchConsole'
import { siteSettings, socialLinks } from '@/data/artworks'

export const metadata: Metadata = {
  title: siteSettings.seoTitle,
  description: siteSettings.seoDescription,
  keywords: [
    'ultrastruttura',
    'andrea baldelli pittore',
    'dipinto astratto bergamo',
    'arte astratta lombardia',
    'pittura astratta nord italia',
    'quadri per uffici bergamo',
    'commissioni artistiche lombardia',
    'original contemporary abstract painting',
    'dipinto astratto contemporaneo originale',
    'opera arte astratta unica',
    'dipinto astratto su tela',
    'arte astratta per collezionisti',
    'peinture abstraite contemporaine originale',
    'œuvre d\'art abstraite unique',
    'peinture abstraite sur toile',
    'art abstrait pour collectionneurs',
    'originales zeitgenössisches abstraktes Gemälde',
    'einzigartiges abstraktes Kunstwerk',
    'abstraktes Gemälde auf Leinwand',
    'abstrakte Kunst für Sammler',
    'contemporary art',
    'arte contemporanea',
    'zeitgenössische kunst',
    'art contemporain',
    'paintings',
    'dipinti',
    'gemälde',
    'peintures',
    'oil paintings',
    'olio su tela',
    'Italian artist',
    'artista italiano',
  ].join(', '),
  authors: [{ name: siteSettings.artistName }],
  creator: siteSettings.brandName,
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
    alternateLocale: ['en_US', 'de_DE', 'fr_FR', 'ja_JP'],
    siteName: 'ultrastruttura',
    url: 'https://ultrastruttura.com',
    images: [
      {
        url: 'https://ultrastruttura.com/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Ultrastruttura — Pittura astratta contemporanea di Andrea Baldelli, Bergamo, Lombardia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteSettings.seoTitle,
    description: siteSettings.seoDescription,
    creator: socialLinks.twitterHandle,
    images: ['https://ultrastruttura.com/logo.webp'],
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
      'en': 'https://ultrastruttura.com',
      'de': 'https://ultrastruttura.com',
      'fr': 'https://ultrastruttura.com',
      'ja': 'https://ultrastruttura.com',
    },
    types: {
      'application/rss+xml': [{ url: 'https://ultrastruttura.com', title: 'UltraStruttura Artworks' }],
    },
  },
  category: 'Art',
  classification: 'Contemporary Abstract Art',
  referrer: 'origin-when-cross-origin',
  applicationName: 'UltraStruttura',
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
        
        {/* Resource hints per performance */}
        <link rel="preconnect" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        
        {/* Preload del logo critico */}
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
