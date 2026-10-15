// Vorbereitete Antworten, wenn kein Claude-Schlüssel hinterlegt ist.

const regeln: { muster: RegExp; antworten: string[] }[] = [
  {
    muster: /gas|riecht/i,
    antworten: [
      'Bitte verlassen Sie sofort das Haus und schalten Sie kein Licht und keine Geräte. Rufen Sie von draußen die 112 und den Gasversorger an. Ich informiere Herrn Müller jetzt.',
    ],
  },
  {
    muster: /rohr|wasser|nass|tropf|leck|überschwemm|geplatzt/i,
    antworten: [
      'Das klingt dringend. Drehen Sie bitte zuerst den Haupthahn zu, er sitzt meist neben der Wasseruhr. Wie ist Ihr Name und die Adresse?',
      'Danke. Ich stelle Sie jetzt direkt zu Herrn Müller durch. Bleiben Sie bitte dran.',
    ],
  },
  {
    muster: /heizung|therme|kessel|warm|kalt|wartung|brenner/i,
    antworten: [
      'Das kann Herr Müller übernehmen. Geht es um eine Störung oder um die jährliche Wartung?',
      'Ich habe zwei freie Termine: morgen von 8 bis 10 Uhr oder übermorgen von 13 bis 15 Uhr. Was passt Ihnen besser?',
      'Gut, dann trage ich das ein. Sie bekommen gleich eine Bestätigung per SMS. Wie ist Ihr Name und die Adresse?',
    ],
  },
  {
    muster: /bad|dusche|wanne|fliese|angebot|kosten|preis|sanier/i,
    antworten: [
      'Gern bereiten wir ein Angebot vor. Wie groß ist der Raum ungefähr, und was soll gemacht werden?',
      'Verstanden. Ich schicke Ihnen eine SMS mit einem Link für Fotos. Dann kann Herr Müller genau rechnen. Wie ist Ihr Name und die Adresse?',
    ],
  },
  {
    muster: /termin|wann|morgen|zeit|kommen/i,
    antworten: [
      'Ich habe morgen von 8 bis 10 Uhr oder übermorgen von 13 bis 15 Uhr frei. Was passt Ihnen?',
      'Danke, ich trage den Termin ein. Die Bestätigung kommt per SMS.',
    ],
  },
  {
    muster: /öffnungs|geöffnet|offen|erreich/i,
    antworten: ['Das Büro ist Montag bis Donnerstag von 7 bis 17 Uhr und freitags bis 14 Uhr besetzt. Kann ich Ihnen sonst helfen?'],
  },
  {
    muster: /ki|roboter|mensch|computer/i,
    antworten: ['Ja, ich bin eine KI und nehme Anrufe an, wenn Herr Müller auf der Baustelle ist. Er bekommt alles, was Sie mir sagen, und meldet sich bei Bedarf.'],
  },
]

const allgemein = [
  'Verstehe. Können Sie mir kurz sagen, worum es geht und wo das ist?',
  'Danke. Ich gebe das an Herrn Müller weiter, er ruft Sie zurück. Unter welcher Nummer erreicht er Sie am besten?',
  'Ist notiert. Gibt es noch etwas, das Herr Müller wissen sollte?',
]

/** Wählt eine passende Antwort. `schritt` zählt, wie oft dieses Thema schon dran war. */
export function vorbereiteteAntwort(text: string, verlauf: string[]): string {
  const alles = [...verlauf, text].join(' ')
  const regel = regeln.find((r) => r.muster.test(text)) ?? regeln.find((r) => r.muster.test(alles))
  const liste = regel ? regel.antworten : allgemein
  const schon = verlauf.filter((v) => liste.includes(v)).length
  return liste[Math.min(schon, liste.length - 1)]
}
