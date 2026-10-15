// Alle Daten im Prototyp hängen am heutigen Tag, damit die Vorführung nie veraltet wirkt.

const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
]

export const heute = new Date()

/** Nächster Werktag (Mo bis Fr), `n` Werktage nach `ab`. */
export function werktag(n: number, ab: Date = heute): Date {
  const d = new Date(ab)
  let rest = n
  while (rest > 0) {
    d.setDate(d.getDate() + 1)
    const tag = d.getDay()
    if (tag !== 0 && tag !== 6) rest--
  }
  return d
}

/** „Donnerstag, 23. Oktober“ */
export function tagLang(d: Date): string {
  return `${WOCHENTAGE[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}`
}

/** „Donnerstag, 23.10.“ */
export function tagKurz(d: Date): string {
  return `${WOCHENTAGE[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.`
}

export function wochentag(d: Date): string {
  return WOCHENTAGE[d.getDay()]
}

/** Uhrzeit „13:42:05“ aus Startzeit „13:42:00“ plus Sekunden. */
export function uhrzeitPlus(start: string, sekunden: number): string {
  const [h, m, s] = start.split(':').map(Number)
  const gesamt = h * 3600 + m * 60 + s + sekunden
  const hh = Math.floor(gesamt / 3600) % 24
  const mm = Math.floor((gesamt % 3600) / 60)
  const ss = gesamt % 60
  return [hh, mm, ss].map((x) => String(x).padStart(2, '0')).join(':')
}

export function plusTage(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Montag der Woche von `d` */
export function montag(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const tag = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - tag)
  return x
}

export function gleicherTag(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function wochentagKurz(d: Date): string {
  return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][d.getDay()]
}

/** „16.10.“ */
export function datumKurz(d: Date): string {
  return `${d.getDate()}.${d.getMonth() + 1}.`
}

export function euro(betrag: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(betrag)
}
