import { defineConfig } from 'astro/config'

export default defineConfig({
  // site: 'https://amisfits.fi', // Vaihda takaisin kun domain on rekisteröity
  site: 'https://amisfits-fi.netlify.app',
  // Kaikki sivut buildataan staattisiksi HTML-tiedostoiksi
  output: 'static',
  // Sitemap lisätään myöhemmin kun domain on rekisteröity
})
