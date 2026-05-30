import type { Artwork, SiteSettings } from '@/data/artworks'
import { formatServiceAreaLabel } from '@/lib/geo-seo'

const BASE_URL = 'https://ultrastruttura.com'

export function getBaseUrl(): string {
  return BASE_URL
}

/** Rimuove virgolette dal titolo opera per alt text e slug */
export function normalizeArtworkTitle(title: string): string {
  return title.replace(/^["']|["']$/g, '').trim()
}

export function getImageEncodingFormat(imagePath: string): string {
  const ext = imagePath.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'webp':
      return 'image/webp'
    case 'png':
      return 'image/png'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'avif':
      return 'image/avif'
    default:
      return 'image/jpeg'
  }
}

export function parseDimensionsCm(
  dimensions?: string
): { width?: string; height?: string; depth?: string } {
  if (!dimensions) return {}
  const match = dimensions.match(/(\d+)\s*x\s*(\d+)(?:\s*x\s*(\d+))?/i)
  if (!match) return {}
  return {
    width: match[1],
    height: match[2],
    depth: match[3],
  }
}

/** Alt text descrittivo in italiano — ottimizzato per Google Immagini e accessibilità */
export function buildArtworkAltText(artwork: Artwork, settings: SiteSettings): string {
  if (artwork.imageAlt?.trim()) {
    return artwork.imageAlt.trim()
  }

  const title = normalizeArtworkTitle(artwork.title)
  const area = formatServiceAreaLabel(settings)
  const medium = artwork.medium || 'tecnica mista su tela'
  const dims = artwork.dimensions ? `, ${artwork.dimensions}` : ''

  return `Dipinto astratto contemporaneo "${title}" (${artwork.year}) di ${settings.artistName} — ${settings.brandName}, ${medium}${dims}. Opera disponibile per collezionisti e studi professionali in ${area}.`
}

export function buildArtworkDescription(
  artwork: Artwork,
  settings: SiteSettings
): string {
  const title = normalizeArtworkTitle(artwork.title)
  const area = formatServiceAreaLabel(settings)
  const medium = artwork.medium || 'tecnica mista su tela'
  const dims = artwork.dimensions ? `, ${artwork.dimensions}` : ''

  return `Dipinto originale d'arte astratta contemporanea "${title}" (${artwork.year}) di ${settings.artistName} (${settings.brandName}). ${medium}${dims}. Disponibile per collezionisti e commissioni in ${area}.`
}

export function buildVisualArtworkSchema(
  artwork: Artwork,
  settings: SiteSettings,
  baseUrl: string = BASE_URL
) {
  const { width, height, depth } = parseDimensionsCm(artwork.dimensions)
  const imageUrl = `${baseUrl}${artwork.imageFull || artwork.image}`
  const title = normalizeArtworkTitle(artwork.title)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    '@id': `${baseUrl}#artwork-${artwork.id}`,
    name: title,
    alternateName: `${settings.brandName} — ${title} (${artwork.year})`,
    description: buildArtworkDescription(artwork, settings),
    creator: {
      '@type': 'Person',
      '@id': `${baseUrl}#artist`,
      name: settings.artistName,
      alternateName: settings.brandName,
    },
    artist: {
      '@type': 'Person',
      '@id': `${baseUrl}#artist`,
      name: settings.artistName,
      alternateName: settings.brandName,
    },
    dateCreated: artwork.year?.toString(),
    copyrightYear: artwork.year?.toString(),
    artMedium: artwork.medium || 'Tecnica mista su tela',
    artform: 'Painting',
    genre: 'Arte astratta contemporanea',
    artMovement: 'Arte contemporanea',
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      contentUrl: imageUrl,
      encodingFormat: getImageEncodingFormat(artwork.image),
      ...(width && { width }),
      ...(height && { height }),
    },
    ...(width && { width: { '@type': 'QuantitativeValue', value: width, unitCode: 'CMT' } }),
    ...(height && { height: { '@type': 'QuantitativeValue', value: height, unitCode: 'CMT' } }),
    ...(depth && { depth: { '@type': 'QuantitativeValue', value: depth, unitCode: 'CMT' } }),
    copyrightHolder: {
      '@type': 'Person',
      '@id': `${baseUrl}#artist`,
      name: settings.artistName,
    },
    inLanguage: 'it',
    material: artwork.medium || 'Tecnica mista su tela',
    surface: 'Tela',
    contentLocation: artwork.location
      ? {
          '@type': 'Place',
          name: artwork.location,
        }
      : {
          '@type': 'Place',
          name: settings.locality || 'Bergamo',
          address: {
            '@type': 'PostalAddress',
            addressLocality: settings.locality || 'Bergamo',
            addressRegion: settings.region || 'Lombardia',
            addressCountry: 'IT',
          },
        },
    keywords: [
      'dipinto astratto contemporaneo',
      'arte astratta originale',
      settings.brandName.toLowerCase(),
      settings.artistName,
      'Milano',
      settings.locality || 'Bergamo',
      settings.region || 'Lombardia',
      settings.areaServed || 'Nord Italia',
      artwork.medium?.toLowerCase(),
    ]
      .filter(Boolean)
      .join(', '),
  }

  if (artwork.available !== false) {
    schema.offers = {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      areaServed: {
        '@type': 'GeoCircle',
        name: settings.areaServed || 'Nord Italia',
      },
      seller: {
        '@type': 'Person',
        '@id': `${baseUrl}#artist`,
        name: settings.artistName,
      },
    }
  }

  return schema
}
