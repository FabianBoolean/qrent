# QRent Frontend – Anweisungen für Coding-Agenten

## Geltungsbereich

Diese Datei gilt für Arbeiten in `frontend/` und ergänzt die `AGENTS.md` im Repository-Root. Die allgemeinen Regeln (Projektkontext, Git, Sprache, Sicherheit, Arbeitsweise, Definition of Done) stehen dort und gelten auch hier.

Das Frontend kommuniziert über `/api` mit dem Spring-Boot-Backend. Fachliche und technische Entscheidungen berücksichtigen das gesamte Repository.

## Technologie und Architektur

- Verwende Vue 3 mit Composition API und JavaScript (kein TypeScript), Vite, Vue Router, Vuetify 3, Pinia und Axios, soweit im Projekt eingerichtet.
- Bevorzuge wiederverwendbare Komponenten und eine klare Trennung zwischen `views/`, `components/`, `layouts/`, `services/`, `stores/`, `router/`, `plugins/` und `styles/`.
- API-Aufrufe gehören in Services, nicht direkt in Vue-Komponenten. Nutze die zentrale Axios-Konfiguration.
- Gemeinsamen Zustand in Pinia verwalten; lokale UI-Zustände lokal belassen.
- Nutze ein zentrales Vuetify-Theme und konsistente, responsive Layouts. Vermeide unnötige Duplikate und verstreute Designkonstanten.
- Vor Änderungen bestehende Dateien, Routen, Abhängigkeiten und Schnittstellen untersuchen.
- Routen explizit in `src/router/index.js` pflegen (kein dateibasiertes Routing); Navigationseinträge zentral in `src/router/navigation.js`.

## Backend und Datenverträge

- Bestehende Backend-Controller und DTOs sowie `docs/api.md` sind maßgeblich. API-Endpunkte, Antwortfelder und Berechtigungen nicht erfinden.
- Für Equipment sind derzeit `GET /api/categories`, `GET /api/products` und `GET /api/products/{id}` vorgesehen; die tatsächlichen Response-Formate im Backend prüfen.
- Die aktuelle Entwicklungsanmeldung verwendet `POST /api/auth/login` mit `email` und `password`, `GET /api/auth/me` sowie `POST /api/auth/logout` und eine serverseitige HTTP-Session. Die Authentifizierung so kapseln, dass später Schul-SSO integriert werden kann.
- Die tatsächliche Benutzerrolle kommt vom Backend (`STUDENT`, `TEACHER`, `ADMIN`). Frontend-Rollenprüfungen dienen nur der Darstellung; die Autorisierung bleibt Aufgabe des Backends.
- Keine Backend- oder Datenbankänderungen ohne ausdrückliche Rückfrage und Freigabe.

## Benutzeroberfläche und Meldungen

- Geschützte Seiten nutzen ein gemeinsames Layout mit horizontaler Navigation; auf Mobilgeräten responsive Navigation anbieten.
- Globale Erfolgs-, Informations-, Warn- und Fehlermeldungen über einen zentralen Pinia-Notification-Store und eine einmalig eingebundene Vuetify-Snackbar ausgeben.
- Globale Meldungen erscheinen rechts oben unter der Hauptnavigation, mobil angepasst; ohne Meldung keinen Leerraum reservieren.
- Login-Fehler **innerhalb der Login-Karte** als Alert anzeigen, nicht als globale Snackbar.
- Fehler beim Laden von Seiteninhalten als lokalen Alert mit Wiederholen-Aktion darstellen. Formularvalidierungen direkt an den Feldern anzeigen.
- Erwartete `401`-Antworten bei der initialen Session-Prüfung nicht als Fehler-Snackbar anzeigen. Doppelte Meldungen vermeiden.
- Noch nicht implementierte Funktionen klar als Platzhalter kennzeichnen. Keine erfundenen Daten oder Verfügbarkeitswerte anzeigen.

## Sicherheit und Entwicklungsfunktionen

- Keine Passwörter, Tokens oder Geheimnisse im Browser-Local-Storage oder Session-Storage speichern.
- Session-Cookies durch den Browser verwalten lassen; Axios für Cookie-basierte Requests passend konfigurieren.
- Development-Views und UI-Rollensimulationen nur in der Entwicklungsumgebung bereitstellen; sie dürfen echte Rollen, Router-Berechtigungen oder Backend-Autorisierung nicht verändern. Der Produktions-Build darf sie nicht enthalten.

## Verbindliche Code-Dokumentation

- Für exportierte Funktionen, Services, Stores und komplexere Methoden aussagekräftiges **JSDoc** verwenden: Zweck, Parameter, Rückgabewert, Fehler und wichtige Nebenwirkungen, soweit relevant.
- Vue-Komponenten bei Bedarf mit Zweck, Props, Emits, Slots und relevanten Store-/Service-Abhängigkeiten dokumentieren.
- Nicht offensichtliche Entscheidungen und sicherheitsrelevantes Verhalten erläutern. Keine Kommentare, die lediglich die nächste Codezeile wiederholen.
- Bei jeder wesentlichen Änderung `docs/frontend/README.md` (vom Repository-Root aus) beziehungsweise die tatsächlich vorhandene Frontend-Dokumentation aktualisieren.
- Veraltete Kommentare entfernen.

## Tests und Qualitätsprüfung

- Tests verwenden den eingebauten Node-Test-Runner (`node --test`), ohne zusätzliche Testbibliothek. Testdateien liegen neben dem Code als `*.test.js`.
- Neue Logik in Services, Stores, Router und Utils bekommt Tests.
- Code-Stil: Prettier (`.prettierrc.json`) und `.editorconfig` – 2 Leerzeichen, keine Semikolons, einfache Anführungszeichen, max. 100 Zeichen pro Zeile.

Im Verzeichnis `frontend/`:

| Zweck | Befehl |
|---|---|
| Tests | `node --test "src/**/*.test.js"` (Anführungszeichen nötig, damit Node das Muster auflöst) |
| Linting (nur prüfen) | `npx eslint .` und `npx oxlint .` |
| Build | `npm run build` |

**Achtung:** `npm run lint` und `npm run format` verändern Dateien (`--fix` bzw. `--write`). Zum reinen Prüfen die Befehle aus der Tabelle verwenden; automatische Korrekturen nur auf aufgabenbezogene Dateien anwenden.
