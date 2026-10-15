export function Platzhalter({ titel, text }: { titel: string; text: string }) {
  return (
    <section className="ansicht" aria-labelledby="platzhalter-titel">
      <div className="ansicht__kopf">
        <p className="ueberzeile">Im Bau</p>
        <h2 id="platzhalter-titel" className="h2">{titel}</h2>
      </div>
      <div className="hinweis">
        <p>{text}</p>
      </div>
    </section>
  )
}
