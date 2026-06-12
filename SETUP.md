# amisfits.fi – Palveluiden käyttöönotto-ohje

Seuraa tämä ohje järjestyksessä. Jokaisen vaiheen lopussa on ✅-merkintä
kun se on tehty.

---

## VAIHE 1 – GitHub-organisaatio ja repo

### 1.1 Luo organisaatio
1. Mene → https://github.com/organizations/new
2. **Organization name:** `amisfits-fi`
3. **Plan:** Free
4. Täytä muut kentät → Create organization

### 1.2 Luo repo organisaation alle
1. Mene → https://github.com/organizations/amisfits-fi/repositories/new
2. **Repository name:** `amisfits.fi`
3. **Visibility:** Private (muuta Public kun sivusto julkaistaan)
4. **ÄLÄ** lisää README:tä – projektipohja sisältää jo sellaisen
5. Create repository

### 1.3 Pushaa projektipohja repoon
Aja terminaalissa tässä kansiossa (`amisfits.fi/`):

```bash
git init
git add .
git commit -m "chore: projektipohja"
git branch -M main
git remote add origin https://github.com/amisfits-fi/amisfits.fi.git
git push -u origin main
```

### 1.4 Luo develop-haara
```bash
git checkout -b develop
git push -u origin develop
```

✅ **GitHub valmis** kun repo näkyy osoitteessa github.com/amisfits-fi/amisfits.fi

---

## VAIHE 2 – Sanity-projekti

### 2.1 Luo projekti
1. Mene → https://sanity.io → Sign in / Create account
2. **Create new project**
3. **Project name:** `amisfits`
4. **Dataset:** `production`
5. Hyväksy oletusasetukset → Create project

### 2.2 Kopioi Project ID
Projekti luodaan → näet **Project ID** (muotoa `abc12345`)

Aja tässä kansiossa:
```bash
./scripts/update-config.sh ABC12345_KORVAA_TÄHÄN
```
Tämä päivittää projectId:n automaattisesti kaikkiin tarvittaviin tiedostoihin.

### 2.3 Lisää CORS-osoite (kehitystä varten)
1. sanity.io/manage → projektisi → API → CORS origins
2. Lisää: `http://localhost:4321`
3. Lisää myöhemmin: `https://amisfits.fi` ja Netlify preview -URL

### 2.4 Luo API-token (valinnainen, tarvitaan preview-moodiin)
1. sanity.io/manage → API → Tokens → Add API token
2. **Label:** `netlify-build`
3. **Permissions:** Viewer
4. Kopioi token → lisää Netlify-ympäristömuuttujiin (ks. Vaihe 3)

### 2.5 Deploy Sanity Studio pilveen
```bash
cd studio
npm install
npx sanity deploy
# Anna studion nimeksi: amisfits
# Studio saatavilla: https://amisfits.sanity.studio
```

✅ **Sanity valmis** kun studio aukeaa osoitteessa https://amisfits.sanity.studio

---

## VAIHE 3 – Netlify

### 3.1 Luo tili ja yhdistä GitHub
1. Mene → https://netlify.com → Sign up with GitHub
2. Hyväksy oikeudet

### 3.2 Luo uusi sivusto
1. **Add new site** → Import an existing project
2. Valitse **GitHub** → hae `amisfits-fi/amisfits.fi`
3. Build-asetukset täyttyvät automaattisesti `netlify.toml`:sta ✓
4. **Deploy site**

### 3.3 Lisää ympäristömuuttujat
Netlify → Site configuration → Environment variables → Add variable:

| Muuttuja | Arvo |
|---|---|
| `PUBLIC_SANITY_PROJECT_ID` | Sanity-projektin ID (ks. Vaihe 2.2) |
| `PUBLIC_SANITY_DATASET` | `production` |
| `PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_TOKEN` | Token Vaiheesta 2.4 (valinnainen) |

Muuttujien lisäyksen jälkeen: **Trigger deploy** → Deploy site

### 3.4 Aseta Sanity-webhook (automaattinen build sisältömuutoksista)
1. **Netlify** → Site configuration → Build hooks → Add build hook
2. **Name:** `sanity-content-update`
3. **Branch:** `main`
4. Kopioi syntynyt webhook-URL

5. **Sanity** → sanity.io/manage → projektisi → API → Webhooks → Add webhook
6. **Name:** `netlify-build`
7. **URL:** liitä Netlify-webhook-URL
8. **Trigger on:** `publish`, `unpublish`
9. Save

✅ **Netlify valmis** kun sivusto buildaa onnistuneesti ja saa Netlify-URL:n

---

## VAIHE 4 – Cloudflare DNS (tehdään domain-varauksen jälkeen)

> Odota kunnes asiakas on hyväksynyt ylläpitosopimuksen ja domain on varattu.

### 4.1 Lisää domain Cloudflareen
1. Mene → https://cloudflare.com → Add a Site
2. Domain: `amisfits.fi`
3. Plan: Free
4. Cloudflare antaa kaksi nameserver-osoitetta (esim. `ns1.cloudflare.com`)

### 4.2 Vaihda nameserverit domainrekisteröijällä
1. Kirjaudu Zoneriin / Hetzneriin (missä domain on)
2. Vaihda nameserverit Cloudflaren antamiin
3. Odota 1–24h propagoitumista

### 4.3 Yhdistä domain Netlifyhin Cloudflaren kautta
1. **Netlify** → Domain management → Add custom domain → `amisfits.fi`
2. **Cloudflare** → DNS → Add record:
   - Type: `CNAME`, Name: `www`, Content: netlify-sivuston osoite
   - Type: `CNAME`, Name: `@`, Content: netlify-sivuston osoite
   *(tai Netlify antaa tarkat ohjeet)*
3. Netlify hoitaa HTTPS-sertifikaatin automaattisesti (Let's Encrypt)

### 4.4 ⚠️ Salli hakukoneindeksointi (PAKOLLINEN julkaisuvaihe!)
1. Poista `netlify.toml`-tiedostosta rivi `X-Robots-Tag = "noindex, nofollow"`
   (väliaikainen esto, joka pitää keskeneräisen sivuston poissa Googlesta)
2. Committaa ja pushaa → Netlify buildaa uudelleen
3. Varmista: `curl -I https://amisfits.fi/fi/nuoret` — vastauksessa EI saa
   enää näkyä `x-robots-tag`-otsaketta

✅ **Domain valmis** kun https://amisfits.fi aukeaa selaimessa eikä
x-robots-tag-otsaketta enää ole

---

## Yhteenveto – tila

| Vaihe | Palvelu | Tila |
|---|---|---|
| 1 | GitHub (`amisfits-fi/amisfits.fi`) | ⬜ Tekemättä |
| 2 | Sanity (`amisfits.sanity.studio`) | ⬜ Tekemättä |
| 3 | Netlify (build + webhook) | ⬜ Tekemättä |
| 4 | Cloudflare + domain | ⏳ Odottaa sopimuksen hyväksyntää |
