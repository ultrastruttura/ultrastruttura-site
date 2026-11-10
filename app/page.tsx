import Gallery from '@/components/Gallery'
import Navigation from '@/components/Navigation'
import styles from './page.module.css'
import { siteSettings } from '@/data/artworks'

export default function Home() {
  const locality = siteSettings.locality || 'Bergamo'
  const region = siteSettings.region || 'Lombardia'
  const area = siteSettings.areaServed || 'Nord Italia'

  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        Vai al contenuto
      </a>
      <Navigation />
      <main id="main-content" className={styles.main}>
        <h1 className={styles.srOnly}>
          {siteSettings.brandName} — Pittura astratta contemporanea di {siteSettings.artistName}.
          Opere originali e commissioni per studi, interior designer, collezionisti e gallerie.
          Studio a {locality}, {region}; Milano e {area}.
        </h1>
        <p className={styles.srOnly}>
          Galleria di dipinti astratti contemporanei su tela e pezzi materici su zinco.
          Collaborazioni professionali in Lombardia, Nord Italia e con gallerie internazionali.
        </p>
        <Gallery />
      </main>
    </div>
  )
}
