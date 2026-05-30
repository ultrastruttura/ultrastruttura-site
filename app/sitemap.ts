import { MetadataRoute } from 'next'
import { artworks } from '@/data/artworks'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ultrastruttura.com'
  const now = new Date()

  const routes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/commissioni`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ]

  // Nota: Le route per singole opere sono incluse solo se esistono pagine individuali
  // Altrimenti le opere sono tutte sulla home page, quindi non le aggiungiamo qui
  // Se in futuro aggiungi pagine individuali per ogni opera, decommenta questo:
  // const artworkRoutes = artworks.map((artwork) => ({
  //   url: `${baseUrl}/artwork/${artwork.id}`,
  //   lastModified: now,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }))
  // return [...routes, ...artworkRoutes]

  return routes
}



