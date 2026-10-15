import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { datumKurz, gleicherTag, heute, montag, plusTage, tagLang, wochentagKurz } from '../data/datum'
import type { Termin } from '../data/typen'

function kalenderwoche(d: Date): number {
  const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const tag = x.getUTCDay() || 7
  x.setUTCDate(x.getUTCDate() + 4 - tag)
  const jahresanfang = new Date(Date.UTC(x.getUTCFullYear(), 0, 1))
  return Math.ceil(((x.getTime() - jahresanfang.getTime()) / 86400000 + 1) / 7)
}

export function Kalender({ termine }: { termine: Termin[] }) {
  const [woche, setWoche] = useState(0)
  const start = plusTage(montag(heute), woche * 7)
  const tage = Array.from({ length: 5 }, (_, i) => plusTage(start, i))
  const vonWerkly = termine.filter(
    (t) => t.quelle === 'werkly' && t.datum >= start && t.datum < plusTage(start, 7),
  ).length

  function springeZu(d: Date) {
    document.getElementById(`tag-${d.toDateString()}`)?.scrollIntoView({ block: 'start' })
  }

  return (
    <section className="ansicht" aria-labelledby="kalender-titel">
      <div className="ansicht__kopf">
        <p className="ueberzeile">KW {kalenderwoche(start)}, {datumKurz(start)} bis {datumKurz(plusTage(start, 4))}</p>
        <h2 id="kalender-titel" className="h2">Kalender</h2>
        <p className="zusammenfassung">
          <span className="data">{vonWerkly}</span> Termine hat Werkly in dieser Woche eingetragen.
        </p>
      </div>

      <div className="umschalter" role="group" aria-label="Woche wählen">
        <button type="button" aria-pressed={woche === 0} onClick={() => setWoche(0)}>Diese Woche</button>
        <button type="button" aria-pressed={woche === 1} onClick={() => setWoche(1)}>Nächste Woche</button>
      </div>

      <div className="wochenleiste">
        {tage.map((d) => {
          const anzahl = termine.filter((t) => gleicherTag(t.datum, d)).length
          const istHeute = gleicherTag(d, heute)
          return (
            <button
              key={d.toDateString()}
              type="button"
              className={`wochenleiste__tag${istHeute ? ' wochenleiste__tag--heute' : ''}`}
              onClick={() => springeZu(d)}
              aria-label={`${tagLang(d)}, ${anzahl} ${anzahl === 1 ? 'Termin' : 'Termine'}${istHeute ? ', heute' : ''}`}
            >
              <span className="wochenleiste__name">{wochentagKurz(d)}</span>
              <span className="data">{d.getDate()}</span>
              <span className="wochenleiste__punkte" aria-hidden="true">
                {Array.from({ length: Math.min(anzahl, 3) }, (_, i) => <span key={i} />)}
              </span>
            </button>
          )
        })}
      </div>

      <p className="legende">
        <span className="legende__marke" aria-hidden="true" /> Von Werkly am Telefon eingetragen
      </p>

      <div className="tage">
        {tage.map((d) => {
          const liste = termine
            .filter((t) => gleicherTag(t.datum, d))
            .sort((a, b) => a.von.localeCompare(b.von))
          return (
            <section key={d.toDateString()} id={`tag-${d.toDateString()}`} className="tag" aria-label={tagLang(d)}>
              <h3 className="tag__titel">
                {tagLang(d)}
                {gleicherTag(d, heute) ? <span className="neu-marke">Heute</span> : null}
              </h3>
              {liste.length === 0 ? (
                <p className="tag__frei">Noch frei.</p>
              ) : (
                <ul className="termine">
                  {liste.map((t) => (
                    <li key={t.id} className={`termin termin--${t.quelle}`}>
                      <p className="data termin__zeit">{t.von} bis {t.bis}</p>
                      <p className="termin__titel">
                        {t.titel}
                        {t.id.startsWith('demo') ? <span className="neu-marke">Neu</span> : null}
                      </p>
                      <p className="termin__kunde">{t.kunde}</p>
                      <p className="termin__adresse">
                        <MapPin size={16} aria-hidden="true" /> {t.adresse}
                      </p>
                      {t.quelle === 'werkly' ? (
                        <p className="termin__quelle">Werkly: {t.notiz}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </section>
  )
}
