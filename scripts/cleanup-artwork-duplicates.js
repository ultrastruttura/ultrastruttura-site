/**
 * Rimuove duplicati dopo migrazione (vecchi slug bergamo / file archivio errati).
 * Uso: node scripts/cleanup-artwork-duplicates.js
 */

const fs = require('fs')
const path = require('path')

const artworksDir = path.join(__dirname, '../public/artworks')

const removeExplicit = [
  'dunkelheit-dipinto-astratto-contemporaneo-bergamo-2026-ultrastruttura.webp',
  'se-la-luce-ci-prende-dipinto-astratto-contemporaneo-lonno-2026-ultrastruttura.webp',
  'se-gli-piace-lacqua-buttatelo-nel-fiume-dipinto-astratto-contemporaneo-bergamo-2021-ultrastruttura.webp',
  'le-evasioni-barbariche-dipinto-astratto-contemporaneo-bergamo-2021-ultrastruttura.webp',
  'vi-gora-dipinto-astratto-contemporaneo-bergamo-2020-ultrastruttura.webp',
  'la-parte-a-maggese-dipinto-astratto-contemporaneo-bergamo-2021-ultrastruttura.webp',
  'opera-archivio-dunkelheit-dipinto-astratto-contempo-ultrastruttura.webp',
  'opera-archivio-se-gli-piace-lacqua-buttatelo-nel-fi-ultrastruttura.webp',
  'opera-archivio-se-la-luce-ci-prende-dipinto-astratt-ultrastruttura.webp',
]

const keep = new Set([
  'dunkelheit-dipinto-astratto-contemporaneo-milano-lombardia-2026-ultrastruttura.webp',
  'se-la-luce-ci-prende-dipinto-astratto-contemporaneo-lombardia-nord-italia-2026-ultrastruttura.webp',
  'se-gli-piace-lacqua-buttatelo-nel-fiume-dipinto-astratto-contemporaneo-milano-nord-italia-2021-ultrastruttura.webp',
  'le-evasioni-barbariche-dipinto-astratto-contemporaneo-milano-lombardia-2021-ultrastruttura.webp',
  'vi-gora-dipinto-astratto-contemporaneo-nord-italia-lombardia-2020-ultrastruttura.webp',
  'la-parte-a-maggese-dipinto-astratto-contemporaneo-milano-bergamo-lombardia-2021-ultrastruttura.webp',
])

const removePatterns = [
  /-bergamo-\d{4}-ultrastruttura\.webp$/,
  /-lonno-\d{4}-ultrastruttura\.webp$/,
  /^opera-archivio-/,
  /^contemporary-abstract-art-for-collectors/,
  /^original-abstract-painting/,
  /^original-contemporary-abstract-painting/,
  /^unique-abstract-artwork/,
]

async function safeUnlink(filePath) {
  for (let i = 0; i < 10; i++) {
    try {
      fs.unlinkSync(filePath)
      return true
    } catch (err) {
      if (err.code !== 'EBUSY' && err.code !== 'EPERM') throw err
      await new Promise((r) => setTimeout(r, 200 * (i + 1)))
    }
  }
  return false
}

async function main() {
  const files = fs.readdirSync(artworksDir).filter((f) => /\.webp$/i.test(f))

  for (const file of removeExplicit) {
    const full = path.join(artworksDir, file)
    if (!fs.existsSync(full)) continue
    const ok = await safeUnlink(full)
    console.log(ok ? `Rimosso: ${file}` : `⚠ Non rimosso: ${file}`)
  }

  for (const file of files) {
    if (keep.has(file)) continue
    if (removeExplicit.includes(file)) continue

    const shouldRemove =
      removePatterns.some((p) => p.test(file)) ||
      (file.includes('archivio') && file.includes('bergamo-ultrastruttura'))

    if (!shouldRemove) continue

    const full = path.join(artworksDir, file)
    const ok = await safeUnlink(full)
    console.log(ok ? `Rimosso: ${file}` : `⚠ Non rimosso: ${file}`)
  }

  console.log('\nFile catalogo attesi:')
  for (const f of keep) {
    const exists = fs.existsSync(path.join(artworksDir, f))
    console.log(`  ${exists ? '✓' : '✗'} ${f}`)
  }
}

main().catch(console.error)
