import { betrieb } from './betrieb'
import { tagLang, tagKurz, werktag, wochentag } from './datum'
import { standard } from './einstellungen'
import type { Szenario } from './typen'

/** Platzhalter, wird im KI-Anruf durch die Begrüßung aus den Einstellungen ersetzt */
export const BEGRUESSUNG = standard.begruessung

const slot1 = werktag(1)
const slot2 = werktag(2)
const vortag = werktag(1)

export const szenarien: Szenario[] = [
  {
    id: 'rohrbruch',
    titel: 'Rohrbruch',
    art: 'Notfall',
    beschreibung: 'Wasser im Keller. Werkly stellt sofort zum Chef durch.',
    start: '13:42:00',
    anrufer: 'Petra Schneider',
    zeilen: [
      { t: 0, wer: 'system', text: `Anruf von 030 23125 104. ${betrieb.vorname} ist auf der Baustelle, Werkly nimmt an.` },
      { t: 2, wer: 'werkly', text: BEGRUESSUNG },
      { t: 9, wer: 'kunde', text: 'Hallo, bei uns im Keller ist ein Rohr geplatzt. Das Wasser spritzt richtig raus.' },
      { t: 14, wer: 'werkly', text: 'Das ist ein Notfall, ich helfe Ihnen sofort. Wissen Sie, wo der Haupthahn ist? Meist sitzt er neben der Wasseruhr.' },
      { t: 22, wer: 'kunde', text: 'Ja, neben dem Zähler. Ich dreh ihn zu. Okay, ist zu.' },
      { t: 28, wer: 'werkly', text: 'Sehr gut. Wie ist Ihr Name und die Adresse?' },
      { t: 31, wer: 'kunde', text: 'Petra Schneider, Lindenweg 12 in Musterstadt.' },
      { t: 36, wer: 'werkly', text: 'Danke, Frau Schneider. Steht etwas Elektrisches im Wasser, zum Beispiel eine Waschmaschine?' },
      { t: 42, wer: 'kunde', text: 'Die Waschmaschine steht da, aber das Wasser ist nur am Boden.' },
      { t: 46, wer: 'werkly', text: 'Bitte fassen Sie dort nichts Elektrisches an. Ich stelle Sie jetzt direkt zu Herrn Müller durch. Bleiben Sie dran.' },
      { t: 51, wer: 'system', text: `Notfall erkannt: Wasserrohrbruch. Durchgestellt an ${betrieb.inhaber}, Kurzfassung per SMS an ${betrieb.vorname}.` },
      { t: 55, wer: 'system', text: `${betrieb.vorname} hat angenommen. Gespräch übergeben.` },
    ],
    ergebnis: {
      status: 'notfall',
      punkte: [
        `Nach 51 Sekunden zu ${betrieb.vorname} durchgestellt`,
        'Kundin hat den Haupthahn zugedreht',
        'Name, Adresse und Lage per SMS an dich',
        'Im Eingang als „Notfall weitergeleitet“',
      ],
    },
    anruf: {
      id: 'demo-rohrbruch',
      zeit: '13:42',
      name: 'Petra Schneider',
      nummer: '030 23125 104',
      status: 'notfall',
      anliegen: 'Rohrbruch im Keller',
      kurzfassung: 'Wasser tritt im Keller aus, Lindenweg 12. Haupthahn ist zu, Waschmaschine steht im Raum.',
      erledigt: ['Haupthahn mit Kundin zugedreht', `Nach 51 Sekunden zu ${betrieb.vorname} durchgestellt`, 'Kurzfassung per SMS an dich'],
      dauer: '0:55',
    },
  },
  {
    id: 'wartung',
    titel: 'Heizungswartung',
    art: 'Termin',
    beschreibung: 'Stammkunde will die Therme warten lassen. Werkly trägt den Termin ein.',
    start: '13:51:20',
    anrufer: 'Klaus Becker',
    zeilen: [
      { t: 0, wer: 'system', text: `Anruf von 030 23125 117. ${betrieb.vorname} ist auf der Baustelle, Werkly nimmt an.` },
      { t: 2, wer: 'werkly', text: BEGRUESSUNG },
      { t: 9, wer: 'kunde', text: 'Ja, Becker hier. Meine Gastherme müsste mal wieder gewartet werden. Letztes Jahr waren Sie auch da.' },
      { t: 15, wer: 'werkly', text: 'Gern, Herr Becker. Ich finde Sie in der Kundenliste: Ahornstraße 5, Vaillant-Gastherme, letzte Wartung im Oktober letzten Jahres. Stimmt das noch?' },
      { t: 24, wer: 'kunde', text: 'Ja, genau.' },
      { t: 26, wer: 'werkly', text: `Ich habe zwei freie Termine: ${tagLang(slot1)} von 8 bis 10 Uhr oder ${tagLang(slot2)} von 13 bis 15 Uhr. Was passt Ihnen besser?` },
      { t: 35, wer: 'kunde', text: `${wochentag(slot2)} nachmittags ist gut.` },
      { t: 38, wer: 'werkly', text: `Dann trage ich ${tagLang(slot2)} von 13 bis 15 Uhr ein. Die Wartung kostet pauschal 129 Euro zuzüglich Mehrwertsteuer, Material nach Aufwand. Sie bekommen gleich eine Bestätigung per SMS.` },
      { t: 49, wer: 'kunde', text: 'Prima, danke.' },
      { t: 51, wer: 'werkly', text: 'Gern. Einen Tag vorher kommt noch eine Erinnerung. Auf Wiederhören, Herr Becker.' },
      { t: 56, wer: 'system', text: `Termin eingetragen: ${tagKurz(slot2)} 13:00 bis 15:00, Wartung Gastherme. SMS-Bestätigung zugestellt.` },
    ],
    ergebnis: {
      status: 'termin',
      punkte: [
        `Termin ${tagKurz(slot2)}, 13:00 bis 15:00 Uhr im Kalender`,
        'SMS-Bestätigung an Herrn Becker zugestellt',
        `Erinnerung für ${tagKurz(vortag)} geplant`,
        'Kein Rückruf nötig',
      ],
    },
    anruf: {
      id: 'demo-wartung',
      zeit: '13:51',
      name: 'Klaus Becker',
      nummer: '030 23125 117',
      status: 'termin',
      anliegen: 'Wartung Gastherme',
      kurzfassung: `Stammkunde, Ahornstraße 5. Vaillant-Gastherme, Wartung ${tagKurz(slot2)} 13 bis 15 Uhr. Pauschale 129 € zzgl. MwSt. genannt.`,
      erledigt: ['Termin im Kalender eingetragen', 'SMS-Bestätigung zugestellt', 'Erinnerung am Vortag geplant'],
      dauer: '0:56',
    },
  },
  {
    id: 'bad',
    titel: 'Badsanierung',
    art: 'Angebot',
    beschreibung: 'Neues Bad gewünscht. Werkly holt Fotos per SMS und bereitet das Angebot vor.',
    start: '14:05:40',
    anrufer: 'Sandra Krüger',
    zeilen: [
      { t: 0, wer: 'system', text: `Anruf von 030 23125 132. ${betrieb.vorname} ist auf der Baustelle, Werkly nimmt an.` },
      { t: 2, wer: 'werkly', text: BEGRUESSUNG },
      { t: 9, wer: 'kunde', text: 'Hallo, wir wollen unser Bad komplett neu machen. Machen Sie so was?' },
      { t: 13, wer: 'werkly', text: 'Ja, Badsanierungen macht Herr Müller regelmäßig. Damit er ein Angebot vorbereiten kann, stelle ich ein paar Fragen. Wie groß ist das Bad ungefähr?' },
      { t: 22, wer: 'kunde', text: 'So acht Quadratmeter.' },
      { t: 25, wer: 'werkly', text: 'Was soll rein? Zum Beispiel Dusche, Wanne, WC und Waschtisch.' },
      { t: 30, wer: 'kunde', text: 'Die Wanne soll raus, wir wollen eine bodengleiche Dusche. Neues WC, Waschtisch mit Unterschrank und neue Fliesen.' },
      { t: 39, wer: 'werkly', text: 'Verstanden. Ich schicke Ihnen gleich eine SMS mit einem Link. Darüber laden Sie drei oder vier Fotos vom Bad hoch. Dann kann Herr Müller genauer rechnen.' },
      { t: 48, wer: 'kunde', text: 'Gut, mach ich gleich.' },
      { t: 51, wer: 'werkly', text: 'Wie heißen Sie und wo ist das Bad?' },
      { t: 54, wer: 'kunde', text: 'Sandra Krüger, Birkenallee 3 in Musterstadt.' },
      { t: 59, wer: 'werkly', text: 'Danke, Frau Krüger. Herr Müller meldet sich mit dem Angebot und einem Termin zur Besichtigung. Auf Wiederhören.' },
      { t: 65, wer: 'system', text: 'Anruf beendet. SMS mit Foto-Link gesendet.' },
      { t: 212, wer: 'system', text: '4 Fotos eingegangen. Angebotsentwurf vorbereitet, wartet auf deine Freigabe.' },
    ],
    ergebnis: {
      status: 'angebot',
      punkte: [
        'Anfrage aufgenommen: 8 m², bodengleiche Dusche, WC, Waschtisch, Fliesen',
        'SMS mit Foto-Link gesendet, 4 Fotos eingegangen',
        'Angebotsentwurf liegt zur Freigabe bereit',
        'Besichtigung mit Frau Krüger noch absprechen',
      ],
    },
    anruf: {
      id: 'demo-bad',
      zeit: '14:05',
      name: 'Sandra Krüger',
      nummer: '030 23125 132',
      status: 'angebot',
      anliegen: 'Badsanierung, 8 m²',
      kurzfassung: 'Birkenallee 3. Wanne raus, bodengleiche Dusche, WC, Waschtisch mit Unterschrank, neue Fliesen. 4 Fotos per SMS.',
      erledigt: ['Fotos per SMS-Link eingeholt', 'Angebotsentwurf vorbereitet', 'Besichtigung noch offen'],
      dauer: '1:05',
    },
  },
]
