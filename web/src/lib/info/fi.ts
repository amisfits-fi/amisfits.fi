import type { InfoDocs } from './types'

// Selosteiden sisältö (suomi). Päivitä `updated`, kun sisältö muuttuu.
// Yhteystiedot: Sivistan yleinen osoite (sivista.fi:n tietosuojaselosteista).
const docs: InfoDocs = {
  privacy: {
    title: 'Tietosuojaseloste',
    updated: 'Päivitetty 12.11.2026',
    sections: [
      { h: '', html: `
<p>Tässä selosteessa kerrotaan, mitä tietoja amisfits.fi-sivuston kävijöistä käsitellään ja miksi. Sivustolla ei ole kirjautumista eikä lomakkeita, eikä sinun tarvitse antaa itsestäsi mitään tietoja käyttääksesi sitä.</p>` },
      { h: 'Rekisterinpitäjä', html: `
<address>Sivistysala ry (Sivista)<br>Eteläranta 10, 00130 Helsinki<br>Puhelin (09) 1728 5700<br><a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a></address>
<p>Tietosuojaa koskevat kysymykset ja pyynnöt voi lähettää yllä olevaan sähköpostiosoitteeseen.</p>` },
      { h: 'Mitä tietoja käsitellään', html: `
<ul>
<li><strong>Sivuston tekninen toimittaminen.</strong> Kun avaat sivun, selaimesi lähettää palvelimelle IP-osoitteen, ajankohdan, pyydetyn sivun osoitteen ja selaimen tiedot. Tietoja tarvitaan sivun näyttämiseen ja palvelun tietoturvaan. Sivusto on Netlifyn palvelimilla, ja sisällönhallinnan kuvat ja tiedostot voidaan toimittaa Sanityn palvelimilta.</li>
<li><strong>Kävijätilastot, vain suostumuksellasi.</strong> Jos hyväksyt tilastoevästeet, käytämme Google Analyticsia. Se kerää tietoja esimerkiksi siitä, mitä sivuja katsotaan, mistä sivustolle tullaan, millä laitteella ja selaimella sivustoa käytetään ja miltä alueelta kävijä on karkealla tasolla. Tiedot ovat tilastollisia, emmekä pysty tunnistamaan niistä yksittäistä henkilöä. Tietoja ei käytetä mainontaan.</li>
<li><strong>Amisfits-testi.</strong> Vastauksesi käsitellään vain omassa selaimessasi. Niitä ei tallenneta eikä lähetetä mihinkään. Jos olet hyväksynyt tilastoevästeet, tilastoon kirjataan, että testi on tehty, sekä tuloksen väri, sivun kieli ja kohderyhmä (nuoret tai aikuiset). Yksittäisiä vastauksia ei kirjata.</li>
<li><strong>Videot.</strong> Sivuston videot näytetään YouTuben upotettuna soittimena (youtube-nocookie.com). Soitin ladataan Googlen palvelimilta, jolloin Google saa IP-osoitteesi. Kun käynnistät videon, YouTube voi tallentaa tietoja laitteellesi ja käsitellä katselutietoja omien ehtojensa mukaisesti.</li>
</ul>` },
      { h: 'Evästeet ja selaimen tallennustila', html: `
<ul>
<li><strong>Evästevalintasi</strong> tallennetaan selaimesi paikalliseen tallennustilaan (amisfits-suostumus) 12 kuukaudeksi, jotta sitä ei kysytä joka käynnillä. Tieto pysyy laitteellasi.</li>
<li><strong>Tilastoevästeet</strong> (_ga ja _ga_-alkuiset) asetetaan vain, jos hyväksyt ne. Ne säilyvät enintään kaksi vuotta.</li>
</ul>
<p>Voit muuttaa valintaasi milloin tahansa sivun alareunan Evästeasetukset-linkistä. Kun perut suostumuksen, tilastoevästeet poistetaan selaimestasi.</p>` },
      { h: 'Käsittelyn peruste', html: `
<p>Sivuston tekninen toimittaminen ja tietoturva perustuvat rekisterinpitäjän oikeutettuun etuun. Kävijätilastot ja tilastoevästeet perustuvat suostumukseesi.</p>` },
      { h: 'Tietojen vastaanottajat ja siirrot EU:n ulkopuolelle', html: `
<p>Tietoja käsittelevät puolestamme sivuston palveluntarjoajat: Netlify (palvelintila), Sanity (sisällönhallinta), Google (Analytics ja YouTube) sekä sivuston tekninen ylläpitäjä HueSky Oy. Osa palveluntarjoajista toimii Yhdysvalloissa. Siirrot perustuvat EU:n ja Yhdysvaltojen väliseen Data Privacy Framework -järjestelyyn tai Euroopan komission vakiosopimuslausekkeisiin. Tietoja ei luovuteta muille.</p>` },
      { h: 'Säilytysajat', html: `
<p>Google Analyticsin kävijäkohtaiset tiedot säilytetään enintään 14 kuukautta. Palvelinten lokitiedot säilyvät palveluntarjoajan käytännön mukaisen rajatun ajan.</p>` },
      { h: 'Oikeutesi', html: `
<p>Sinulla on oikeus saada tietää, käsitelläänkö sinua koskevia tietoja, ja pyytää niiden oikaisemista, poistamista tai käsittelyn rajoittamista sekä vastustaa käsittelyä. Voit perua suostumuksesi milloin tahansa. Pyynnöt voi lähettää osoitteeseen <a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a>.</p>
<p>Jos katsot, että tietojasi käsitellään lainvastaisesti, voit tehdä ilmoituksen tietosuojavaltuutetun toimistoon:</p>
<address>Tietosuojavaltuutetun toimisto<br>PL 800, 00531 Helsinki<br><a href="mailto:tietosuoja@om.fi">tietosuoja@om.fi</a>, puhelinvaihde 029 566 6700<br><a href="https://tietosuoja.fi">tietosuoja.fi</a></address>` },
    ],
  },

  accessibility: {
    title: 'Saavutettavuusseloste',
    updated: 'Laadittu 12.11.2026',
    sections: [
      { h: '', html: `
<p>Tämä seloste koskee verkkosivustoa amisfits.fi. Sivuston tavoitteena on täyttää digitaalisten palvelujen tarjoamisesta annetun lain (306/2019) saavutettavuusvaatimukset eli WCAG 2.1 -kriteeristön A- ja AA-taso.</p>` },
      { h: 'Saavutettavuuden tila', html: `
<p>Sivusto täyttää saavutettavuusvaatimukset osittain. Tiedossa olevat puutteet on kuvattu alla.</p>` },
      { h: 'Sisällöt, jotka eivät ole saavutettavia', html: `
<ul>
<li><strong>Videot.</strong> Videoissa on kuvaan poltettu tekstitys, mutta ei kuvailutulkkausta. Kysymysotsikot ja haastateltavien nimet näkyvät vain kuvassa, joten ne eivät välity näkövammaiselle katsojalle (WCAG 1.2.5).</li>
<li><strong>Otsikkografiikat.</strong> Osioiden pääotsikot ovat kuvia. Niillä on tekstivastine, mutta tekstin ulkoasua ei voi muuttaa selaimen asetuksilla (WCAG 1.4.5).</li>
</ul>
<p>Lisäksi ensimmäisessä osiossa väliotsikoiden taso hyppää pääotsikosta kolmannelle tasolle, mikä voi hankaloittaa sivun rakenteen hahmottamista ruudunlukijalla. YouTuben upotettu videosoitin on kolmannen osapuolen palvelu, jonka saavutettavuuteen emme voi vaikuttaa.</p>` },
      { h: 'Miten saavutettavuus on arvioitu', html: `
<p>Arvio on sivuston toteuttajan tekemä itsearvio. Sivut on tarkistettu 2.11.2026 automaattisella axe-core-työkalulla kaikilla kolmella kielellä, ja lisäksi on tarkistettu käsin näppäimistökäyttö, kontrastit, tekstivastineet ja Amisfits-testin toiminta. Ruudunlukijalla tehtyä testausta ja ulkopuolista auditointia ei ole tehty.</p>` },
      { h: 'Huomasitko puutteen? Anna palautetta', html: `
<p>Jos huomaat sivustolla saavutettavuusongelman tai tarvitset sisällön toisessa muodossa, kerro siitä meille:</p>
<address>Sivistysala ry (Sivista)<br><a href="mailto:toimisto@sivista.fi">toimisto@sivista.fi</a><br>Puhelin (09) 1728 5700</address>
<p>Vastaamme 14 päivän kuluessa.</p>` },
      { h: 'Valvontaviranomainen', html: `
<p>Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta 14 päivän kuluessa, voit tehdä ilmoituksen valvontaviranomaiselle. Viranomaisen sivuilla kerrotaan, miten ilmoitus tehdään ja miten asia käsitellään.</p>
<address>Liikenne- ja viestintävirasto Traficom<br>Digitaalisen esteettömyyden ja saavutettavuuden valvontayksikkö<br><a href="https://www.saavutettavuusvaatimukset.fi">www.saavutettavuusvaatimukset.fi</a><br><a href="mailto:saavutettavuus@traficom.fi">saavutettavuus@traficom.fi</a><br>Puhelinvaihde 029 534 5000</address>` },
    ],
  },
}

export default docs
