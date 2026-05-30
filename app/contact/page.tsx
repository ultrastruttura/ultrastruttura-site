import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import Navigation from '@/components/Navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import styles from './page.module.css'
import layoutStyles from '../page.module.css'

export const metadata: Metadata = {
  title: 'Contatti | Ultrastruttura — Andrea Baldelli, Bergamo, Lombardia',
  description:
    'Contatta Andrea Baldelli (Ultrastruttura) per acquisto opere, commissioni su misura e collaborazioni con studi e interior designer. Artista a Bergamo, attivo in Lombardia e Nord Italia.',
  keywords: [
    'contatta ultrastruttura',
    'commissione dipinto bergamo',
    'arte per uffici lombardia',
    'quadri su misura nord italia',
    'artista astratto bergamo',
    'collaborazione interior designer',
    'commissione artistica',
  ].join(', '),
  openGraph: {
    title: 'Contatti | Ultrastruttura — Andrea Baldelli, Bergamo',
    description:
      'Richiedi informazioni su opere originali, commissioni e collaborazioni professionali. Artista contemporaneo a Bergamo, Lombardia e Nord Italia.',
    type: 'website',
    url: 'https://ultrastruttura.com/contact',
  },
  alternates: {
    canonical: 'https://ultrastruttura.com/contact',
  },
}

export default function Contact() {
  return (
    <div className={layoutStyles.layout}>
      <a href="#main-content" className={layoutStyles.skipLink}>
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content" className={layoutStyles.main}>
        <Breadcrumbs />
        <div className={styles.contact}>
          <div className={styles.contactContainer}>
            <div className={styles.info}>
              <h1 className={styles.name}>Andrea</h1>
              <p className={styles.location}>Studio: Bergamo — Milano, Lombardia, Nord Italia</p>
              <a href="mailto:andrea.baldelli@icloud.com" className={styles.email}>
                andrea.baldelli@icloud.com
              </a>
              
              <div className={styles.usedToBe}>
                <p className={styles.label}>Used to be:</p>
                <ul className={styles.links}>
                  <li>
                    <a href="https://ccoorrppoocc.wordpress.com/" target="_blank" rel="noopener noreferrer">
                      CORPOC
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/satellitepress/" target="_blank" rel="noopener noreferrer">
                      Satellite Press
                    </a>
                  </li>
                  <li>
                    <a href="https://www.discogs.com/label/152921-TDD-Records?page=1" target="_blank" rel="noopener noreferrer">
                      TDD records
                    </a>
                  </li>
                </ul>
              </div>

              <div className={styles.social}>
                <a
                  href="https://www.instagram.com/ultrastruttura/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.instagramLink}
                  aria-label="Instagram"
                >
                  <svg
                    className={styles.instagramIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.formSection}>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

