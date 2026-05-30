import siteContentData from './site-content.json'

export interface Artwork {
  id: number
  title: string
  info?: string
  year: number
  medium?: string
  dimensions?: string
  location?: string
  image: string
  imageFull?: string
  imageAlt?: string
  available?: boolean
}

export interface SiteSettings {
  brandName: string
  artistName: string
  artistLabel: string
  seoTitle: string
  seoDescription: string
  locality?: string
  region?: string
  areaServed?: string
  serviceCities?: string[]
}

interface SocialLinks {
  instagram: string
  twitterHandle: string
}

interface SiteContent {
  site?: Partial<SiteSettings>
  social?: Partial<SocialLinks>
  artworks?: Array<Partial<Artwork>>
}

const parseOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

const parseAvailability = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['false', '0', 'venduto', 'sold', 'no', 'non disponibile'].includes(normalized)) {
      return false
    }
    if (['true', '1', 'disponibile', 'available', 'si', 'sì', 'yes'].includes(normalized)) {
      return true
    }
  }

  // Default coerente con il CMS: se assente, l'opera e' considerata disponibile.
  return true
}

const content = siteContentData as SiteContent

const defaultSiteSettings: SiteSettings = {
  brandName: 'UltraStruttura',
  artistName: 'Andrea Baldelli',
  artistLabel: 'Andrea Baldelli',
  seoTitle: 'Ultrastruttura | Pittura Astratta Contemporanea di Andrea Baldelli',
  seoDescription:
    'Dipinti astratti contemporanei originali di Andrea Baldelli (Ultrastruttura), artista a Bergamo, Lombardia. Opere su tela per collezionisti, studi professionali e commissioni in Nord Italia.',
  locality: 'Bergamo',
  region: 'Lombardia',
  areaServed: 'Nord Italia',
  serviceCities: ['Milano', 'Bergamo', 'Brescia', 'Monza', 'Como'],
}

export const siteSettings: SiteSettings = {
  brandName: content.site?.brandName || defaultSiteSettings.brandName,
  artistName: content.site?.artistName || defaultSiteSettings.artistName,
  artistLabel: content.site?.artistLabel || defaultSiteSettings.artistLabel,
  seoTitle: content.site?.seoTitle || defaultSiteSettings.seoTitle,
  seoDescription: content.site?.seoDescription || defaultSiteSettings.seoDescription,
  locality: parseOptionalString(content.site?.locality) || defaultSiteSettings.locality,
  region: parseOptionalString(content.site?.region) || defaultSiteSettings.region,
  areaServed: parseOptionalString(content.site?.areaServed) || defaultSiteSettings.areaServed,
  serviceCities: Array.isArray(content.site?.serviceCities)
    ? content.site.serviceCities.filter((c): c is string => typeof c === 'string' && c.trim() !== '')
    : defaultSiteSettings.serviceCities,
}

export const socialLinks: SocialLinks = {
  instagram: content.social?.instagram || 'https://www.instagram.com/ultrastruttura/',
  twitterHandle: content.social?.twitterHandle || '@ultrastruttura',
}

const rawArtworks = Array.isArray(content.artworks) ? content.artworks : []

export const artworks: Artwork[] = rawArtworks
  .reduce<Artwork[]>((items, artwork, index) => {
    const image = parseOptionalString(artwork.image) || ''
    const imageFull = parseOptionalString(artwork.imageFull) || ''
    if (!image) return items

    items.push({
      id: typeof artwork.id === 'number' ? artwork.id : index + 1,
      title: parseOptionalString(artwork.title) || `Opera ${index + 1}`,
      info: parseOptionalString(artwork.info),
      year: typeof artwork.year === 'number' ? artwork.year : new Date().getFullYear(),
      medium: parseOptionalString(artwork.medium),
      dimensions: parseOptionalString(artwork.dimensions),
      location: parseOptionalString(artwork.location),
      image,
      imageFull: imageFull || undefined,
      imageAlt: parseOptionalString(artwork.imageAlt),
      available: parseAvailability(artwork.available),
    })

    return items
  }, [])
  
