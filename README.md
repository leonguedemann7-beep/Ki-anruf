# Werkly Prototyp

Klickbarer Prototyp von Werkly, dem Telefon- und Terminassistenten für Handwerksbetriebe. Zum Vorführen in Gesprächen mit Betrieben, am Handy und am Laptop.

Alle Daten sind Beispieldaten des erfundenen Betriebs „Heizung & Sanitär Müller, Musterstadt“. Echte Telefonie gibt es noch nicht.

## Was drin ist

- **KI-Anruf:** drei Gespräche (Rohrbruch, Heizungswartung, Badsanierung) laufen Zeile für Zeile ab. Am Ende steht, was Werkly daraus gemacht hat, und der Anruf landet im Eingang.
- **Eingang:** alle Anrufe des Tages mit Status, Kurzfassung und Telefonnummer.
- Kalender, SMS, Angebot und Einstellungen folgen im nächsten Schritt.

Am Handy ist der KI-Anruf ein eigener Reiter. Ab 1024px Breite steht der KI-Anruf links und die App im Handyrahmen rechts.

## Starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Dann http://localhost:5173 öffnen. Zum Testen am Handy im selben WLAN: `npm run dev -- --host` und die angezeigte Netzwerk-Adresse öffnen.

## Auf Vercel veröffentlichen

1. Repository auf GitHub anlegen und diesen Ordner hochladen.
2. In Vercel „Add New Project“ wählen und das Repository importieren.
3. Vercel erkennt Vite von selbst (Build `npm run build`, Ausgabe `dist`). Auf „Deploy“ klicken.

## Stil

Farben, Schriften und Abstände kommen aus `src/styles/werkly.css`, einer Kopie von `branding/werkly.css` aus dem Werkly-Styleguide. Logos liegen unverändert in `src/assets/` und `public/`.
