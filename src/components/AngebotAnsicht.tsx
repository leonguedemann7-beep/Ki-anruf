import { useState } from 'react'
import { Check, Image, Pencil, Plus, Send, Trash2, Undo2 } from 'lucide-react'
import { MWST } from '../data/angebote'
import { euro } from '../data/datum'
import type { Angebot, Position } from '../data/typen'

type Zustand = 'entwurf' | 'bearbeiten' | 'freigegeben'

function zahl(x: number): string {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(x)
}

export function AngebotAnsicht({ angebote }: { angebote: Angebot[] }) {
  const [aktivId, setAktivId] = useState(angebote[0].id)
  const [positionen, setPositionen] = useState<Record<string, Position[]>>({})
  const [zustand, setZustand] = useState<Record<string, Zustand>>({})

  const angebot = angebote.find((a) => a.id === aktivId) ?? angebote[0]
  const pos = positionen[angebot.id] ?? angebot.positionen
  const z = zustand[angebot.id] ?? 'entwurf'
  const netto = pos.reduce((s, p) => s + p.menge * p.preis, 0)
  const mwst = Math.round(netto * MWST * 100) / 100

  const setZ = (neu: Zustand) => setZustand((alt) => ({ ...alt, [angebot.id]: neu }))
  const aendere = (i: number, feld: Partial<Position>) =>
    setPositionen((alt) => ({
      ...alt,
      [angebot.id]: pos.map((p, j) => (j === i ? { ...p, ...feld } : p)),
    }))
  const setPos = (liste: Position[]) => setPositionen((alt) => ({ ...alt, [angebot.id]: liste }))

  return (
    <section className="ansicht" aria-labelledby="angebot-titel">
      <div className="ansicht__kopf">
        <p className="ueberzeile">{z === 'freigegeben' ? 'Freigegeben' : 'Entwurf von Werkly'}</p>
        <h2 id="angebot-titel" className="h2">Angebot</h2>
      </div>

      {angebote.length > 1 && (
        <div className="filter" role="group" aria-label="Angebot wählen">
          {angebote.map((a) => (
            <button key={a.id} type="button" className="filter__knopf" aria-pressed={a.id === angebot.id} onClick={() => setAktivId(a.id)}>
              {a.kunde}
            </button>
          ))}
        </div>
      )}

      <div className="angebot">
        <div className="angebot__kopf">
          <p className="data">{angebot.nummer}</p>
          <p className="angebot__betreff">{angebot.betreff}</p>
          <p>{angebot.kunde}<br />{angebot.adresse}</p>
        </div>

        <div className="hinweis hinweis--markiert">
          <p>Werkly hat den Entwurf vorbereitet. Grundlage: {angebot.grundlage}. Prüf Maße und Preise, bevor du freigibst.</p>
        </div>

        <ul className="fotos" aria-label={`${angebot.fotos} Fotos vom Kunden`}>
          {Array.from({ length: angebot.fotos }, (_, i) => (
            <li key={i} className="foto">
              <Image size={24} aria-hidden="true" />
              <span>Foto {i + 1}</span>
            </li>
          ))}
        </ul>

        <ol className="positionen">
          {pos.map((p, i) =>
            z === 'bearbeiten' ? (
              <li key={i} className="position position--bearbeiten">
                <span className="data position__nr">{i + 1}</span>
                <div className="position__felder">
                  <label>
                    <span className="label">Leistung</span>
                    <input type="text" value={p.text} onChange={(e) => aendere(i, { text: e.target.value })} />
                  </label>
                  <div className="position__zahlen">
                    <label>
                      <span className="label">Menge ({p.einheit})</span>
                      <input type="number" inputMode="decimal" min={0} step="any" value={p.menge} onChange={(e) => aendere(i, { menge: Number(e.target.value) })} />
                    </label>
                    <label>
                      <span className="label">Preis je {p.einheit} in €</span>
                      <input type="number" inputMode="decimal" min={0} step="any" value={p.preis} onChange={(e) => aendere(i, { preis: Number(e.target.value) })} />
                    </label>
                  </div>
                  <button type="button" className="btn btn--leise" onClick={() => setPos(pos.filter((_, j) => j !== i))}>
                    <Trash2 size={20} aria-hidden="true" /> Position {i + 1} entfernen
                  </button>
                </div>
              </li>
            ) : (
              <li key={i} className="position">
                <span className="data position__nr">{i + 1}</span>
                <div className="position__text">
                  <p>{p.text}</p>
                  <p className="data position__rechnung">{zahl(p.menge)} {p.einheit} × {euro(p.preis)}</p>
                </div>
                <p className="data position__summe">{euro(p.menge * p.preis)}</p>
              </li>
            ),
          )}
        </ol>
        {z === 'bearbeiten' && (
          <button
            type="button"
            className="btn btn--leise"
            onClick={() => setPos([...pos, { text: 'Neue Position', menge: 1, einheit: 'Stk', preis: 0 }])}
          >
            <Plus size={20} aria-hidden="true" /> Position hinzufügen
          </button>
        )}

        <dl className="summen">
          <div><dt>Netto</dt><dd className="data">{euro(netto)}</dd></div>
          <div><dt>zzgl. 19 % MwSt.</dt><dd className="data">{euro(mwst)}</dd></div>
          <div className="summen__brutto"><dt>Brutto</dt><dd className="data">{euro(netto + mwst)}</dd></div>
        </dl>
      </div>

      <div className="aktionen">
        {z === 'entwurf' && (
          <>
            <button type="button" className="btn btn--primaer" onClick={() => setZ('freigegeben')}>
              <Send size={20} aria-hidden="true" /> Freigeben und senden
            </button>
            <button type="button" className="btn btn--sekundaer" onClick={() => setZ('bearbeiten')}>
              <Pencil size={20} aria-hidden="true" /> Ändern
            </button>
          </>
        )}
        {z === 'bearbeiten' && (
          <>
            <button type="button" className="btn btn--primaer" onClick={() => setZ('entwurf')}>
              <Check size={20} aria-hidden="true" /> Änderungen übernehmen
            </button>
            <button
              type="button"
              className="btn btn--sekundaer"
              onClick={() => {
                setPositionen((alt) => {
                  const rest = { ...alt }
                  delete rest[angebot.id]
                  return rest
                })
                setZ('entwurf')
              }}
            >
              <Undo2 size={20} aria-hidden="true" /> Zurück zum Werkly-Entwurf
            </button>
          </>
        )}
        {z === 'freigegeben' && (
          <>
            <p className="erfolg" role="status">
              <Check size={20} aria-hidden="true" /> Freigegeben. Werkly schickt das Angebot per E-Mail und SMS an {angebot.kunde}.
            </p>
            <button type="button" className="btn btn--sekundaer" onClick={() => setZ('entwurf')}>
              <Undo2 size={20} aria-hidden="true" /> Freigabe zurücknehmen
            </button>
          </>
        )}
      </div>
      <p className="hinweis-klein">Im Prototyp wird nichts wirklich verschickt.</p>
    </section>
  )
}
