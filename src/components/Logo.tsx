import logoAufHell from '../assets/werkly-logo.svg'
import logoAufDunkel from '../assets/werkly-logo-hell.svg'

// Immer die Logo-Dateien aus branding/logo verwenden, nie aus Text nachbauen.
export function Logo({ hoehe = 28, aufNavy = false }: { hoehe?: number; aufNavy?: boolean }) {
  if (aufNavy) {
    return <img src={logoAufDunkel} alt="Werkly" height={hoehe} className="logo" />
  }
  return (
    <>
      <img src={logoAufHell} alt="Werkly" height={hoehe} className="logo logo--hell-grund" />
      <img src={logoAufDunkel} alt="Werkly" height={hoehe} className="logo logo--dunkel-grund" />
    </>
  )
}
