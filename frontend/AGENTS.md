# QRent Frontend – Anweisungen für Coding-Agenten

## Geltungsbereich

Diese Datei liegt unter `frontend/AGENTS.md` und gilt für Arbeiten im Verzeichnis `frontend/` und dessen Unterverzeichnissen. Ergänzende Anweisungen in übergeordneten `AGENTS.md`-Dateien sind ebenfalls zu beachten.

## Projektkontext

QRent ist eine schulische Anwendung zur Verwaltung von Equipment, Reservierungen, Ausleihen, Rückgaben und Zustandsprotokollen. Das Frontend kommuniziert mit einem Spring-Boot-Backend und einer MariaDB-Datenbank. Das gesamte Repository muss bei fachlichen und technischen Entscheidungen berücksichtigt werden.

## Technologie und Architektur

- Verwende Vue 3 mit Composition API und JavaScript (kein TypeScript), Vite, Vue Router, Vuetify 3, Pinia und Axios, soweit im Projekt eingerichtet.
- Bevorzuge wiederverwendbare Komponenten und eine klare Trennung zwischen `views/`, `components/`, `layouts/`, `services/`, `stores/`, `router/`, `plugins/` und `styles/`.
- API-Aufrufe gehören in Services, nicht direkt in Vue-Komponenten. Nutze die zentrale Axios-Konfiguration.
- Gemeinsamen Zustand in Pinia verwalten; lokale UI-Zustände lokal belassen.
- Nutze ein zentrales Vuetify-Theme und konsistente, responsive Layouts. Vermeide unnötige Duplikate und verstreute Designkonstanten.
- Vor Änderungen bestehende Dateien, Routen, Abhängigkeiten und Schnittstellen untersuchen. Vorhandene Funktionen nicht unbeabsichtigt entfernen.

## Backend und Datenverträge

- Bestehende Backend-Controller und DTOs sind maßgeblich. API-Endpunkte, Antwortfelder und Berechtigungen nicht erfinden.
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

- Keine Passwörter, Tokens oder Geheimnisse im Quellcode, in Logs oder im Browser-Local-Storage speichern.
- Session-Cookies durch den Browser verwalten lassen; Axios für Cookie-basierte Requests passend konfigurieren.
- Development-Views und UI-Rollensimulationen nur in der Entwicklungsumgebung bereitstellen; sie dürfen echte Rollen, Router-Berechtigungen oder Backend-Autorisierung nicht verändern.
- Keine unnötigen externen Abhängigkeiten einführen. Neue Pakete und ihre Gründe transparent nennen.

## Verbindliche Code-Dokumentation

- Kommentare und Entwicklerdokumentation auf **Deutsch** verfassen; technische Namen und API-Felder unverändert lassen.
- Für exportierte Funktionen, Services, Stores und komplexere Methoden aussagekräftiges **JSDoc** verwenden: Zweck, Parameter, Rückgabewert, Fehler und wichtige Nebenwirkungen, soweit relevant.
- Vue-Komponenten bei Bedarf mit Zweck, Props, Emits, Slots und relevanten Store-/Service-Abhängigkeiten dokumentieren.
- Nicht offensichtliche Entscheidungen und sicherheitsrelevantes Verhalten erläutern. Keine Kommentare, die lediglich die nächste Codezeile wiederholen.
- Bei jeder wesentlichen Änderung `docs/frontend/README.md` (vom Repository-Root aus) beziehungsweise die tatsächlich vorhandene Frontend-Dokumentation aktualisieren.
- Dokumentation darf nur tatsächlich implementierte Funktionen als funktionsfähig beschreiben. Veraltete Kommentare entfernen.
- **Definition of Done:** Code ist implementiert, angemessen dokumentiert, getestet und die betroffene Entwicklerdokumentation aktualisiert.

## Arbeitsweise und Qualitätssicherung

1. Vor jeder größeren Aufgabe den Ist-Zustand und die betroffenen Dateien prüfen.
2. Einen kurzen Umsetzungsplan nennen und Änderungen in nachvollziehbaren Schritten durchführen.
3. Bestehende Konventionen beachten und nur aufgabenbezogene Dateien ändern.
4. Nach Änderungen passende Tests, Linting und/oder `npm run build` ausführen, soweit verfügbar; fehlgeschlagene oder nicht ausführbare Prüfungen offen benennen.
5. Am Ende geänderte Dateien, umgesetzte Funktionen, Tests und offene Punkte zusammenfassen.
6. Keine Git-Commits, Pushes, Branch-Merges, destruktiven Löschaktionen oder Änderungen an produktiven Daten ohne ausdrückliche Aufforderung.
