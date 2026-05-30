import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import styles from './page.module.css'
import layoutStyles from '../page.module.css'
import { siteSettings } from '@/data/artworks'

const pageUrl = 'https://ultrastruttura.com/commissioni'
const locality = siteSettings.locality || 'Bergamo'
const region = siteSettings.region || 'Lombardia'
const areaServed = siteSettings.areaServed || 'Nord Italia'
const cities = siteSettings.serviceCities?.join(', ') || 'Milano, Bergamo'

export const metadata: Metadata = {
  title: `Dipinti su misura per uffici e studi | ${siteSettings.brandName} — Milano, ${region}`,
  description: `Commissioni di pittura astratta per uffici e interior design. ${siteSettings.artistName} (${siteSettings.brandName}): studio a ${locality}, consegne a ${cities} e in ${areaServed}.`,
  keywords: [
    'quadri su misura ufficio milano',
    'arte per studi professionali lombardia',
    'commissione dipinto astratto nord italia',
    'pittore per interior designer milano',
    'quadri ufficio bergamo monza',
    'arte contemporanea spazi aziendali',
  ].join(', '),
  robots: { index: true, follow: true },
  alternates: { canonical: pageUrl },
  openGraph: {
    title: `Commissioni — Arte astratta per professionisti | ${siteSettings.brandName}`,
    description: `Dipinti originali su misura per uffici e progetti d'arredo. Milano, ${locality}, ${region}, ${areaServed}.`,
    type: 'website',
    url: pageUrl,
    locale: 'it_IT',
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${pageUrl}#service`,
  name: 'Commissioni dipinti astratti su misura',
  description: `Dipinti astratti su misura per uffici e spazi commerciali. ${siteSettings.artistName} (${siteSettings.brandName}): base ${locality}, servizio a Milano, ${region} e ${areaServed}.`,
  provider: {
    '@type': 'Person',
    '@id': 'https://ultrastruttura.com#artist',
    name: siteSettings.artistName,
    alternateName: siteSettings.brandName,
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: areaServed,
  },
  serviceType: 'Commissione artistica — pittura astratta',
  url: pageUrl,
}

export default function CommissioniPage() {
  return (
    <div className={layoutStyles.layout}>
      <a href="#main-content" className={layoutStyles.skipLink}>
        Vai al contenuto
      </a>
      <Navigation />
      <main id="main-content" className={layoutStyles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <article className={styles.page}>
          <div className={styles.container}>
            <h1 className={styles.h1}>
              Dipinti astratti su misura per uffici, studi e progetti d&apos;arredo
            </h1>
            <p className={styles.lead}>
              {siteSettings.artistName} — {siteSettings.brandName} — opere originali di pittura
              astratta per uffici e progetti d&apos;arredo. Studio a {locality}; consegne a{' '}
              {cities} e in {areaServed}.
            </p>

            <h2 className={styles.sectionTitle}>Per chi</h2>
            <ul className={styles.list}>
              <li>Studi professionali, uffici e sedi aziendali</li>
              <li>Interior designer e architetti che cercano un pezzo unico per un progetto</li>
              <li>Collezionisti privati con spazi da valorizzare</li>
              <li>Hotel, showroom e ambienti commerciali</li>
            </ul>

            <h2 className={styles.sectionTitle}>Come funziona</h2>
            <p className={styles.text}>
              Ogni commissione parte dal contesto: dimensioni della parete, luce naturale,
              palette esistente e carattere dello spazio. Si definisce insieme formato, tecnica
              (olio, acrilico, mixed media su tela) e tempi. L&apos;opera è un originale firmato,
              non una stampa.
            </p>
            <ol className={styles.list}>
              <li>Brief iniziale (spazio, referenze, budget indicativo)</li>
              <li>Proposta di dimensioni e direzione cromatica</li>
              <li>Realizzazione in studio a {locality}</li>
              <li>Consegna o installazione in Lombardia, Milano e Nord Italia</li>
            </ol>

            <h2 className={styles.sectionTitle}>Perché un artista del territorio</h2>
            <p className={styles.text}>
              Base operativa a {locality}, a pochi minuti da Milano e dal cuore della Lombardia:
              sopralluoghi, tempi rapidi e rapporto diretto con studi, architetti e interior
              designer. Ideale per uffici e spazi in Milano, Monza, Brescia, Como, Bergamo, Verona,
              Torino e in tutto il {areaServed} — con opere dalla materia e dalla struttura tipiche
              della ricerca Ultrastruttura.
            </p>

            <div className={styles.cta}>
              <p className={styles.text}>
                Per una proposta su misura, scrivi con indicazioni su spazio e dimensioni:
              </p>
              <a href="mailto:andrea.baldelli@icloud.com" className={styles.email}>
                andrea.baldelli@icloud.com
              </a>
              <Link href="/contact" className={styles.back}>
                Oppure usa il modulo contatti →
              </Link>
              <Link href="/" className={styles.back}>
                ← Torna alla galleria
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
