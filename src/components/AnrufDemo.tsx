import { useEffect, useRef, useState } from 'react'
import { Check, FastForward, Inbox, Pause, Play, RotateCcw } from 'lucide-react'
import { szenarien } from '../data/szenarien'
import { uhrzeitPlus } from '../data/datum'
import type { Anruf, Szenario, Zeile } from '../data/typen'
import { StatusChip } from './StatusChip'

type Ablauf = 'bereit' | 'laeuft' | 'pause' | 'fertig'

interface Props {
  onFertig: (anruf: Anruf) => void
  onImEingangZeigen: (id: string) => void
  /** Der Anruf ist schon im Eingang geöffnet, dann ist der Knopf nicht mehr die Haupthandlung. */
  imEingangOffen: string | null
}

function wartezeit(zeile: Zeile, ersteZeile: boolean, schnell: boolean): number {
  const basis = ersteZeile ? 500 : Math.min(900 + zeile.text.length * 26, 3800)
  return schnell ? basis / 2.5 : basis
}

function dauer(sekunden: number): string {
  return `${Math.floor(sekunden / 60)}:${String(sekunden % 60).padStart(2, '0')}`
}

export function AnrufDemo({ onFertig, onImEingangZeigen, imEingangOffen }: Props) {
  const [szenarioId, setSzenarioId] = useState(szenarien[0].id)
  const [sichtbar, setSichtbar] = useState(0)
  const [ablauf, setAblauf] = useState<Ablauf>('bereit')
  const [schnell, setSchnell] = useState(false)
  const letzteZeile = useRef<HTMLLIElement>(null)
  const verlaufRef = useRef<HTMLOListElement>(null)
  const ergebnisRef = useRef<HTMLDivElement>(null)
  const onFertigRef = useRef(onFertig)
  onFertigRef.current = onFertig

  const szenario = szenarien.find((s) => s.id === szenarioId) as Szenario
  const zeilen = szenario.zeilen

  useEffect(() => {
    if (ablauf !== 'laeuft') return
    if (sichtbar >= zeilen.length) {
      setAblauf('fertig')
      onFertigRef.current(szenario.anruf)
      return
    }
    const timer = window.setTimeout(
      () => setSichtbar((n) => n + 1),
      wartezeit(zeilen[sichtbar], sichtbar === 0, schnell),
    )
    return () => window.clearTimeout(timer)
  }, [ablauf, sichtbar, zeilen, schnell, szenario])

  useEffect(() => {
    if (sichtbar === 0) return
    const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const verlauf = verlaufRef.current
    // Am Laptop scrollt nur der Verlauf, am Handy die ganze Seite.
    if (verlauf && verlauf.scrollHeight > verlauf.clientHeight) {
      verlauf.scrollTo({ top: verlauf.scrollHeight, behavior: ruhig ? 'auto' : 'smooth' })
    } else {
      letzteZeile.current?.scrollIntoView({ block: 'nearest', behavior: ruhig ? 'auto' : 'smooth' })
    }
  }, [sichtbar])

  useEffect(() => {
    if (ablauf === 'fertig') ergebnisRef.current?.scrollIntoView({ block: 'nearest' })
  }, [ablauf])

  function waehle(id: string) {
    setSzenarioId(id)
    setSichtbar(0)
    setAblauf('bereit')
  }

  function neuStarten() {
    setSichtbar(0)
    setAblauf('laeuft')
  }

  function allesZeigen() {
    setSichtbar(zeilen.length)
    setAblauf('laeuft')
  }

  const naechste = ablauf === 'laeuft' ? zeilen[sichtbar] : undefined
  const aktuelleSekunde = sichtbar > 0 ? zeilen[sichtbar - 1].t : 0

  return (
    <section className="demo" aria-labelledby="demo-titel">
      <div className="demo__kopf">
        <p className="ueberzeile">KI-Anruf</p>
        <h1 id="demo-titel" className="h2">Du stehst auf der Leiter, das Handy klingelt.</h1>
        <p className="einleitung">Werkly nimmt an. Such dir ein Beispiel aus und hör zu, was passiert.</p>
      </div>

      <fieldset className="szenarien">
        <legend className="visually-hidden">Beispiel wählen</legend>
        {szenarien.map((s) => (
          <label key={s.id} className={`szenario${s.id === szenarioId ? ' szenario--aktiv' : ''}`}>
            <input
              type="radio"
              name="szenario"
              value={s.id}
              checked={s.id === szenarioId}
              onChange={() => waehle(s.id)}
              className="visually-hidden"
            />
            <span className="szenario__art">{s.art}</span>
            <span className="szenario__titel">{s.titel}</span>
            <span className="szenario__text">{s.beschreibung}</span>
          </label>
        ))}
      </fieldset>

      <div className="steuerung">
        {ablauf === 'bereit' && (
          <button type="button" className="btn btn--primaer" onClick={neuStarten}>
            <Play size={20} aria-hidden="true" /> Anruf starten
          </button>
        )}
        {ablauf === 'laeuft' && (
          <button type="button" className="btn btn--sekundaer" onClick={() => setAblauf('pause')}>
            <Pause size={20} aria-hidden="true" /> Anhalten
          </button>
        )}
        {ablauf === 'pause' && (
          <button type="button" className="btn btn--primaer" onClick={() => setAblauf('laeuft')}>
            <Play size={20} aria-hidden="true" /> Weiter
          </button>
        )}
        {ablauf === 'fertig' && (
          <button type="button" className="btn btn--sekundaer" onClick={neuStarten}>
            <RotateCcw size={20} aria-hidden="true" /> Noch mal abspielen
          </button>
        )}
        {ablauf !== 'fertig' && (
          <button type="button" className="btn btn--leise" onClick={allesZeigen}>
            <FastForward size={20} aria-hidden="true" /> Alles zeigen
          </button>
        )}
        <button
          type="button"
          className="btn btn--leise"
          aria-pressed={schnell}
          onClick={() => setSchnell((x) => !x)}
        >
          Tempo: {schnell ? 'schnell' : 'normal'}
        </button>
      </div>

      <div className="gespraech">
        <div className="gespraech__kopf">
          <div>
            <span className="label">Anrufer</span>
            <span className="gespraech__name">{szenario.anrufer}</span>
            <span className="data">{szenario.anruf.nummer}</span>
          </div>
          <div className="gespraech__uhr">
            <span className="label">
              {ablauf === 'bereit' ? 'Bereit' : ablauf === 'fertig' ? 'Beendet' : ablauf === 'pause' ? 'Angehalten' : 'Läuft'}
            </span>
            <span className="data">{dauer(aktuelleSekunde)}</span>
          </div>
        </div>

        {sichtbar === 0 && ablauf === 'bereit' ? (
          <p className="gespraech__leer">Drück auf „Anruf starten“. Das Gespräch erscheint hier Zeile für Zeile.</p>
        ) : null}

        <ol ref={verlaufRef} className="verlauf" role="log" aria-live="polite" aria-label="Gesprächsverlauf">
          {zeilen.slice(0, sichtbar).map((z, i) => (
            <li
              key={i}
              ref={i === sichtbar - 1 ? letzteZeile : undefined}
              className={`zeile zeile--${z.wer}`}
            >
              {z.wer === 'system' ? (
                <p className="zeile__system">
                  <span className="data">{uhrzeitPlus(szenario.start, z.t)}</span> {z.text}
                </p>
              ) : (
                <>
                  <p className="zeile__meta">
                    <span className="label">{z.wer === 'werkly' ? 'Werkly' : szenario.anrufer}</span>
                    <span className="data">{uhrzeitPlus(szenario.start, z.t)}</span>
                  </p>
                  <p className="zeile__blase">{z.text}</p>
                </>
              )}
            </li>
          ))}
          {naechste && naechste.wer !== 'system' && sichtbar > 0 ? (
            <li className={`zeile zeile--${naechste.wer} zeile--tippt`} aria-hidden="true">
              <p className="zeile__blase">
                {naechste.wer === 'werkly' ? 'Werkly spricht' : `${szenario.anrufer} spricht`}
                <span className="punkte"><span>.</span><span>.</span><span>.</span></span>
              </p>
            </li>
          ) : null}
        </ol>
      </div>

      {ablauf === 'fertig' && (
        <div ref={ergebnisRef} className="ergebnis" role="status">
          <p className="ueberzeile">Das hat Werkly daraus gemacht</p>
          <StatusChip status={szenario.ergebnis.status} />
          <ul className="ergebnis__liste">
            {szenario.ergebnis.punkte.map((p) => (
              <li key={p}>
                <Check size={20} aria-hidden="true" className="ergebnis__haken" />
                {p}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={`btn ${imEingangOffen === szenario.anruf.id ? 'btn--sekundaer' : 'btn--primaer'}`}
            onClick={() => onImEingangZeigen(szenario.anruf.id)}
          >
            <Inbox size={20} aria-hidden="true" /> Im Eingang ansehen
          </button>
        </div>
      )}
    </section>
  )
}
