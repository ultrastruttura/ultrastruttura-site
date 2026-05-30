'use client'

import { useEffect, useRef } from 'react'
import styles from './ImageModal.module.css'
import { Artwork, siteSettings } from '@/data/artworks'
import { buildArtworkAltText } from '@/lib/seo'

interface ImageModalProps {
  artwork: Artwork | null
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
}

export default function ImageModal({
  artwork,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: ImageModalProps) {
  const modalImageSrc = artwork?.imageFull || artwork?.image || ''

  // Focus trap e keyboard navigation
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const scrollPositionRef = useRef<number>(0)

  useEffect(() => {
    if (isOpen) {
      // Salva la posizione di scroll corrente prima di bloccare lo scroll
      scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
      document.body.style.overflow = 'hidden'
      // Previeni scroll mantenendo la posizione con position fixed
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
    } else {
      // Ripristina gli stili del body
      document.body.style.overflow = 'unset'
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      // Ripristina la posizione di scroll dopo che gli stili sono stati rimossi
      // Usa doppio requestAnimationFrame per assicurarsi che il DOM sia completamente aggiornato
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPositionRef.current)
        })
      })
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext()
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        onPrevious()
      } else if (e.key === 'Tab') {
        // Focus trap: mantiene il focus dentro il modal
        if (!modalRef.current) return
        
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    if (isOpen) {
      // Salva l'elemento attivo prima di aprire il modal
      previousActiveElementRef.current = document.activeElement as HTMLElement
      
      window.addEventListener('keydown', handleKeyDown)
      
      // Focus sul primo elemento focusabile del modal
      setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        firstFocusable?.focus()
      }, 100)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      // Ripristina il focus quando il modal si chiude
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious])

  if (!isOpen || !artwork) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        ref={modalRef}
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-title"
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {hasPrevious && (
          <button
            className={styles.navButton}
            style={{ left: '2rem' }}
            onClick={onPrevious}
            aria-label="Previous"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {hasNext && (
          <button
            className={styles.navButton}
            style={{ right: '2rem' }}
            onClick={onNext}
            aria-label="Next"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className={styles.imageContainer}>
          <img
            src={modalImageSrc}
            alt={buildArtworkAltText(artwork, siteSettings)}
            className={styles.modalImage}
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className={styles.artworkInfo}>
          <h2 id="artwork-title" className={styles.artworkTitle}>
            {artwork.title} ({artwork.year})
          </h2>
          <p
            className={`${styles.availabilityTag} ${
              artwork.available ? styles.available : styles.sold
            }`}
          >
            {artwork.available ? 'Disponibile' : 'Venduto'}
          </p>
          {artwork.info && <p className={styles.artworkSubtitle}>{artwork.info}</p>}
          <div className={styles.details}>
            {artwork.medium && <p className={styles.detailItem}>Tecnica: {artwork.medium}</p>}
            {artwork.dimensions && <p className={styles.detailItem}>Dimensioni: {artwork.dimensions}</p>}
            {artwork.location && <p className={styles.detailItem}>Luogo: {artwork.location}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

