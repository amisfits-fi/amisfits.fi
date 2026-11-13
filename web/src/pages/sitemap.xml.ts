// Sivukartta hakukoneille: pääsivut, testit ja selosteet kaikilla kielillä.
import type { APIRoute } from 'astro'
import { AUDIENCES, LANGUAGES, infoPath, pagePath, quizPath } from '@/lib/i18n'

export const GET: APIRoute = ({ site }) => {
  const paths = LANGUAGES.flatMap((lang) => [
    ...AUDIENCES.map((aud) => pagePath(lang, aud)),
    ...AUDIENCES.map((aud) => quizPath(lang, aud)),
    infoPath(lang, 'privacy'),
    infoPath(lang, 'accessibility'),
  ])
  const urls = paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
