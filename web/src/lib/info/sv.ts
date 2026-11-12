import type { InfoDocs } from './types'

// Selosteiden sisältö (ruotsi). Käännös suomenkielisestä (fi.ts): pidä sisällöt samoina.
const docs: InfoDocs = {
  privacy: {
    title: 'Dataskyddsbeskrivning',
    updated: 'Uppdaterad 12.11.2026',
    sections: [
      { h: '', html: `
<p>I den här beskrivningen berättar vi vilka uppgifter som behandlas om besökarna på webbplatsen amisfits.fi och varför. Webbplatsen har ingen inloggning och inga formulär, och du behöver inte lämna några uppgifter om dig själv för att använda den.</p>` },
      { h: 'Personuppgiftsansvarig', html: `
<address>Sivistysala ry (Sivista)<br>Södra kajen 10, 00130 Helsingfors<br>Telefon (09) 1728 5700<br><a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a></address>
<p>Frågor och begäranden som gäller dataskydd kan skickas till e-postadressen ovan.</p>` },
      { h: 'Vilka uppgifter behandlas', html: `
<ul>
<li><strong>Teknisk leverans av webbplatsen.</strong> När du öppnar en sida skickar din webbläsare IP-adress, tidpunkt, den begärda sidans adress och uppgifter om webbläsaren till servern. Uppgifterna behövs för att visa sidan och för tjänstens informationssäkerhet. Webbplatsen finns på Netlifys servrar, och bilder och filer från innehållshanteringen kan levereras från Sanitys servrar.</li>
<li><strong>Besöksstatistik, endast med ditt samtycke.</strong> Om du godkänner statistikkakor använder vi Google Analytics. Tjänsten samlar in uppgifter om till exempel vilka sidor som visas, varifrån besökarna kommer, vilken enhet och webbläsare som används och från vilket område besökaren kommer på en grov nivå. Uppgifterna är statistiska och vi kan inte identifiera enskilda personer utifrån dem. Uppgifterna används inte för marknadsföring.</li>
<li><strong>Amisfits-testet.</strong> Dina svar behandlas bara i din egen webbläsare. De sparas inte och skickas inte någonstans. Om du har godkänt statistikkakor registreras det i statistiken att testet har gjorts samt resultatets färg, sidans språk och målgruppen (unga eller vuxna). Enskilda svar registreras inte.</li>
<li><strong>Videor.</strong> Webbplatsens videor visas med YouTubes inbäddade spelare (youtube-nocookie.com). Spelaren laddas från Googles servrar, och då får Google din IP-adress. När du startar en video kan YouTube lagra uppgifter på din enhet och behandla uppgifter om visningen enligt sina egna villkor.</li>
</ul>` },
      { h: 'Kakor och webbläsarens lagringsutrymme', html: `
<ul>
<li><strong>Ditt kakval</strong> sparas i webbläsarens lokala lagringsutrymme (amisfits-suostumus) i 12 månader, så att vi inte behöver fråga vid varje besök. Uppgiften stannar på din enhet.</li>
<li><strong>Statistikkakor</strong> (_ga och kakor som börjar med _ga_) sätts bara om du godkänner dem. De sparas i högst två år.</li>
</ul>
<p>Du kan ändra ditt val när som helst via länken Kakinställningar längst ner på sidan. När du återkallar ditt samtycke tas statistikkakorna bort från din webbläsare.</p>` },
      { h: 'Grund för behandlingen', html: `
<p>Den tekniska leveransen av webbplatsen och informationssäkerheten grundar sig på den personuppgiftsansvariges berättigade intresse. Besöksstatistiken och statistikkakorna grundar sig på ditt samtycke.</p>` },
      { h: 'Mottagare och överföringar utanför EU', html: `
<p>Uppgifterna behandlas för vår räkning av webbplatsens tjänsteleverantörer: Netlify (serverutrymme), Sanity (innehållshantering), Google (Analytics och YouTube) samt webbplatsens tekniska administratör HueSky Oy. En del av tjänsteleverantörerna är verksamma i USA. Överföringarna grundar sig på dataskyddsramen mellan EU och USA (Data Privacy Framework) eller på Europeiska kommissionens standardavtalsklausuler. Uppgifterna lämnas inte ut till andra.</p>` },
      { h: 'Lagringstider', html: `
<p>Besökarspecifika uppgifter i Google Analytics sparas i högst 14 månader. Serverloggarna sparas under en begränsad tid enligt tjänsteleverantörens praxis.</p>` },
      { h: 'Dina rättigheter', html: `
<p>Du har rätt att få veta om uppgifter om dig behandlas och att begära att de rättas, raderas eller att behandlingen begränsas samt att invända mot behandlingen. Du kan när som helst återkalla ditt samtycke. Begäranden kan skickas till <a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a>.</p>
<p>Om du anser att dina uppgifter behandlas i strid med lagen kan du göra en anmälan till Dataombudsmannens byrå:</p>
<address>Dataombudsmannens byrå<br>PB 800, 00531 Helsingfors<br><a href="mailto:tietosuoja@om.fi">tietosuoja@om.fi</a>, telefonväxel 029 566 6700<br><a href="https://tietosuoja.fi/sv">tietosuoja.fi/sv</a></address>` },
    ],
  },

  accessibility: {
    title: 'Tillgänglighetsutlåtande',
    updated: 'Upprättat 12.11.2026',
    sections: [
      { h: '', html: `
<p>Det här utlåtandet gäller webbplatsen amisfits.fi. Målet är att webbplatsen uppfyller tillgänglighetskraven i lagen om tillhandahållande av digitala tjänster (306/2019), det vill säga nivå A och AA i WCAG 2.1.</p>` },
      { h: 'Tillgänglighetens status', html: `
<p>Webbplatsen uppfyller tillgänglighetskraven delvis. De kända bristerna beskrivs nedan.</p>` },
      { h: 'Innehåll som inte är tillgängligt', html: `
<ul>
<li><strong>Videor.</strong> Videorna har inbränd textning men ingen syntolkning. Frågerubrikerna och de intervjuades namn syns bara i bild och når därför inte tittare med synnedsättning (WCAG 1.2.5).</li>
<li><strong>Rubrikgrafik.</strong> Avsnittens huvudrubriker är bilder. De har textalternativ, men textens utseende kan inte ändras med webbläsarens inställningar (WCAG 1.4.5).</li>
</ul>
<p>Dessutom hoppar rubriknivån i det första avsnittet från huvudrubriken till den tredje nivån, vilket kan göra sidans struktur svårare att uppfatta med skärmläsare. YouTubes inbäddade videospelare är en tjänst från tredje part vars tillgänglighet vi inte kan påverka.</p>` },
      { h: 'Hur tillgängligheten har bedömts', html: `
<p>Bedömningen är en självbedömning som gjorts av den som har byggt webbplatsen. Sidorna har kontrollerats 2.11.2026 med det automatiska verktyget axe-core på alla tre språk. Dessutom har tangentbordsanvändning, kontraster, textalternativ och Amisfits-testets funktion kontrollerats manuellt. Testning med skärmläsare och extern granskning har inte gjorts.</p>` },
      { h: 'Upptäckte du en brist? Ge respons', html: `
<p>Om du upptäcker ett tillgänglighetsproblem på webbplatsen eller behöver innehållet i en annan form, berätta det för oss:</p>
<address>Sivistysala ry (Sivista)<br><a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a><br>Telefon (09) 1728 5700</address>
<p>Vi svarar inom 14 dagar.</p>` },
      { h: 'Tillsynsmyndighet', html: `
<p>Om du inte är nöjd med svaret eller inte får något svar inom 14 dagar kan du göra en anmälan till tillsynsmyndigheten. På myndighetens webbplats beskrivs hur anmälan görs och hur ärendet behandlas.</p>
<address>Transport- och kommunikationsverket Traficom<br>Enheten för tillsyn över digital tillgänglighet<br><a href="https://www.tillganglighetskrav.fi">www.tillganglighetskrav.fi</a><br><a href="mailto:saavutettavuus@traficom.fi">saavutettavuus@traficom.fi</a><br>Telefonväxel 029 534 5000</address>` },
    ],
  },
}

export default docs
