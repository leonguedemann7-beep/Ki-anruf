import { useEffect, useRef, useState } from 'react'
import { RotateCcw, Send } from 'lucide-react'
import { vorbereiteteAntwort } from '../data/antworten'
import type { Einstellungen } from '../data/einstellungen'

interface Nachricht {
  rolle: 'kunde' | 'werkly'
  text: string
  zeit: string
}

type Quelle = 'unbekannt' | 'claude' | 'vorbereitet'

function jetzt(): string {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function Ausprobieren({ einstellungen }: { einstellungen: Einstellungen }) {
  const start = (): Nachricht[] => [{ rolle: 'werkly', text: einstellungen.begruessung, zeit: jetzt() }]
  const [verlauf, setVerlauf] = useState<Nachricht[]>(start)
  const [entwurf, setEntwurf] = useState('')
  const [wartet, setWartet] = useState(false)
  const [quelle, setQuelle] = useState<Quelle>('unbekannt')
  const endeRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    endeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [verlauf, wartet])

  async function antwortHolen(neu: Nachricht[]): Promise<string> {
    if (quelle !== 'vorbereitet') {
      try {
        const zeiten = einstellungen.zeiten
          .map((z) => (z.offen ? `${z.tag} ${z.von} bis ${z.bis}` : `${z.tag} geschlossen`))
          .join(', ')
        const r = await fetch('/api/werkly', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Die Begrüßung bleibt draußen, das Gespräch beginnt mit dem Kunden.
            nachrichten: neu.slice(1).map(({ rolle, text }) => ({ rolle, text })),
            betrieb: { gewerke: einstellungen.gewerke, oeffnungszeiten: zeiten, notdienst: einstellungen.notdienst },
          }),
        })
        if (r.ok) {
          const daten = (await r.json()) as { text?: string }
          if (daten.text) {
            setQuelle('claude')
            return daten.text
          }
        }
      } catch {
        // Kein Server da, etwa bei npm run dev. Dann laufen die vorbereiteten Antworten.
      }
      setQuelle('vorbereitet')
    }
    const kunde = neu.at(-1)!.text
    const bisher = neu.slice(0, -1).filter((n) => n.rolle === 'werkly').map((n) => n.text)
    await new Promise((ok) => window.setTimeout(ok, 700))
    return vorbereiteteAntwort(kunde, bisher)
  }

  async function senden() {
    const text = entwurf.trim()
    if (!text || wartet) return
    const neu = [...verlauf, { rolle: 'kunde' as const, text, zeit: jetzt() }]
    setVerlauf(neu)
    setEntwurf('')
    setWartet(true)
    const antwort = await antwortHolen(neu)
    setVerlauf((v) => [...v, { rolle: 'werkly', text: antwort, zeit: jetzt() }])
    setWartet(false)
  }

  return (
    <div className="demo">
      <p className="einleitung-klein">
        Schreib, was ein Kunde am Telefon sagen würde. Zum Beispiel: „Meine Heizung bleibt kalt.“
      </p>
      <p className="quelle" role="status">
        {quelle === 'claude' && 'Antworten kommen live von Claude, mit dem Systemprompt für einen SHK-Betrieb.'}
        {quelle === 'vorbereitet' && 'Kein Claude-Schlüssel hinterlegt. Es laufen vorbereitete Antworten.'}
        {quelle === 'unbekannt' && 'Mit hinterlegtem Claude-Schlüssel antwortet Claude, sonst laufen vorbereitete Antworten.'}
      </p>

      <div className="gespraech">
        <div className="gespraech__kopf">
          <div>
            <span className="label">Anrufer</span>
            <span className="gespraech__name">Du als Kunde</span>
          </div>
          <div className="gespraech__uhr">
            <span className="label">Läuft</span>
          </div>
        </div>
        <ol className="verlauf" role="log" aria-live="polite" aria-label="Gesprächsverlauf">
          {verlauf.map((n, i) => (
            <li key={i} ref={i === verlauf.length - 1 && !wartet ? endeRef : undefined} className={`zeile zeile--${n.rolle}`}>
              <p className="zeile__meta">
                <span className="label">{n.rolle === 'werkly' ? 'Werkly' : 'Du'}</span>
                <span className="data">{n.zeit}</span>
              </p>
              <p className="zeile__blase">{n.text}</p>
            </li>
          ))}
          {wartet && (
            <li ref={endeRef} className="zeile zeile--werkly zeile--tippt" aria-hidden="true">
              <p className="zeile__blase">
                Werkly spricht<span className="punkte"><span>.</span><span>.</span><span>.</span></span>
              </p>
            </li>
          )}
        </ol>
      </div>

      <form
        className="sms-eingabe"
        onSubmit={(e) => {
          e.preventDefault()
          void senden()
        }}
      >
        <label htmlFor="kunde-text" className="label">Was sagst du als Kunde?</label>
        <textarea
          id="kunde-text"
          rows={2}
          value={entwurf}
          onChange={(e) => setEntwurf(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void senden()
            }
          }}
          placeholder="Hallo, bei mir tropft es unter der Spüle."
        />
        <div className="aktionen">
          <button type="submit" className="btn btn--primaer" disabled={!entwurf.trim() || wartet}>
            <Send size={20} aria-hidden="true" /> Sagen
          </button>
          <button
            type="button"
            className="btn btn--sekundaer"
            onClick={() => {
              setVerlauf(start())
              setEntwurf('')
            }}
          >
            <RotateCcw size={20} aria-hidden="true" /> Neues Gespräch
          </button>
        </div>
      </form>
    </div>
  )
}
