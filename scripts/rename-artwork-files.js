/**
 * Rinomina i file immagine in public/artworks secondo i path in site-content.json.
 * Esegui dalla root: node scripts/rename-artwork-files.js
 *
 * Prima di eseguire, verifica che i file sorgente esistano in public/artworks.
 */

const fs = require('fs')
const path = require('path')

const renames = [
  ['dunkelheit.jpg', 'dunkelheit-dipinto-astratto-contemporaneo-ultrastruttura.jpg'],
  ['img_1923.png', 'se-la-luce-ci-prende-dipinto-astratto-ultrastruttura.png'],
]

const artworksDir = path.join(__dirname, '../public/artworks')

if (!fs.existsSync(artworksDir)) {
  console.error('Cartella non trovata:', artworksDir)
  process.exit(1)
}

for (const [from, to] of renames) {
  const oldPath = path.join(artworksDir, from)
  const newPath = path.join(artworksDir, to)
  if (!fs.existsSync(oldPath)) {
    console.warn(`Saltato (manca): ${from}`)
    continue
  }
  if (fs.existsSync(newPath)) {
    console.warn(`Saltato (esiste già): ${to}`)
    continue
  }
  fs.renameSync(oldPath, newPath)
  console.log(`OK: ${from} -> ${to}`)
}

console.log(
  '\nPer "Se la luce ci prende", converti il PNG in WebP (es. Squoosh) e rinomina in:',
  'se-la-luce-ci-prende-dipinto-astratto-ultrastruttura.webp'
)
