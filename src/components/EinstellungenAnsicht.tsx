import { useState } from 'react'
import { Check, RotateCcw, Save } from 'lucide-react'
import { alleGewerke, loeschen, speichern, standard, type Einstellungen } from '../data/einstellungen'

// Halbstündlich von 5 bis 22 Uhr. Eigene Auswahl statt Zeitfeld, damit überall 24-Stunden-Format steht.
const uhrzeiten = Array.from({ length: 35 }, (_, i) => {
  const minuten = 5 * 60 + i * 30
  return `${String(Math.floor(minuten / 60)).padStart(2, '0')}:${minuten % 60 === 0 ? '00' : '30'}`
})

interface Props {
  werte: Einstellungen
  onSpeichern: (e: Einstellungen) => void
}

export function EinstellungenAnsicht({ werte, onSpeichern }: Props) {
  const [e, setE] = useState(werte)
  const [meldung, setMeldung] = useState<string | null>(null)
  const geaendert = JSON.stringify(e) !== JSON.stringify(werte)

  const setze = (teil: Partial<Einstellungen>) => {
    setE((alt) => ({ ...alt, ...teil }))
    setMeldung(null)
  }
  const setzeZeit = (i: number, teil: Partial<Einstellungen['zeiten'][number]>) =>
    setze({ zeiten: e.zeiten.map((z, j) => (j === i ? { ...z, ...teil } : z)) })

  return (
    <section className="ansicht" aria-labelledby="einstellungen-titel">
      <div className="ansicht__kopf">
        <p className="ueberzeile">Dein Betrieb</p>
        <h2 id="einstellungen-titel" className="h2">Einstellungen</h2>
        <p className="zusammenfassung">So nimmt Werkly deine Anrufe an. Alles wird nur in diesem Browser gespeichert.</p>
      </div>

      <form
        className="formular"
        onSubmit={(ev) => {
          ev.preventDefault()
          const ok = speichern(e)
          onSpeichern(e)
          setMeldung(ok ? 'Gespeichert.' : 'Gespeichert, aber nur bis du die Seite neu lädst.')
        }}
      >
        <fieldset className="gruppe">
          <legend className="gruppe__titel">Öffnungszeiten</legend>
          <p className="gruppe__hilfe">Außerhalb dieser Zeiten nimmt Werkly an und sagt, wann das Büro wieder besetzt ist.</p>
          <ul className="zeiten">
            {e.zeiten.map((z, i) => (
              <li key={z.tag} className="zeit">
                <label className="schalter-zeile">
                  <input type="checkbox" checked={z.offen} onChange={(ev) => setzeZeit(i, { offen: ev.target.checked })} />
                  <span className="zeit__tag">{z.tag}</span>
                </label>
                {z.offen ? (
                  <span className="zeit__felder">
                    <label>
                      <span className="visually-hidden">{z.tag} von</span>
                      <select value={z.von} onChange={(ev) => setzeZeit(i, { von: ev.target.value })}>
                        {uhrzeiten.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </label>
                    <span aria-hidden="true">bis</span>
                    <label>
                      <span className="visually-hidden">{z.tag} bis</span>
                      <select value={z.bis} onChange={(ev) => setzeZeit(i, { bis: ev.target.value })}>
                        {uhrzeiten.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </label>
                  </span>
                ) : (
                  <span className="zeit__zu">Geschlossen</span>
                )}
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="gruppe">
          <legend className="gruppe__titel">Notdienst</legend>
          <label className="schalter-zeile schalter-zeile--gross">
            <input type="checkbox" role="switch" checked={e.notdienst} onChange={(ev) => setze({ notdienst: ev.target.checked })} />
            <span>{e.notdienst ? 'Notdienst an' : 'Notdienst aus'}</span>
          </label>
          <p className="gruppe__hilfe">
            {e.notdienst
              ? 'Bei Rohrbruch, Heizungsausfall oder Gasgeruch stellt Werkly sofort zu dieser Nummer durch.'
              : 'Werkly nimmt Notfälle auf, nennt den örtlichen Notdienst und schickt dir eine SMS.'}
          </p>
          {e.notdienst && (
            <label className="feld">
              <span className="label">Durchstellen an</span>
              <input type="tel" value={e.notdienstNummer} onChange={(ev) => setze({ notdienstNummer: ev.target.value })} />
            </label>
          )}
        </fieldset>

        <fieldset className="gruppe">
          <legend className="gruppe__titel">Gewerke</legend>
          <p className="gruppe__hilfe">Für diese Arbeiten nimmt Werkly Aufträge an. Alles andere lehnt es freundlich ab.</p>
          <div className="gewerke">
            {alleGewerke.map((g) => (
              <label key={g} className="gewerk">
                <input
                  type="checkbox"
                  checked={e.gewerke.includes(g)}
                  onChange={(ev) =>
                    setze({ gewerke: ev.target.checked ? [...e.gewerke, g] : e.gewerke.filter((x) => x !== g) })
                  }
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="gruppe">
          <legend className="gruppe__titel">Begrüßung</legend>
          <label className="feld">
            <span className="gruppe__hilfe">Das sagt Werkly, wenn es abnimmt. Der Satz mit der KI muss drinbleiben, Anrufer sollen es wissen.</span>
            <textarea rows={4} value={e.begruessung} onChange={(ev) => setze({ begruessung: ev.target.value })} />
          </label>
        </fieldset>

        <div className="aktionen">
          <button type="submit" className="btn btn--primaer" disabled={!geaendert}>
            <Save size={20} aria-hidden="true" /> Speichern
          </button>
          <button
            type="button"
            className="btn btn--sekundaer"
            onClick={() => {
              loeschen()
              setE(standard)
              onSpeichern(standard)
              setMeldung('Auf Beispielwerte zurückgesetzt.')
            }}
          >
            <RotateCcw size={20} aria-hidden="true" /> Zurücksetzen
          </button>
        </div>
        {meldung && (
          <p className="erfolg" role="status">
            <Check size={20} aria-hidden="true" /> {meldung}
          </p>
        )}
      </form>
    </section>
  )
}
