import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Check, ChevronRight, Clock, Send } from 'lucide-react'
import type { Sms, SmsVerlauf } from '../data/typen'

interface Props {
  verlaeufe: SmsVerlauf[]
  onSenden: (id: string, text: string) => void
}

function absender(s: Sms): string {
  if (s.von === 'kunde') return 'Kunde'
  if (s.von === 'du') return 'Von dir'
  return 'Werkly, automatisch'
}

export function SmsAnsicht({ verlaeufe, onSenden }: Props) {
  const [offenId, setOffenId] = useState<string | null>(null)
  const [entwurf, setEntwurf] = useState('')
  const zurueckRef = useRef<HTMLButtonElement>(null)
  const offen = verlaeufe.find((v) => v.id === offenId)

  useEffect(() => {
    if (offen) zurueckRef.current?.focus()
  }, [offen])

  if (offen) {
    return (
      <section className="ansicht" aria-labelledby="sms-titel">
        <button ref={zurueckRef} type="button" className="btn btn--leise zurueck" onClick={() => setOffenId(null)}>
          <ArrowLeft size={20} aria-hidden="true" /> Alle SMS
        </button>
        <div className="ansicht__kopf">
          <p className="ueberzeile">SMS-Verlauf</p>
          <h2 id="sms-titel" className="h2">{offen.name}</h2>
          <p className="data">{offen.nummer}</p>
        </div>

        <ol className="sms-liste" aria-label="Nachrichten">
          {offen.nachrichten.map((n, i) => (
            <li key={i} className={`sms sms--${n.von}${n.geplant ? ' sms--geplant' : ''}`}>
              <p className="sms__meta">
                <span className="label">{absender(n)}{n.art ? `, ${n.art}` : ''}</span>
                {!n.geplant && <span className="data">{n.zeit}</span>}
              </p>
              <p className="sms__blase">{n.text}</p>
              {n.geplant ? (
                <p className="sms__status">
                  <Clock size={16} aria-hidden="true" /> Geplant für <span className="data">{n.geplant}</span>
                </p>
              ) : n.von !== 'kunde' ? (
                <p className="sms__status sms__status--ok">
                  <Check size={16} aria-hidden="true" /> Zugestellt
                </p>
              ) : null}
            </li>
          ))}
        </ol>

        <form
          className="sms-eingabe"
          onSubmit={(e) => {
            e.preventDefault()
            if (!entwurf.trim()) return
            onSenden(offen.id, entwurf.trim())
            setEntwurf('')
          }}
        >
          <label htmlFor="sms-text" className="label">Antwort an {offen.name}</label>
          <textarea
            id="sms-text"
            rows={3}
            value={entwurf}
            onChange={(e) => setEntwurf(e.target.value)}
            placeholder="Kurze Nachricht schreiben"
          />
          <button type="submit" className="btn btn--primaer" disabled={!entwurf.trim()}>
            <Send size={20} aria-hidden="true" /> Senden
          </button>
          <p className="hinweis-klein">Im Prototyp wird nichts wirklich verschickt.</p>
        </form>
      </section>
    )
  }

  return (
    <section className="ansicht" aria-labelledby="sms-titel">
      <div className="ansicht__kopf">
        <p className="ueberzeile">Heute</p>
        <h2 id="sms-titel" className="h2">SMS</h2>
        <p className="zusammenfassung">
          Werkly bestätigt jeden Termin per SMS und erinnert am Vortag.
        </p>
      </div>
      <ul className="verlaeufe">
        {verlaeufe.map((v) => {
          const letzte = v.nachrichten.filter((n) => !n.geplant).at(-1)!
          const geplant = v.nachrichten.some((n) => n.geplant)
          return (
            <li key={v.id}>
              <button type="button" className="verlauf-karte" onClick={() => setOffenId(v.id)}>
                <span className="verlauf-karte__zeile">
                  <span className="verlauf-karte__name">{v.name}</span>
                  {v.id.startsWith('demo') ? <span className="neu-marke">Neu</span> : null}
                  <span className="data verlauf-karte__zeit">{letzte.zeit}</span>
                </span>
                <span className="verlauf-karte__text">{letzte.von === 'kunde' ? '' : letzte.von === 'du' ? 'Du: ' : 'Werkly: '}{letzte.text}</span>
                {geplant ? (
                  <span className="verlauf-karte__geplant">
                    <Clock size={16} aria-hidden="true" /> Erinnerung geplant
                  </span>
                ) : null}
                <ChevronRight size={20} aria-hidden="true" className="verlauf-karte__pfeil" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
