import { ARCHIVE_GEO_ROTATION, getArtworkGeoTag } from './geo-seo'

export function normalizeArtworkTitle(title: string): string {
  return title.replace(/^["']|["']$/g, '').trim()
}

export function slugifyArtworkTitle(title: string, maxLength = 48): string {
  const slug = normalizeArtworkTitle(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (slug.length <= maxLength) return slug
  return slug.slice(0, maxLength).replace(/-+$/, '')
}

export function buildArtworkImageFilename(title: string, year: number, artworkId: number): string {
  const slug = slugifyArtworkTitle(title)
  const geo = getArtworkGeoTag(artworkId)
  return `${slug}-dipinto-astratto-contemporaneo-${geo}-${year}-ultrastruttura.webp`
}

export function buildLegacyImageFilename(oldFilename: string): string {
  const numMatch = oldFilename.match(/-(\d{2})-/)
  const num = parseInt(numMatch?.[1] ?? '0', 10)
  const geo = ARCHIVE_GEO_ROTATION[num % ARCHIVE_GEO_ROTATION.length]

  if (oldFilename.startsWith('original-contemporary-abstract-painting')) {
    return `dipinto-astratto-contemporaneo-archivio-${numMatch?.[1] ?? '00'}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('original-abstract-painting-on-canvas')) {
    return `dipinto-astratto-su-tela-archivio-${numMatch?.[1] ?? '00'}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('unique-abstract-artwork')) {
    return `opera-arte-astratta-unica-archivio-${numMatch?.[1] ?? '00'}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('contemporary-abstract-art-for-collectors')) {
    return `arte-astratta-collezionisti-archivio-${numMatch?.[1] ?? '00'}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('dipinto-astratto') || oldFilename.startsWith('arte-astratta') || oldFilename.startsWith('opera-arte')) {
    return oldFilename.replace(/-bergamo-/, `-${geo}-`).replace(/-lombardia-ultrastruttura/, `-${geo}-ultrastruttura`)
  }

  const base = oldFilename.replace(/\.[^.]+$/, '').slice(0, 40)
  return `opera-archivio-${base}-${geo}-ultrastruttura.webp`.replace(/[^a-z0-9.-]+/g, '-')
}
