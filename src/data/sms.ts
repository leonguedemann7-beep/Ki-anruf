import { betrieb } from './betrieb'
import { tagKurz, werktag } from './datum'
import type { SmsVerlauf } from './typen'

const signatur = `Ihr Team von ${betrieb.name}`

export const smsBasis: SmsVerlauf[] = [
  {
    id: 's-schulz',
    name: 'Helga Schulz',
    nummer: '030 23125 139',
    nachrichten: [
      { von: 'werkly', zeit: '09:41', art: 'Bestätigung', text: `Guten Tag Frau Schulz, Ihr Termin steht: ${tagKurz(werktag(1))}, 10:00 bis 11:00 Uhr, WC-Spülung. Bei Fragen antworten Sie einfach auf diese SMS. ${signatur}` },
      { von: 'kunde', zeit: '09:52', text: 'Danke, passt. Falls ich nicht aufmache, bitte bei Nachbarin Klein klingeln, Hausnummer 7.' },
      { von: 'werkly', zeit: '09:52', text: 'Danke, Frau Schulz. Ist notiert, Herr Müller weiß Bescheid.' },
      { von: 'werkly', zeit: '18:00', art: 'Erinnerung', geplant: 'heute 18:00', text: `Erinnerung: Morgen, ${tagKurz(werktag(1))}, kommt Herr Müller zwischen 10:00 und 11:00 Uhr. Passt es doch nicht? Antworten Sie mit NEIN. ${signatur}` },
    ],
  },
  {
    id: 's-hoffmann',
    name: 'Martin Hoffmann',
    nummer: '030 23125 126',
    nachrichten: [
      { von: 'werkly', zeit: '08:34', art: 'Infoblatt', text: 'Guten Tag Herr Hoffmann, wie besprochen das Infoblatt zur Förderung für Wärmepumpen: [Link zum Infoblatt]. Herr Müller ruft Sie heute zwischen 16 und 18 Uhr zurück.' },
      { von: 'kunde', zeit: '08:40', text: 'Super, danke. Ab 17 Uhr bin ich sicher zu Hause.' },
    ],
  },
  {
    id: 's-weber',
    name: 'Sabine Weber',
    nummer: '030 23125 145',
    nachrichten: [
      { von: 'werkly', zeit: '10:25', art: 'Foto-Link', text: 'Guten Tag Frau Weber, hier können Sie ein Foto vom Typenschild Ihres Speichers hochladen: [Link zum Hochladen]. Dann kann Herr Müller genau rechnen.' },
      { von: 'kunde', zeit: '10:31', text: 'Foto ist hochgeladen.' },
      { von: 'werkly', zeit: '10:31', text: 'Danke, das Foto ist angekommen. Sie bekommen das Angebot bis Freitag.' },
    ],
  },
  {
    id: 's-wagner',
    name: 'Peter Wagner',
    nummer: '030 23125 112',
    nachrichten: [
      { von: 'werkly', zeit: '07:57', art: 'Bestätigung', text: `Guten Tag Herr Wagner, Ihr Termin steht: ${tagKurz(werktag(3))}, 8:00 bis 10:00 Uhr, Wartung Ölheizung. ${signatur}` },
      { von: 'werkly', zeit: '18:00', art: 'Erinnerung', geplant: `${tagKurz(werktag(2))} 18:00`, text: `Erinnerung: Morgen kommt Herr Müller zwischen 8:00 und 10:00 Uhr zur Wartung. Passt es doch nicht? Antworten Sie mit NEIN. ${signatur}` },
    ],
  },
]

/** Verläufe, die erst durch den KI-Anruf entstehen */
export const smsAusDemo: Record<string, SmsVerlauf> = {
  rohrbruch: {
    id: 'demo-s-schneider',
    name: 'Petra Schneider',
    nummer: '030 23125 104',
    nachrichten: [
      { von: 'werkly', zeit: '13:43', art: 'Notdienst', text: 'Frau Schneider, Herr Müller ist informiert und auf dem Weg. Lassen Sie den Haupthahn zu und fassen Sie nichts Elektrisches an.' },
      { von: 'kunde', zeit: '13:44', text: 'Danke, wir warten.' },
    ],
  },
  wartung: {
    id: 'demo-s-becker',
    name: 'Klaus Becker',
    nummer: '030 23125 117',
    nachrichten: [
      { von: 'werkly', zeit: '13:52', art: 'Bestätigung', text: `Guten Tag Herr Becker, Ihr Termin steht: ${tagKurz(werktag(2))}, 13:00 bis 15:00 Uhr, Wartung Gastherme. Pauschale 129 € zzgl. MwSt., Material nach Aufwand. ${signatur}` },
      { von: 'werkly', zeit: '18:00', art: 'Erinnerung', geplant: `${tagKurz(werktag(1))} 18:00`, text: 'Erinnerung: Morgen kommt Herr Müller zwischen 13:00 und 15:00 Uhr zur Wartung. Passt es doch nicht? Antworten Sie mit NEIN.' },
    ],
  },
  bad: {
    id: 'demo-s-krueger',
    name: 'Sandra Krüger',
    nummer: '030 23125 132',
    nachrichten: [
      { von: 'werkly', zeit: '14:06', art: 'Foto-Link', text: 'Guten Tag Frau Krüger, hier können Sie Fotos von Ihrem Bad hochladen: [Link zum Hochladen]. Am besten jede Wand einmal und den Boden.' },
      { von: 'kunde', zeit: '14:09', text: 'Sind drin, 4 Fotos.' },
      { von: 'werkly', zeit: '14:09', text: 'Danke, alle 4 Fotos sind angekommen. Herr Müller meldet sich mit dem Angebot.' },
    ],
  },
}
