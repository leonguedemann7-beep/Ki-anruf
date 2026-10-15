export type Status = 'notfall' | 'termin' | 'rueckruf' | 'angebot' | 'erledigt'

export interface Anruf {
  id: string
  /** Uhrzeit „HH:MM“ */
  zeit: string
  name: string
  nummer: string
  status: Status
  /** Anliegen in wenigen Worten, z. B. „Wartung Gastherme“ */
  anliegen: string
  kurzfassung: string
  /** Was Werkly erledigt hat */
  erledigt: string[]
  dauer: string
  /** Kam gerade aus dem KI-Anruf */
  neu?: boolean
}

export type Sprecher = 'werkly' | 'kunde' | 'system'

export interface Zeile {
  /** Sekunden seit Gesprächsbeginn */
  t: number
  wer: Sprecher
  text: string
}

export interface Szenario {
  id: string
  titel: string
  art: string
  beschreibung: string
  start: string
  anrufer: string
  zeilen: Zeile[]
  ergebnis: {
    status: Status
    punkte: string[]
  }
  anruf: Anruf
}

export interface Termin {
  id: string
  datum: Date
  von: string
  bis: string
  titel: string
  kunde: string
  adresse: string
  /** Von Werkly am Telefon vereinbart oder selbst eingetragen */
  quelle: 'werkly' | 'selbst'
  notiz?: string
}

export type SmsVon = 'werkly' | 'kunde' | 'du'

export interface Sms {
  von: SmsVon
  zeit: string
  text: string
  /** z. B. „Bestätigung“, „Erinnerung“, „Foto-Link“ */
  art?: string
  /** Noch nicht gesendet, nur geplant */
  geplant?: string
}

export interface SmsVerlauf {
  id: string
  name: string
  nummer: string
  nachrichten: Sms[]
}

export interface Position {
  text: string
  menge: number
  einheit: string
  preis: number
}

export interface Angebot {
  id: string
  nummer: string
  kunde: string
  adresse: string
  betreff: string
  grundlage: string
  fotos: number
  positionen: Position[]
}
