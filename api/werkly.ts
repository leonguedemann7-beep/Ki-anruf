// Vercel-Function für „Selbst ausprobieren“.
// Der Schlüssel liegt nur als Umgebungsvariable ANTHROPIC_API_KEY auf Vercel, nie im Browser.
import Anthropic from '@anthropic-ai/sdk'

interface Eingabe {
  nachrichten: { rolle: 'kunde' | 'werkly'; text: string }[]
  betrieb?: {
    gewerke?: string[]
    oeffnungszeiten?: string
    notdienst?: boolean
  }
}

function systemprompt(b: Eingabe['betrieb'] = {}): string {
  const gewerke = (b.gewerke ?? ['Sanitär', 'Heizung']).slice(0, 10).join(', ').slice(0, 200)
  const zeiten = (b.oeffnungszeiten ?? 'Montag bis Freitag 7 bis 17 Uhr').slice(0, 300)
  const notdienst = b.notdienst !== false
  return `Du bist Werkly, der telefonische Assistent von „Heizung & Sanitär Müller“ in Musterstadt (ein erfundener Beispielbetrieb für eine Vorführung). Inhaber ist Thomas Müller, er ist gerade auf der Baustelle.

Du sprichst am Telefon mit Kunden. Antworte auf Deutsch, siez die Anrufer, kurze Sätze, höchstens drei Sätze pro Antwort, keine Aufzählungen, keine Emojis. Du sagst offen, dass du eine KI bist, wenn danach gefragt wird.

Gewerke des Betriebs: ${gewerke}. Öffnungszeiten: ${zeiten}. Notdienst: ${notdienst ? 'ja, Notfälle stellst du sofort zu Herrn Müller durch' : 'nein, bei Notfällen nennst du den örtlichen Notdienst und versprichst einen Rückruf'}.

Deine Aufgaben:
- Anliegen klären: Was ist kaputt oder geplant, wo, wie dringend.
- Notfall erkennen (Wasserrohrbruch, Heizungsausfall im Winter, Gasgeruch). Bei Gasgeruch: Haus verlassen, kein Licht schalten, Notruf 112 und Gasversorger anrufen.
- Termin vorschlagen: Biete zwei konkrete Zeitfenster in den nächsten Werktagen an und bestätige, dass eine SMS kommt.
- Angebotsanfragen: Größe, Wünsche und Adresse erfragen und einen SMS-Link für Fotos ankündigen.
- Name, Adresse und Rückrufnummer aufnehmen.
Nenne keine festen Preise außer: Wartung pauschal 129 Euro zuzüglich Mehrwertsteuer. Erfinde keine Zusagen, die Herr Müller nicht geben kann.`
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ fehler: 'kein-schluessel' }, { status: 501 })
  }

  let eingabe: Eingabe
  try {
    eingabe = (await request.json()) as Eingabe
  } catch {
    return Response.json({ fehler: 'ungueltig' }, { status: 400 })
  }

  const nachrichten = (eingabe.nachrichten ?? [])
    .slice(-20)
    .filter((n) => typeof n.text === 'string' && n.text.trim())
    .map<Anthropic.Beta.BetaMessageParam>((n) => ({
      role: n.rolle === 'kunde' ? 'user' : 'assistant',
      content: n.text.slice(0, 1000),
    }))
  if (nachrichten.length === 0 || nachrichten[0].role !== 'user') {
    return Response.json({ fehler: 'ungueltig' }, { status: 400 })
  }

  const client = new Anthropic()
  try {
    const antwort = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: systemprompt(eingabe.betrieb),
      messages: nachrichten,
    })
    if (antwort.stop_reason === 'refusal') {
      return Response.json({ text: 'Das kann ich leider nicht beantworten. Herr Müller ruft Sie gern zurück.' })
    }
    const text = antwort.content
      .map((b) => (b.type === 'text' ? b.text : ''))
      .join('')
      .trim()
    return Response.json({ text })
  } catch (fehler) {
    const status = fehler instanceof Anthropic.APIError ? fehler.status ?? 502 : 502
    console.error('Claude-Aufruf fehlgeschlagen', status)
    return Response.json({ fehler: 'claude' }, { status: 502 })
  }
}
