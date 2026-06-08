import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://amisfits.fi',
  // Kaikki sivut buildataan staattisiksi HTML-tiedostoiksi
  output: 'static',
  // Sitemap lisätään myöhemmin kun domain on rekisteröity
})
