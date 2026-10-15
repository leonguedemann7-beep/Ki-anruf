import { betrieb } from './betrieb'

export interface Oeffnungszeit {
  tag: string
  offen: boolean
  von: string
  bis: string
}

export interface Einstellungen {
  zeiten: Oeffnungszeit[]
  notdienst: boolean
  notdienstNummer: string
  gewerke: string[]
  begruessung: string
}

export const alleGewerke = ['Sanitär', 'Heizung', 'Klima', 'Lüftung', 'Solar', 'Badsanierung', 'Wärmepumpe']

export const standard: Einstellungen = {
  zeiten: [
    { tag: 'Montag', offen: true, von: '07:00', bis: '17:00' },
    { tag: 'Dienstag', offen: true, von: '07:00', bis: '17:00' },
    { tag: 'Mittwoch', offen: true, von: '07:00', bis: '17:00' },
    { tag: 'Donnerstag', offen: true, von: '07:00', bis: '17:00' },
    { tag: 'Freitag', offen: true, von: '07:00', bis: '14:00' },
    { tag: 'Samstag', offen: false, von: '09:00', bis: '12:00' },
    { tag: 'Sonntag', offen: false, von: '09:00', bis: '12:00' },
  ],
  notdienst: true,
  notdienstNummer: betrieb.nummerInhaber,
  gewerke: ['Sanitär', 'Heizung', 'Badsanierung'],
  begruessung: `${betrieb.name}, guten Tag. Hier ist Werkly, der digitale Assistent des Betriebs. Sie sprechen mit einer KI. Wie kann ich Ihnen helfen?`,
}

const SCHLUESSEL = 'werkly-prototyp-einstellungen'

export function laden(): Einstellungen {
  try {
    const roh = localStorage.getItem(SCHLUESSEL)
    if (roh) return { ...standard, ...JSON.parse(roh) }
  } catch {
    // Ohne Speicher laufen die Standardwerte.
  }
  return standard
}

export function speichern(e: Einstellungen): boolean {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(e))
    return true
  } catch {
    return false
  }
}

export function loeschen() {
  try {
    localStorage.removeItem(SCHLUESSEL)
  } catch {
    // nichts zu tun
  }
}
