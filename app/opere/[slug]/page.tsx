import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import {
  artworks,
  findArtworkBySlug,
  getArtworkSlug,
  siteSettings,
} from '@/data/artworks'
import {
  buildArtworkAltText,
  buildArtworkDescription,
  buildVisualArtworkSchema,
  getBaseUrl,
  normalizeArtworkTitle,
} from '@/lib/seo'
import layoutStyles from '../../page.module.css'
import styles from './page.module.css'

export const dynamic = 'force-static'
export const dynamicParams = false

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return artworks.map((artwork) => ({
    slug: getArtworkSlug(artwork),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const artwork = findArtworkBySlug(slug)
  if (!artwork) return {}

  const title = normalizeArtworkTitle(artwork.title)
  const pageUrl = `${getBaseUrl()}/opere/${slug}`
  const description = buildArtworkDescription(artwork, siteSettings)
  const image = artwork.imageFull || artwork.image

  return {
    title: `"${title}" (${artwork.year}) — Dipinto astratto originale | ${siteSettings.brandName}`,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `"${title}" (${artwork.year}) | ${siteSettings.brandName}`,
      description,
      type: 'article',
      url: pageUrl,
      locale: 'it_IT',
      images: [
        {
          url: `https://ultrastruttura.com${image}`,
          alt: buildArtworkAltText(artwork, siteSettings),
        },
      ],
    },
  }
}

export default async function ArtworkPage({ params }: PageProps) {
  const { slug } = await params
  const artwork = findArtworkBySlug(slug)
  if (!artwork) notFound()

  const title = normalizeArtworkTitle(artwork.title)
  const pageUrl = `${getBaseUrl()}/opere/${slug}`
  const schema = buildVisualArtworkSchema(artwork, siteSettings, getBaseUrl(), {
    url: pageUrl,
  })
  const imageSrc = artwork.imageFull || artwork.image

  return (
    <div className={layoutStyles.layout}>
      <a href="#main-content" className={layoutStyles.skipLink}>
        Vai al contenuto
      </a>
      <Navigation />
      <main id="main-content" className={layoutStyles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <article className={styles.page}>
          <div className={styles.container}>
            <figure className={styles.figure}>
              <img
                src={imageSrc}
                alt={buildArtworkAltText(artwork, siteSettings)}
                className={styles.image}
                loading="eager"
                decoding="async"
              />
            </figure>
            <h1 className={styles.h1}>
              {title} ({artwork.year})
            </h1>
            <p className={styles.availability}>
              {artwork.available === false ? 'Venduto' : 'Disponibile'}
              {' · '}
              {siteSettings.artistName} — {siteSettings.brandName}
            </p>
            <p className={styles.meta}>
              {[artwork.medium, artwork.dimensions, artwork.location]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {artwork.info && <p className={styles.info}>{artwork.info}</p>}
            <p className={layoutStyles.srOnly}>
              Opera astratta contemporanea originale per collezionisti, studi professionali,
              interior designer e gallerie. Studio a {siteSettings.locality},{' '}
              {siteSettings.region}; Milano e {siteSettings.areaServed}.
            </p>
            <div className={styles.links}>
              <Link href="/contact" className={styles.link}>
                Richiedi informazioni →
              </Link>
              <Link href="/commissioni" className={styles.link}>
                Commissioni per professionisti →
              </Link>
              <Link href="/" className={styles.link}>
                ← Torna alla galleria
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
