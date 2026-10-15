import { useEffect, useState } from 'react'
import { CalendarDays, FileText, Inbox, MessageSquare, PhoneIncoming, Settings } from 'lucide-react'
import { AnrufDemo } from './components/AnrufDemo'
import { Eingang } from './components/Eingang'
import { Logo } from './components/Logo'
import { Platzhalter } from './components/Platzhalter'
import { anrufeHeute } from './data/anrufe'
import { betrieb, hinweisBeispiel } from './data/betrieb'
import type { Anruf } from './data/typen'

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

  useEffect(() => {
    if (breit && tab === 'demo') setTab('eingang')
  }, [breit, tab])

  function anrufAusDemo(anruf: Anruf) {
    setAnrufe((liste) =>
      [{ ...anruf, neu: true }, ...liste.filter((a) => a.id !== anruf.id)].sort((a, b) => b.zeit.localeCompare(a.zeit)),
    )
  }

  function imEingangZeigen(id: string) {
    setTab('eingang')
    setOffenId(id)
    if (!breit) window.scrollTo({ top: 0 })
  }

  function alsErledigt(id: string) {
    setAnrufe((liste) => liste.map((a) => (a.id === id ? { ...a, status: 'erledigt' } : a)))
  }

  const neue = anrufe.filter((a) => a.neu).length
  const sichtbareTabs = breit ? tabs.filter((t) => t.id !== 'demo') : tabs

  const demo = <AnrufDemo
      onFertig={anrufAusDemo}
      onImEingangZeigen={imEingangZeigen}
      imEingangOffen={breit && tab === 'eingang' ? offenId : null}
    />

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
          onClick={() => setTab('einstellungen')}
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
        {tab === 'kalender' && (
          <Platzhalter titel="Kalender" text="Hier kommt die Wochenansicht mit allen Terminen, die Werkly eingetragen hat. Sie folgt im nächsten Schritt." />
        )}
        {tab === 'sms' && (
          <Platzhalter titel="SMS" text="Hier kommt der Verlauf mit dem Kunden, mit Bestätigung und Erinnerung. Er folgt im nächsten Schritt." />
        )}
        {tab === 'angebot' && (
          <Platzhalter titel="Angebot" text="Hier kommt der Angebotsentwurf mit Positionen, Netto, MwSt. und Brutto zum Freigeben. Er folgt im nächsten Schritt." />
        )}
        {tab === 'einstellungen' && (
          <Platzhalter titel="Einstellungen" text="Hier stellst du Öffnungszeiten, Notdienst, Gewerke und die Begrüßung ein. Das folgt im nächsten Schritt." />
        )}
      </main>

      <nav className="tableiste" aria-label="Hauptmenü">
        {sichtbareTabs.map(({ id, text, Icon }) => (
          <button
            key={id}
            type="button"
            className="tableiste__knopf"
            aria-current={tab === id ? 'page' : undefined}
            onClick={() => setTab(id)}
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
