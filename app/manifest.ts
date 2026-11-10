import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ultrastruttura — Pittura astratta contemporanea',
    short_name: 'Ultrastruttura',
    description:
      'Dipinti astratti contemporanei di Andrea Baldelli. Milano, Lombardia, Nord Italia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    lang: 'it',
    dir: 'ltr',
    orientation: 'portrait',
  }
}
