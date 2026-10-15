import { useState, type ReactNode } from 'react'

export function KiAnruf({ beispiele, ausprobieren }: { beispiele: ReactNode; ausprobieren: ReactNode }) {
  const [modus, setModus] = useState<'beispiele' | 'selbst'>('beispiele')
  return (
    <section className="demo" aria-labelledby="demo-titel">
      <div className="demo__kopf">
        <p className="ueberzeile">KI-Anruf</p>
        <h1 id="demo-titel" className="h2">Du stehst auf der Leiter, das Handy klingelt.</h1>
        <p className="einleitung">Werkly nimmt an. Such dir ein Beispiel aus oder ruf selbst an.</p>
      </div>
      <div className="umschalter" role="group" aria-label="Art der Vorführung">
        <button type="button" aria-pressed={modus === 'beispiele'} onClick={() => setModus('beispiele')}>Beispielanrufe</button>
        <button type="button" aria-pressed={modus === 'selbst'} onClick={() => setModus('selbst')}>Selbst ausprobieren</button>
      </div>
      {/* Beide bleiben im Speicher, damit ein laufender Anruf beim Umschalten nicht verloren geht. */}
      <div hidden={modus !== 'beispiele'}>{beispiele}</div>
      <div hidden={modus !== 'selbst'}>{ausprobieren}</div>
    </section>
  )
}
