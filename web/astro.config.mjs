import { defineConfig } from 'astro/config'

export default defineConfig({
  // Tuotanto-osoite: canonical-, hreflang- ja jako-osoitteet sekä sivukartta muodostetaan tästä
  site: 'https://amisfits.fi',
  // Kaikki sivut buildataan staattisiksi HTML-tiedostoiksi
  output: 'static',
  // Sivukartta: src/pages/sitemap.xml.ts
})
