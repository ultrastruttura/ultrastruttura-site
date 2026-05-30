/**
 * Converte tutte le immagini in public/artworks in WebP
 * e rinomina con slug italiani SEO-friendly.
 *
 * Uso: node scripts/migrate-artwork-images.js
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const siteContent = require('../data/site-content.json')
const artworksDir = path.join(__dirname, '../public/artworks')

function normalizeTitle(title) {
  return String(title).replace(/^["']|["']$/g, '').trim()
}

function slugify(title, maxLength = 48) {
  const slug = normalizeTitle(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (slug.length <= maxLength) return slug
  return slug.slice(0, maxLength).replace(/-+$/, '')
}

const ARTWORK_GEO = {
  260504: 'milano-lombardia',
  260210: 'lombardia-nord-italia',
  3: 'milano-nord-italia',
  4: 'milano-lombardia',
  6: 'nord-italia-lombardia',
  18: 'milano-bergamo-lombardia',
}

const ARCHIVE_GEO = [
  'milano-lombardia',
  'lombardia-nord-italia',
  'milano-nord-italia',
  'nord-italia-lombardia',
  'veneto-nord-italia',
  'piemonte-nord-italia',
]

function getArtworkGeoTag(artworkId) {
  return ARTWORK_GEO[artworkId] || 'lombardia-nord-italia'
}

function buildCatalogFilename(artwork) {
  const titleSlug = slugify(artwork.title)
  const year = artwork.year || new Date().getFullYear()
  const geo = getArtworkGeoTag(artwork.id)
  return `${titleSlug}-dipinto-astratto-contemporaneo-${geo}-${year}-ultrastruttura.webp`
}

function buildLegacyFilename(oldFilename) {
  const numMatch = oldFilename.match(/-(\d{2})-/)
  const num = parseInt(numMatch?.[1] ?? '0', 10)
  const geo = ARCHIVE_GEO[num % ARCHIVE_GEO.length]
  const numStr = numMatch?.[1] ?? '00'

  if (oldFilename.startsWith('original-contemporary-abstract-painting')) {
    return `dipinto-astratto-contemporaneo-archivio-${numStr}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('original-abstract-painting-on-canvas')) {
    return `dipinto-astratto-su-tela-archivio-${numStr}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('unique-abstract-artwork')) {
    return `opera-arte-astratta-unica-archivio-${numStr}-${geo}-ultrastruttura.webp`
  }
  if (oldFilename.startsWith('contemporary-abstract-art-for-collectors')) {
    return `arte-astratta-collezionisti-archivio-${numStr}-${geo}-ultrastruttura.webp`
  }
  const base = oldFilename.replace(/\.[^.]+$/, '').slice(0, 36)
  return `opera-archivio-${base}-${geo}-ultrastruttura.webp`.replace(/[^a-z0-9.-]+/g, '-')
}

function findCatalogSourceFile(artwork, dirFiles, { skipIfTargetReady = false } = {}) {
  const targetName = buildCatalogFilename(artwork)
  if (skipIfTargetReady && dirFiles.includes(targetName)) return null

  const byId = {
    260504: (f) => f.includes('dunkelheit'),
    260210: (f) => f.includes('se-la-luce-ci-prende'),
    3: (f) => f.includes('se-gli-piace-lacqua') || f.includes('original-abstract-painting-on-canvas-03'),
    4: (f) => f.includes('le-evasioni-barbariche') || f.includes('contemporary-abstract-art-for-collectors-04'),
    6: (f) => f.includes('vi-gora') || f.includes('unique-abstract-artwork-06'),
    18: (f) => f.includes('la-parte-a-maggese') || f.includes('unique-abstract-artwork-18'),
  }
  const matcher = byId[artwork.id]
  if (matcher) {
    const hit = dirFiles.find(matcher)
    if (hit && hit !== targetName) return hit
  }

  const basename = path.basename(artwork.image || '')
  return dirFiles.includes(basename) && basename !== targetName ? basename : null
}

async function convertToWebp(inputPath, outputPath) {
  const tempPath = `${outputPath}.tmp`
  await sharp(inputPath)
    .rotate()
    .webp({ quality: 88, effort: 4 })
    .toFile(tempPath)

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath)
  }
  fs.renameSync(tempPath, outputPath)
}

async function safeUnlink(filePath) {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      return
    } catch (err) {
      if (err.code !== 'EBUSY' && err.code !== 'EPERM') throw err
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)))
    }
  }
  console.warn(`⚠ Impossibile eliminare (file in uso): ${path.basename(filePath)}`)
}

async function main() {
  if (!fs.existsSync(artworksDir)) {
    console.error('Cartella mancante:', artworksDir)
    process.exit(1)
  }

  const catalog = siteContent.artworks || []
  const dirFiles = fs
    .readdirSync(artworksDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

  const oldToNew = new Map()

  const sourceToArtworkId = new Map()

  for (const artwork of catalog) {
    const target = buildCatalogFilename(artwork)
    const targetPath = path.join(artworksDir, target)
    const source = findCatalogSourceFile(artwork, dirFiles, { skipIfTargetReady: true })

    if (source) {
      oldToNew.set(source, target)
      sourceToArtworkId.set(source, artwork.id)
    } else if (!fs.existsSync(targetPath)) {
      console.warn(`⚠ Nessun file sorgente per: ${artwork.title}`)
    }

    const legacySource = findCatalogSourceFile(artwork, dirFiles)
    if (legacySource && legacySource !== target && fs.existsSync(targetPath)) {
      oldToNew.set(legacySource, target)
    }
  }

  for (const file of dirFiles) {
    if (!oldToNew.has(file)) {
      oldToNew.set(file, buildLegacyFilename(file))
    }
  }

  const usedNames = new Set()
  for (const [oldName, newName] of [...oldToNew.entries()]) {
    let finalName = newName
    let i = 2
    while (usedNames.has(finalName)) {
      finalName = newName.replace('.webp', `-${i}.webp`)
      i++
    }
    usedNames.add(finalName)
    oldToNew.set(oldName, finalName)
  }

  console.log('Conversione WebP + rename (italiano):\n')

  const idToNewPath = new Map()

  for (const artwork of catalog) {
    const target = buildCatalogFilename(artwork)
    idToNewPath.set(artwork.id, `/artworks/${target}`)
  }

  for (const [oldName, newName] of oldToNew.entries()) {
    const inputPath = path.join(artworksDir, oldName)
    const outputPath = path.join(artworksDir, newName)
    if (!fs.existsSync(inputPath)) continue
    if (path.resolve(inputPath) === path.resolve(outputPath)) continue

    const outputExists = fs.existsSync(outputPath)
    if (!outputExists) {
      await convertToWebp(inputPath, outputPath)
    }

    if (oldName !== newName) {
      await safeUnlink(inputPath)
    }

    console.log(`  ${oldName} → ${newName}`)
  }

  const updatedArtworks = catalog.map((artwork) => {
    const imagePath = idToNewPath.get(artwork.id)
    if (!imagePath) return artwork
    return {
      ...artwork,
      image: imagePath,
      ...(artwork.imageFull ? { imageFull: imagePath } : {}),
    }
  })

  const updated = { ...siteContent, artworks: updatedArtworks }
  fs.writeFileSync(
    path.join(__dirname, '../data/site-content.json'),
    JSON.stringify(updated, null, 2) + '\n',
    'utf8'
  )

  console.log(`\n✓ site-content.json aggiornato (${idToNewPath.size} opere in catalogo)`)
  console.log(`✓ ${oldToNew.size} file totali in WebP italiano`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
