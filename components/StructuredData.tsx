import { artworks, siteSettings, socialLinks } from '@/data/artworks'
import { buildVisualArtworkSchema, getBaseUrl } from '@/lib/seo'

export default function StructuredData() {
  const baseUrl = getBaseUrl()
  const locality = siteSettings.locality || 'Bergamo'
  const region = siteSettings.region || 'Lombardia'
  const areaServed = siteSettings.areaServed || 'Nord Italia'
  const cities = siteSettings.serviceCities?.join(', ') || 'Milano, Bergamo'

  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    '@id': `${baseUrl}#gallery`,
    name: siteSettings.brandName,
    alternateName: siteSettings.artistName,
    description: siteSettings.seoDescription,
    url: baseUrl,
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.webp`,
      contentUrl: `${baseUrl}/logo.webp`,
    },
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.webp`,
      contentUrl: `${baseUrl}/logo.webp`,
    },
    sameAs: [socialLinks.instagram],
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      addressRegion: region,
      addressCountry: 'IT',
    },
    areaServed: [
      { '@type': 'City', name: 'Milano' },
      { '@type': 'City', name: locality },
      { '@type': 'AdministrativeArea', name: region },
      { '@type': 'AdministrativeArea', name: areaServed },
    ],
    founder: {
      '@type': 'Person',
      '@id': `${baseUrl}#artist`,
      name: siteSettings.artistName,
    },
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}#artist`,
    name: siteSettings.artistName,
    alternateName: siteSettings.brandName,
    givenName: siteSettings.artistName.split(' ')[0] || siteSettings.artistName,
    familyName:
      siteSettings.artistName.split(' ').slice(1).join(' ') || siteSettings.artistName,
    jobTitle: 'Artista contemporaneo — pittura astratta',
    description: `Artista contemporaneo con studio a ${locality}, ${region}. Dipinti astratti su tela per collezionisti e professionisti a ${cities} e in ${areaServed}.`,
    url: baseUrl,
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.webp`,
      contentUrl: `${baseUrl}/logo.webp`,
    },
    sameAs: [socialLinks.instagram],
    homeLocation: {
      '@type': 'Place',
      name: `${locality}, ${region}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: locality,
        addressRegion: region,
        addressCountry: 'IT',
      },
    },
    nationality: {
      '@type': 'Country',
      name: 'Italia',
    },
    knowsAbout: [
      'Arte astratta contemporanea',
      'Pittura su tela',
      'Commissioni artistiche',
      'Arte per interni',
    ],
    workLocation: [
      { '@type': 'Place', name: `Milano, ${region}` },
      { '@type': 'Place', name: areaServed },
    ],
  }

  const artworksSchema = artworks.map((artwork) =>
    buildVisualArtworkSchema(artwork, siteSettings, baseUrl)
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      {artworksSchema.map((schema, index) => (
        <script
          key={artworks[index]?.id ?? index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Contatti',
                item: `${baseUrl}/contact`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${baseUrl}#collection`,
            name: `Collezione ${siteSettings.brandName}`,
            description: `Collezione di dipinti astratti contemporanei di ${siteSettings.artistName} (${siteSettings.brandName}), ${locality}, ${region}.`,
            url: baseUrl,
            inLanguage: 'it',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: artworks.length,
              itemListElement: artworks.map((artwork, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'VisualArtwork',
                  '@id': `${baseUrl}#artwork-${artwork.id}`,
                  name: artwork.title.replace(/^["']|["']$/g, '').trim(),
                },
              })),
            },
          }),
        }}
      />
    </>
  )
}
