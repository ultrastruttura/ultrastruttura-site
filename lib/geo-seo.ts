/** Tag geografici per SEO locale — Nord Italia, non solo Bergamo */

export const GEO_TAGS = {
  milanoLombardia: 'milano-lombardia',
  milanoNordItalia: 'milano-nord-italia',
  lombardiaNordItalia: 'lombardia-nord-italia',
  nordItaliaLombardia: 'nord-italia-lombardia',
  bergamoLombardia: 'bergamo-lombardia',
  milanoBergamoLombardia: 'milano-bergamo-lombardia',
  veneto: 'veneto-nord-italia',
  piemonte: 'piemonte-nord-italia',
} as const

/** Rotazione per file archivio (evita ripetere sempre lo stesso slug) */
export const ARCHIVE_GEO_ROTATION = [
  GEO_TAGS.milanoLombardia,
  GEO_TAGS.lombardiaNordItalia,
  GEO_TAGS.milanoNordItalia,
  GEO_TAGS.nordItaliaLombardia,
  GEO_TAGS.veneto,
  GEO_TAGS.piemonte,
] as const

/** Tag file immagine per opera in catalogo (id stabile → slug stabile) */
export function getArtworkGeoTag(artworkId: number): string {
  switch (artworkId) {
    case 260504:
      return GEO_TAGS.milanoLombardia
    case 260210:
      return GEO_TAGS.lombardiaNordItalia
    case 3:
      return GEO_TAGS.milanoNordItalia
    case 4:
      return GEO_TAGS.milanoLombardia
    case 6:
      return GEO_TAGS.nordItaliaLombardia
    case 18:
      return GEO_TAGS.milanoBergamoLombardia
    default:
      return GEO_TAGS.lombardiaNordItalia
  }
}

export function formatServiceAreaLabel(settings: {
  locality?: string
  region?: string
  areaServed?: string
  serviceCities?: string[]
}): string {
  const cities = settings.serviceCities?.length
    ? settings.serviceCities.join(', ')
    : 'Milano, Bergamo'
  const region = settings.region || 'Lombardia'
  const area = settings.areaServed || 'Nord Italia'
  const base = settings.locality || 'Bergamo'
  return `${base}, ${cities}, ${region}, ${area}`
}
