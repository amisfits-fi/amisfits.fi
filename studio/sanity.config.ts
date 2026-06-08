import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool }    from '@sanity/vision'
import { schemaTypes }   from './schemas'

export default defineConfig({
  // ── Projektin tunnistetiedot ─────────────────────────────────
  // Täytä nämä Sanity-projektin luonnin jälkeen (sanity.io/manage)
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'TÄYTÄ_TÄHÄN',
  dataset:   'production',
  name:      'amisfits',
  title:     'amisfits.fi – Sisällönhallinta',

  // ── Pluginit ─────────────────────────────────────────────────
  plugins: [
    structureTool({
      // Järjestellään Studio kielen mukaan
      structure: (S) =>
        S.list()
          .title('Sisältö')
          .items([
            S.listItem()
              .title('🇫🇮 Suomi')
              .child(
                S.document()
                  .schemaType('onePager')
                  .documentId('onePager-fi')
                  .title('Suomenkielinen sisältö')
              ),
            S.listItem()
              .title('🇸🇪 Svenska')
              .child(
                S.document()
                  .schemaType('onePager')
                  .documentId('onePager-se')
                  .title('Ruotsinkielinen sisältö')
              ),
            S.listItem()
              .title('🇬🇧 English')
              .child(
                S.document()
                  .schemaType('onePager')
                  .documentId('onePager-en')
                  .title('Englanninkielinen sisältö')
              ),
          ]),
    }),
    // Vision-työkalu GROQ-kyselyjen testaamiseen (vain dev)
    visionTool(),
  ],

  // ── Skeematyypit ─────────────────────────────────────────────
  schema: { types: schemaTypes },
})
