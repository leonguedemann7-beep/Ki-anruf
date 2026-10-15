import { useEffect, useState } from 'react'
import { CalendarDays, FileText, Inbox, MessageSquare, PhoneIncoming, Settings } from 'lucide-react'
import { AnrufDemo } from './components/AnrufDemo'
import { Eingang } from './components/Eingang'
import { Logo } from './components/Logo'
import { AngebotAnsicht } from './components/AngebotAnsicht'
import { Ausprobieren } from './components/Ausprobieren'
import { EinstellungenAnsicht } from './components/EinstellungenAnsicht'
import { Kalender } from './components/Kalender'
import { KiAnruf } from './components/KiAnruf'
import { SmsAnsicht } from './components/SmsAnsicht'
import { anrufeHeute } from './data/anrufe'
import { angebotKrueger, angebotWeber } from './data/angebote'
import { betrieb, hinweisBeispiel } from './data/betrieb'
import { laden } from './data/einstellungen'
import { smsAusDemo, smsBasis } from './data/sms'
import { szenarien } from './data/szenarien'
import { termineAusDemo, termineBasis } from './data/termine'
import type { Anruf, Sms } from './data/typen'

type Tab = 'demo' | 'eingang' | 'kalender' | 'sms' | 'angebot' | 'einstellungen'

const tabs: { id: Tab; text: string; Icon: typeof Inbox }[] = [
  { id: 'demo', text: 'KI-Anruf', Icon: PhoneIncoming },
  { id: 'eingang', text: 'Eingang', Icon: Inbox },
  { id: 'kalender', text: 'Kalender', Icon: CalendarDays },
  { id: 'sms', text: 'SMS', Icon: MessageSquare },
  { id: 'angebot', text: 'Angebot', Icon: FileText },
]

function useBreit() {
  const abfrage = '(min-width: 1024px)'
  const [breit, setBreit] = useState(() => window.matchMedia(abfrage).matches)
  useEffect(() => {
    const mq = window.matchMedia(abfrage)
    const aendern = () => setBreit(mq.matches)
    mq.addEventListener('change', aendern)
    return () => mq.removeEventListener('change', aendern)
  }, [])
  return breit
}

export default function App() {
  const breit = useBreit()
  const [tab, setTab] = useState<Tab>(breit ? 'eingang' : 'demo')
  const [anrufe, setAnrufe] = useState<Anruf[]>(anrufeHeute)
  const [offenId, setOffenId] = useState<string | null>(null)
  const [gespielt, setGespielt] = useState<string[]>([])
  const [gesendet, setGesendet] = useState<Record<string, Sms[]>>({})
  const [einstellungen, setEinstellungen] = useState(laden)

  useEffect(() => {
    if (breit && tab === 'demo') setTab('eingang')
  }, [breit, tab])

  function anrufAusDemo(anruf: Anruf) {
    const szenario = szenarien.find((sz) => sz.anruf.id === anruf.id)
    if (szenario) setGespielt((g) => (g.includes(szenario.id) ? g : [...g, szenario.id]))
    setAnrufe((liste) =>
      [{ ...anruf, neu: true }, ...liste.filter((a) => a.id !== anruf.id)].sort((a, b) => b.zeit.localeCompare(a.zeit)),
    )
  }

  function wechsle(neu: Tab) {
    setTab(neu)
    if (!breit) window.scrollTo({ top: 0 })
  }

  function imEingangZeigen(id: string) {
    setTab('eingang')
    setOffenId(id)
    if (!breit) window.scrollTo({ top: 0 })
  }

  function alsErledigt(id: string) {
    setAnrufe((liste) => liste.map((a) => (a.id === id ? { ...a, status: 'erledigt' } : a)))
  }

  function smsSenden(id: string, text: string) {
    const zeit = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    setGesendet((g) => ({ ...g, [id]: [...(g[id] ?? []), { von: 'du', zeit, text }] }))
  }

  // Was der KI-Anruf erzeugt, taucht in Kalender, SMS und Angebot auf.
  const termine = [...termineBasis, ...gespielt.flatMap((id) => (termineAusDemo[id] ? [termineAusDemo[id]] : []))]
  const verlaeufe = [...[...gespielt].reverse().flatMap((id) => (smsAusDemo[id] ? [smsAusDemo[id]] : [])), ...smsBasis].map(
    (v) => ({ ...v, nachrichten: [...v.nachrichten, ...(gesendet[v.id] ?? [])] }),
  )
  const angebote = gespielt.includes('bad') ? [angebotKrueger, angebotWeber] : [angebotWeber]

  const neue = anrufe.filter((a) => a.neu).length
  const sichtbareTabs = breit ? tabs.filter((t) => t.id !== 'demo') : tabs

  const demo = (
    <KiAnruf
      beispiele={
        <AnrufDemo
          onFertig={anrufAusDemo}
          onImEingangZeigen={imEingangZeigen}
          imEingangOffen={breit && tab === 'eingang' ? offenId : null}
          begruessung={einstellungen.begruessung}
        />
      }
      ausprobieren={<Ausprobieren key={einstellungen.begruessung} einstellungen={einstellungen} />}
    />
  )

  const app = (
    <div className="app">
      <header className="app__kopf">
        <Logo hoehe={28} />
        <span className="app__betrieb">{betrieb.name}</span>
        <button
          type="button"
          className="icon-knopf"
          aria-label="Einstellungen"
          aria-pressed={tab === 'einstellungen'}
          onClick={() => wechsle('einstellungen')}
        >
          <Settings size={24} aria-hidden="true" />
        </button>
      </header>
      <p className="app__hinweis">{hinweisBeispiel}</p>

      <main className="app__inhalt" id="inhalt">
        {tab === 'demo' && demo}
        {tab === 'eingang' && (
          <Eingang anrufe={anrufe} offenId={offenId} setOffenId={setOffenId} alsErledigt={alsErledigt} />
        )}
        {tab === 'kalender' && <Kalender termine={termine} />}
        {tab === 'sms' && <SmsAnsicht verlaeufe={verlaeufe} onSenden={smsSenden} />}
        {tab === 'angebot' && <AngebotAnsicht key={angebote.length} angebote={angebote} />}
        {tab === 'einstellungen' && <EinstellungenAnsicht werte={einstellungen} onSpeichern={setEinstellungen} />}
      </main>

      <nav className="tableiste" aria-label="Hauptmenü">
        {sichtbareTabs.map(({ id, text, Icon }) => (
          <button
            key={id}
            type="button"
            className="tableiste__knopf"
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => wechsle(id)}
          >
            <span className="tableiste__icon">
              <Icon size={24} aria-hidden="true" />
              {id === 'eingang' && neue > 0 ? <span className="zaehler">{neue}<span className="visually-hidden"> neu</span></span> : null}
            </span>
            {text}
          </button>
        ))}
      </nav>
    </div>
  )

  if (!breit) return app

  return (
    <div className="buehne">
      <header className="buehne__kopf">
        <Logo hoehe={32} />
        <p className="buehne__hinweis">Prototyp. {hinweisBeispiel} Echte Telefonie folgt im Pilotbetrieb.</p>
      </header>
      <div className="buehne__raster">
        <div className="buehne__demo">{demo}</div>
        <div className="buehne__handy">
          <div className="handy" aria-label="Werkly-App auf dem Handy des Betriebsinhabers" role="region">
            {app}
          </div>
          <p className="buehne__unterschrift">So sieht {betrieb.vorname} das auf dem Handy.</p>
        </div>
      </div>
    </div>
  )
}
