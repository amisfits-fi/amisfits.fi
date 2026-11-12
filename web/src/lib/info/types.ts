// Tietosivujen (tietosuojaseloste, saavutettavuusseloste) sisältörakenne.
// html on luotettua, käsin kirjoitettua sisältöä (ei käyttäjän syötettä).
export interface InfoSection {
  h: string      // väliotsikko (h2); tyhjä = johdantokappale ilman otsikkoa
  html: string
}
export interface InfoDoc {
  title: string
  updated: string
  sections: InfoSection[]
}
export interface InfoDocs {
  privacy: InfoDoc
  accessibility: InfoDoc
}
