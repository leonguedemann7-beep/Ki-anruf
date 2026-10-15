import type { Angebot } from './typen'

export const MWST = 0.19

export const angebotWeber: Angebot = {
  id: 'ang-weber',
  nummer: 'A-2026-0187',
  kunde: 'Sabine Weber',
  adresse: 'Lindenstraße 30, Musterstadt',
  betreff: 'Austausch Warmwasserspeicher 200 Liter',
  grundlage: 'Anruf heute 10:22 und Foto vom Typenschild per SMS',
  fotos: 1,
  positionen: [
    { text: 'Warmwasserspeicher 200 l, emailliert, liefern', menge: 1, einheit: 'Stk', preis: 1480 },
    { text: 'Altspeicher demontieren und entsorgen', menge: 1, einheit: 'psch', preis: 220 },
    { text: 'Montage und Anschluss inkl. Kleinmaterial', menge: 1, einheit: 'psch', preis: 540 },
    { text: 'Sicherheitsgruppe und Ausdehnungsgefäß', menge: 1, einheit: 'Stk', preis: 310 },
  ],
}

export const angebotKrueger: Angebot = {
  id: 'ang-krueger',
  nummer: 'A-2026-0188',
  kunde: 'Sandra Krüger',
  adresse: 'Birkenallee 3, Musterstadt',
  betreff: 'Badsanierung, ca. 8 m², bodengleiche Dusche',
  grundlage: 'Anruf heute 14:05 und 4 Fotos per SMS',
  fotos: 4,
  positionen: [
    { text: 'Baustelle einrichten, Flur und Treppe abdecken', menge: 1, einheit: 'psch', preis: 280 },
    { text: 'Wanne, WC und Waschtisch demontieren und entsorgen', menge: 1, einheit: 'psch', preis: 890 },
    { text: 'Alte Fliesen Wand und Boden abschlagen, entsorgen', menge: 30, einheit: 'm²', preis: 38 },
    { text: 'Bodengleiche Dusche mit Rinne, Abdichtung', menge: 1, einheit: 'Stk', preis: 2450 },
    { text: 'Wand-WC mit Vorwandelement, montiert', menge: 1, einheit: 'Stk', preis: 1180 },
    { text: 'Waschtisch 80 cm mit Unterschrank und Armatur', menge: 1, einheit: 'Stk', preis: 1340 },
    { text: 'Duschabtrennung Glas', menge: 1, einheit: 'Stk', preis: 980 },
    { text: 'Wasser- und Abwasserleitungen anpassen', menge: 1, einheit: 'psch', preis: 1250 },
    { text: 'Fliesen liefern und verlegen', menge: 30, einheit: 'm²', preis: 115 },
    { text: 'Elektro: Steckdose und Spiegelleuchte (Partnerbetrieb)', menge: 1, einheit: 'psch', preis: 620 },
    { text: 'Silikonfugen und Endreinigung', menge: 1, einheit: 'psch', preis: 240 },
  ],
}
