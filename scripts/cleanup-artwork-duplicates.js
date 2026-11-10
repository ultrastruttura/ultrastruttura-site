/**
 * Mantiene solo i file WebP referenziati dal catalogo (+ opzionali noti).
 * Uso: node scripts/cleanup-artwork-duplicates.js
 */
const fs = require('fs')
const path = require('path')

const siteContent = require('../data/site-content.json')
const artworksDir = path.join(__dirname, '../public/artworks')

const keep = new Set()
for (const artwork of siteContent.artworks || []) {
  if (artwork.image) keep.add(path.basename(artwork.image))
  if (artwork.imageFull) keep.add(path.basename(artwork.imageFull))
}

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
  const files = fs
    .readdirSync(artworksDir)
    .filter((f) => f !== '.gitkeep' && /\.(jpe?g|png|webp|gif)$/i.test(f))

  for (const file of files) {
    if (keep.has(file)) continue
    const full = path.join(artworksDir, file)
    const ok = await safeUnlink(full)
    console.log(ok ? `Rimosso: ${file}` : `⚠ Non rimosso: ${file}`)
  }

  console.log('\nCatalogo:')
  for (const f of keep) {
    console.log(`  ${fs.existsSync(path.join(artworksDir, f)) ? '✓' : '✗'} ${f}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
