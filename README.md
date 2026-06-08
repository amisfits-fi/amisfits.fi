# amisfits.fi

Sivistysala ry:n ETEKA-hankkeen one-pager-verkkosivusto.

## Teknologiat

| Komponentti | Teknologia | Tarkoitus |
|---|---|---|
| Frontend | [Astro](https://astro.build) | Staattinen sivugeneraattori |
| CMS | [Sanity](https://sanity.io) | Sisällönhallinta |
| Hosting | [Netlify](https://netlify.com) | Hosting + automaattiset buildит |
| DNS | [Cloudflare](https://cloudflare.com) | DNS-hallinta |
| Koodi | [GitHub](https://github.com) | Versionhallinta |

## Sivurakenne

Sivusto generoi 6 staattista sivua kohderyhmän ja kielen mukaan:

```
amisfits.fi/              → uudelleenohjaus → /fi/nuoret
amisfits.fi/fi/nuoret     ← oletus
amisfits.fi/fi/aikuiset
amisfits.fi/se/nuoret
amisfits.fi/se/aikuiset
amisfits.fi/en/nuoret
amisfits.fi/en/aikuiset
```

## Projektin rakenne

```
amisfits.fi/
├── web/          ← Astro-frontend (tänne koodi)
├── studio/       ← Sanity Studio (tänne sisällönhallinta)
├── .env.example  ← ympäristömuuttujien malli
└── README.md     ← tämä tiedosto
```

## Kehitysympäristön käynnistys

### Esitiedot
- Node.js 18 tai uudempi
- npm 8 tai uudempi

### 1. Kloonaa repo

```bash
git clone https://github.com/amisfits-fi/amisfits.fi.git
cd amisfits.fi
```

### 2. Asenna riippuvuudet

```bash
npm install
```

### 3. Ympäristömuuttujat

```bash
cp .env.example .env
# Avaa .env ja täytä Sanity-projektin tunnistetiedot
# (löytyvät sanity.io/manage)
```

### 4. Käynnistä kehityspalvelin

```bash
# Frontend (http://localhost:4321)
npm run dev:web

# Sanity Studio (http://localhost:3333)
npm run dev:studio
```

## Sisällönhallinta (Sanity Studio)

Sisältöä hallitaan Sanity Studiossa osoitteessa:  
**https://amisfits.sanity.studio** (tai paikallisesti http://localhost:3333)

### Sisältörakenne

- **One-pager** – Yksi dokumentti per kieli (fi / se / en)
  - Jokainen dokumentti sisältää sektiot, FAQ:n ja logot
  - Jokaisessa sektiossa on erikseen sisältö nuorille ja aikuisopiskelijoille

### Uuden kielen lisääminen

1. Luo Sanity Studiossa uusi One-pager-dokumentti halutulle kielelle
2. Lisää kielikoodi `web/src/pages/`-kansioon uutena alikansioksi
3. Lisää kieli `getStaticPaths()`-funktioon tiedostossa `web/src/pages/[lang]/[audience].astro`

## Julkaisu

Netlify buildaa sivuston automaattisesti kun `main`-haaraan pusketaan muutoksia.

```bash
git push origin main   # → Netlify rakentaa ja julkaisee automaattisesti
```

### Sanity-sisällön julkaisu

Kun sisältöä päivitetään Sanity Studiossa ja julkaistaan (Publish-nappi),
Netlify saa webhookin ja käynnistää uuden buildin automaattisesti.

## Yhteystiedot

| Rooli | Nimi | Sähköposti |
|---|---|---|
| Toteutus | Ville Launiala / HueSky Oy | ville.launiala@huesky.fi |
| Visuaalinen suunnittelu | Sampsa Voutilainen | — |
| Asiakas | Sivistysala ry (Sivista) | — |
