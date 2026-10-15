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
  /** Kam gerade aus der Anruf-Demo */
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
