import { AlertTriangle, CalendarCheck, Check, FileText, PhoneCall } from 'lucide-react'
import type { Status } from '../data/typen'

export const statusText: Record<Status, string> = {
  notfall: 'Notfall weitergeleitet',
  termin: 'Termin eingetragen',
  rueckruf: 'Rückruf nötig',
  angebot: 'Angebot vorbereitet',
  erledigt: 'Erledigt',
}

const statusIcon = {
  notfall: AlertTriangle,
  termin: CalendarCheck,
  rueckruf: PhoneCall,
  angebot: FileText,
  erledigt: Check,
}

export function StatusChip({ status }: { status: Status }) {
  const Icon = statusIcon[status]
  return (
    <span className={`chip chip--${status}`}>
      <Icon size={14} strokeWidth={2} aria-hidden="true" />
      {statusText[status]}
    </span>
  )
}
