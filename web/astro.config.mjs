import { defineConfig } from 'astro/config'

export default defineConfig({
  // Tuotanto-osoite: canonical-, hreflang- ja jako-osoitteet sekä sivukartta muodostetaan tästä
  site: 'https://amisfits.fi',
  // Kaikki sivut buildataan staattisiksi HTML-tiedostoiksi
  output: 'static',
  // Tyylit upotetaan suoraan HTML:ään: selain ei odota erillistä CSS-tiedostoa
  // ennen kuin piirtää sivun (PageSpeed: renderöinnin estävä pyyntö).
  build: { inlineStylesheets: 'always' },
  // Sivukartta: src/pages/sitemap.xml.ts
})
