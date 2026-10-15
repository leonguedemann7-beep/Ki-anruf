import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Phone } from 'lucide-react'
import type { Anruf, Status } from '../data/typen'
import { heute, tagLang } from '../data/datum'
import { StatusChip } from './StatusChip'

type Filter = 'alle' | Status

const filter: { id: Filter; text: string }[] = [
  { id: 'alle', text: 'Alle' },
  { id: 'rueckruf', text: 'Rückruf nötig' },
  { id: 'termin', text: 'Termine' },
  { id: 'notfall', text: 'Notfälle' },
  { id: 'angebot', text: 'Angebote' },
]

interface Props {
  anrufe: Anruf[]
  offenId: string | null
  setOffenId: (id: string | null) => void
  alsErledigt: (id: string) => void
}

export function Eingang({ anrufe, offenId, setOffenId, alsErledigt }: Props) {
  const [aktiv, setAktiv] = useState<Filter>('alle')
  const offenRef = useRef<HTMLLIElement>(null)

  const rueckrufe = anrufe.filter((a) => a.status === 'rueckruf').length
  const liste = aktiv === 'alle' ? anrufe : anrufe.filter((a) => a.status === aktiv)

  useEffect(() => {
    if (offenId) offenRef.current?.scrollIntoView({ block: 'nearest' })
  }, [offenId])

  return (
    <section className="ansicht" aria-labelledby="eingang-titel">
      <div className="ansicht__kopf">
        <p className="ueberzeile">Heute, {tagLang(heute)}</p>
        <h2 id="eingang-titel" className="h2">Eingang</h2>
        <p className="zusammenfassung">
          <span className="data">{anrufe.length}</span> Anrufe angenommen,{' '}
          <span className="data">{rueckrufe}</span> {rueckrufe === 1 ? 'Rückruf' : 'Rückrufe'} offen.
        </p>
      </div>

      <div className="filter" role="group" aria-label="Anrufe filtern">
        {filter.map((f) => (
          <button
            key={f.id}
            type="button"
            className="filter__knopf"
            aria-pressed={aktiv === f.id}
            onClick={() => setAktiv(f.id)}
          >
            {f.text}
          </button>
        ))}
      </div>

      {liste.length === 0 ? <p className="leer">Keine Anrufe in dieser Auswahl.</p> : null}

      <ul className="anrufe">
        {liste.map((a) => {
          const offen = a.id === offenId
          return (
            <li key={a.id} ref={offen ? offenRef : undefined} className={`anruf${offen ? ' anruf--offen' : ''}${a.neu ? ' anruf--neu' : ''}`}>
              <button
                type="button"
                className="anruf__kopf"
                aria-expanded={offen}
                aria-controls={`anruf-${a.id}`}
                onClick={() => setOffenId(offen ? null : a.id)}
              >
                <span className="anruf__zeile">
                  <span className="data anruf__zeit">{a.zeit}</span>
                  {a.neu ? <span className="neu-marke">Neu</span> : null}
                  <ChevronDown size={20} aria-hidden="true" className="anruf__pfeil" />
                </span>
                <span className="anruf__name">{a.name}</span>
                <span className="anruf__anliegen">{a.anliegen}</span>
                <StatusChip status={a.status} />
              </button>
              <p className="anruf__kurz">{a.kurzfassung}</p>
              <p className="anruf__nummer">
                <Phone size={16} aria-hidden="true" />
                <span className="data">{a.nummer}</span>
                <span className="anruf__dauer">Gespräch {a.dauer} Min.</span>
              </p>
              {offen && (
                <div className="anruf__details" id={`anruf-${a.id}`}>
                  <p className="label">Das hat Werkly erledigt</p>
                  <ul className="haken-liste">
                    {a.erledigt.map((e) => (
                      <li key={e}>
                        <Check size={18} aria-hidden="true" />
                        {e}
                      </li>
                    ))}
                  </ul>
                  <div className="anruf__aktionen">
                    <a className="btn btn--primaer" href={`tel:${a.nummer.replace(/\s/g, '')}`}>
                      <Phone size={20} aria-hidden="true" /> Zurückrufen
                    </a>
                    {a.status === 'rueckruf' && (
                      <button type="button" className="btn btn--sekundaer" onClick={() => alsErledigt(a.id)}>
                        <Check size={20} aria-hidden="true" /> Erledigt
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
