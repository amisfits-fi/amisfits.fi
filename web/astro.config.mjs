import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://amisfits.fi',
  integrations: [
    sitemap({
      // Generoi sitemap kaikille 6 sivulle
      filter: (page) => !page.includes('404'),
    }),
  ],
  // Kaikki sivut buildataan staattisiksi HTML-tiedostoiksi
  output: 'static',
})
