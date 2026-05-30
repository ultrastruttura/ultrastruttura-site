'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Gallery.module.css'
import { artworks, siteSettings, type Artwork } from '@/data/artworks'
import { buildArtworkAltText } from '@/lib/seo'
import ImageModal from './ImageModal'
import ImageSkeleton from './ImageSkeleton'

export default function Gallery() {
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const imageRefs = useRef<(HTMLImageElement | null)[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item)
      })
    }
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleImageClick = (artwork: Artwork) => {
    const index = artworks.findIndex((a) => a.id === artwork.id)
    setCurrentIndex(index)
    setSelectedArtwork(artwork)
    setIsModalOpen(true)
  }

  const handleImageLoad = (artworkId: number) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev)
      newSet.add(artworkId)
      return newSet
    })
  }

  // Verifica se le immagini sono già caricate (cache del browser) e preloada le prime
  useEffect(() => {
    // Preloada le prime 3 immagini critiche (above the fold) solo se non già presenti
    const criticalImages = artworks.slice(0, 3)
    const preloadLinks: HTMLLinkElement[] = []
    
    criticalImages.forEach((artwork) => {
      // Verifica se il link di preload esiste già
      const existingLink = document.querySelector(`link[href="${artwork.image}"][rel="preload"]`)
      if (!existingLink) {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = artwork.image
        link.setAttribute('fetchpriority', 'high')
        document.head.appendChild(link)
        preloadLinks.push(link)
      }
    })

    const checkCachedImages = () => {
      imageRefs.current.forEach((img, index) => {
        if (img && artworks[index]) {
          const artworkId = artworks[index].id
          if (img.complete && img.naturalHeight > 0) {
            setLoadedImages((prev) => {
              if (!prev.has(artworkId)) {
                const newSet = new Set(prev)
                newSet.add(artworkId)
                return newSet
              }
              return prev
            })
          }
        }
      })
    }
    
    // Controlla immediatamente per immagini in cache
    checkCachedImages()
    
    // Controlla anche dopo brevi delay per gestire immagini che si caricano molto velocemente
    // Prima check veloce per immagini critiche
    const fastTimeoutId = setTimeout(checkCachedImages, 10)
    // Secondo check per immagini che si caricano subito dopo
    const timeoutId = setTimeout(checkCachedImages, 100)
    
    return () => {
      clearTimeout(fastTimeoutId)
      clearTimeout(timeoutId)
      // Rimuovi solo i link di preload che abbiamo creato
      preloadLinks.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      })
    }
  }, [])

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    artwork: Artwork
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleImageClick(artwork)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setSelectedArtwork(null)
    }, 300)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % artworks.length
    setCurrentIndex(nextIndex)
    setSelectedArtwork(artworks[nextIndex])
  }

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length
    setCurrentIndex(prevIndex)
    setSelectedArtwork(artworks[prevIndex])
  }

  if (artworks.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.galleryContainer}>
          <p style={{ textAlign: 'center', padding: '4rem' }}>
            Aggiungi le tue opere in <code>data/site-content.json</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.galleryContainer}>
          <div className={styles.collage}>
            {artworks.map((artwork, index) => {
              const isLoaded = loadedImages.has(artwork.id)
              const isCritical = index < 3 // Prime 3 immagini critiche
              // Mostra skeleton solo se l'immagine non è ancora caricata
              const showSkeleton = !isLoaded
              
              return (
                <div
                  key={artwork.id}
                  ref={(el) => {
                    itemsRef.current[index] = el
                  }}
                  className={styles.artworkItem}
                  onClick={() => handleImageClick(artwork)}
                  onKeyDown={(e) => handleKeyDown(e, artwork)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${artwork.title} (${artwork.year})`}
                >
                  <div className={styles.imageWrapper}>
                    {showSkeleton && (
                      <div className={styles.skeletonContainer}>
                        <ImageSkeleton />
                      </div>
                    )}
                    <img
                      ref={(el) => {
                        imageRefs.current[index] = el
                      }}
                      src={artwork.image}
                      alt={buildArtworkAltText(artwork, siteSettings)}
                      title={`${artwork.title} (${artwork.year}) — ${siteSettings.artistName}, ${siteSettings.locality}`}
                      className={`${styles.artworkImage} ${isLoaded ? styles.artworkImageLoaded : styles.artworkImageLoading}`}
                      loading={isCritical ? 'eager' : 'lazy'}
                      decoding={isCritical ? 'sync' : 'async'}
                      fetchPriority={isCritical ? 'high' : 'low'}
                      width="800"
                      height="600"
                      onLoad={() => handleImageLoad(artwork.id)}
                      onError={() => handleImageLoad(artwork.id)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <ImageModal
        artwork={selectedArtwork}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentIndex < artworks.length - 1}
        hasPrevious={currentIndex > 0}
      />
    </>
  )
}

