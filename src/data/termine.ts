import { heute, montag, plusTage, werktag } from './datum'
import type { Termin } from './typen'

const mo = montag(heute)
const tag = (n: number) => plusTage(mo, n)

export const termineBasis: Termin[] = [
  { id: 't1', datum: tag(0), von: '07:30', bis: '15:00', titel: 'Heizkörper tauschen', kunde: 'Familie Lehmann', adresse: 'Kastanienweg 14', quelle: 'selbst' },
  { id: 't2', datum: tag(1), von: '07:30', bis: '15:00', titel: 'Heizkörper tauschen', kunde: 'Familie Lehmann', adresse: 'Kastanienweg 14', quelle: 'selbst' },
  { id: 't3', datum: tag(2), von: '08:00', bis: '10:00', titel: 'Wartung Gastherme', kunde: 'Familie Neumann', adresse: 'Eichenstraße 21', quelle: 'werkly', notiz: 'Am Telefon vereinbart, SMS bestätigt' },
  { id: 't4', datum: tag(2), von: '11:00', bis: '15:00', titel: 'Heizkörper tauschen', kunde: 'Familie Lehmann', adresse: 'Kastanienweg 14', quelle: 'selbst' },
  { id: 't5', datum: tag(3), von: '07:00', bis: '09:00', titel: 'Notdienst: Kessel ausgefallen', kunde: 'Hausverwaltung Kramer', adresse: 'Gartenstraße 8', quelle: 'werkly', notiz: 'Notfall, direkt durchgestellt' },
  { id: 't6', datum: tag(3), von: '09:30', bis: '13:00', titel: 'Heizkörper tauschen', kunde: 'Familie Lehmann', adresse: 'Kastanienweg 14', quelle: 'selbst' },
  { id: 't7', datum: werktag(1), von: '10:00', bis: '11:00', titel: 'WC-Spülung reparieren', kunde: 'Helga Schulz', adresse: 'Rosenweg 7', quelle: 'werkly', notiz: 'Am Telefon vereinbart, SMS bestätigt. Bei Nachbarin klingeln.' },
  { id: 't8', datum: werktag(1), von: '12:00', bis: '15:00', titel: 'Restarbeiten Heizung', kunde: 'Familie Lehmann', adresse: 'Kastanienweg 14', quelle: 'selbst' },
  { id: 't9', datum: werktag(3), von: '08:00', bis: '10:00', titel: 'Wartung Ölheizung', kunde: 'Peter Wagner', adresse: 'Feldstraße 2', quelle: 'werkly', notiz: 'Am Telefon vereinbart, SMS bestätigt' },
  { id: 't10', datum: werktag(4), von: '09:00', bis: '10:00', titel: 'Wartung Gastherme', kunde: 'Familie Braun', adresse: 'Mühlenweg 9', quelle: 'werkly', notiz: 'Am Telefon vereinbart, SMS bestätigt' },
  { id: 't11', datum: werktag(5), von: '07:30', bis: '16:00', titel: 'Badsanierung, Tag 1', kunde: 'Familie Lindner', adresse: 'Am Markt 4', quelle: 'selbst' },
]

/** Termine, die erst durch den KI-Anruf entstehen */
export const termineAusDemo: Record<string, Termin> = {
  wartung: {
    id: 'demo-becker',
    datum: werktag(2),
    von: '13:00',
    bis: '15:00',
    titel: 'Wartung Gastherme',
    kunde: 'Klaus Becker',
    adresse: 'Ahornstraße 5',
    quelle: 'werkly',
    notiz: 'Gerade am Telefon vereinbart, SMS bestätigt',
  },
}
