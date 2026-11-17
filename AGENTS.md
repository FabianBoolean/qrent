# QRent – Anweisungen für Coding-Agenten

## Geltungsbereich und Aufbau

Diese Datei gilt für das gesamte Repository. Ergänzend gelten:

- `backend/AGENTS.md` für Arbeiten in `backend/`
- `frontend/AGENTS.md` für Arbeiten in `frontend/`

Bei Widersprüchen gilt die spezifischere Datei im Unterverzeichnis.

`AGENTS.md` ist die einzige Quelle der Regeln. Codex liest `AGENTS.md`, Claude Code liest
`CLAUDE.md`. Jede `CLAUDE.md` enthält deshalb nur den Import `@AGENTS.md`. Regeln immer in
`AGENTS.md` ändern, nie in `CLAUDE.md`, damit beide Werkzeuge denselben Stand haben.

## Projektkontext

QRent ist ein digitales Verleihsystem für Medientechnik (Kameras, Licht, Audio, Stative usw.)
am TGM und wird im Rahmen der Diplomarbeit 2026/27 von einem vierköpfigen Team entwickelt.
Das bestehende Legacy-QRent dient ausschließlich als fachliche Referenz; kein Code wird
daraus übernommen.

| Verzeichnis | Inhalt |
|---|---|
| `backend/` | Spring Boot 4.1, Java 25, Gradle, MariaDB, Flyway |
| `frontend/` | Vue 3, Vite, Vuetify 3, Pinia, Axios (JavaScript, kein TypeScript) |
| `docs/api.md` | REST-Schnittstellen – Vertrag zwischen Frontend und Backend |
| `docs/decisions.md` | Technische Entscheidungen mit Begründung |
| `docs/frontend/` | Entwicklerdokumentation des Frontends |
| `docker-compose.yml` | MariaDB und Adminer (Port 8081) für die lokale Entwicklung |

## Verbindliche Projektregeln

- **API-Vertrag:** `docs/api.md` beschreibt alle Endpunkte. Jede Änderung an Endpunkten,
  Feldern, Statuscodes oder Berechtigungen wird im selben Pull Request in `docs/api.md`
  nachgetragen. Endpunkte und Felder nie erfinden – im Zweifel Backend-Code prüfen.
- **Entscheidungen:** `docs/decisions.md` ist verbindlich. Davon nur nach Rückfrage abweichen;
  neue grundlegende Entscheidungen dort mit Begründung ergänzen.
- **Datenbank:** Schemaänderungen ausschließlich als neue Flyway-Migration. Bestehende
  Migrationen nie ändern (Details in `backend/AGENTS.md`).
- **Autorisierung:** Rollen sind `STUDENT < TEACHER < ADMIN`. Das Backend entscheidet über
  Berechtigungen; Prüfungen im Frontend dienen nur der Darstellung.
- **Bereichsgrenzen:** Bei einer Aufgabe im Frontend keine Backend- oder Datenbankänderungen
  und umgekehrt, außer nach ausdrücklicher Rückfrage und Freigabe.

## Sprache

- Kommentare, Dokumentation, Commit-Nachrichten und Fehlermeldungen für Benutzer auf **Deutsch**.
- Technische Namen (Klassen, Methoden, Variablen, API-Felder) auf Englisch und unverändert lassen.

## Sicherheit

- Keine Passwörter, Tokens oder Geheimnisse in Quellcode, Logs, Commits oder Dokumentation.
- `.env` bleibt lokal und wird nie committet; neue Variablen in `.env.example` mit
  ungefährlichen Beispielwerten ergänzen.
- Test- und Mock-Daten (Benutzer, Rollen, Passwörter) dürfen nie in die Produktion gelangen.
- Keine unnötigen Abhängigkeiten einführen. Neue Pakete mit Begründung nennen.

## Git und Zusammenarbeit

- Nie direkt auf `main` arbeiten. Für jede Aufgabe einen Branch `feature/...` (bzw. `fix/...`)
  anlegen und per Pull Request zusammenführen. Jeder Pull Request braucht die Freigabe eines
  anderen Teammitglieds; Autor/in und Reviewer/in sind danach gemeinsam verantwortlich
  (Details in `README.md`, Abschnitt „Pull Requests und Freigabe“).
- Die Person am Rechner muss jede Änderung erklären können. Daher Code schreiben, der
  verständlich und nachvollziehbar ist, und nicht offensichtliche Entscheidungen begründen.
- **Pull Requests klein halten:** ein Thema pro Pull Request, in etwa 20 Minuten prüfbar.
  Wird eine Aufgabe größer, das ansprechen und eine Aufteilung in mehrere Pull Requests
  vorschlagen.
- Wird eine Pull-Request-Beschreibung erstellt, enthält sie: was geändert wurde und warum,
  ausgeführte Prüfungen (Tests, Lint, Build) und deren Ergebnis, offene Punkte sowie den
  Hinweis, dass KI beteiligt war und wofür.
- **Keine Commits, Pushes, Merges, Branch-Löschungen, destruktiven Befehle oder Änderungen an
  produktiven Daten ohne ausdrückliche Aufforderung.** Die Person am Rechner prüft die
  Änderungen und entscheidet über den Commit.
- Nur aufgabenbezogene Dateien ändern. Bestehende Funktionen nicht unbeabsichtigt entfernen.
- Keine Formatierungs- oder Umbenennungsaktionen über fremden Code im selben Schritt.

## Arbeitsweise

1. Vor jeder größeren Aufgabe Ist-Zustand, betroffene Dateien, Schnittstellen und
   `docs/` prüfen.
2. Einen kurzen Umsetzungsplan nennen und in nachvollziehbaren Schritten arbeiten.
3. Bestehende Konventionen des jeweiligen Bereichs übernehmen.
4. Nach Änderungen die passenden Tests, Linter und Builds ausführen (siehe Befehle).
   Fehlgeschlagene oder nicht ausführbare Prüfungen offen benennen.
5. Am Ende zusammenfassen: geänderte Dateien, umgesetzte Funktionen, ausgeführte Prüfungen
   und offene Punkte.

## Definition of Done

Eine Änderung ist fertig, wenn sie

- implementiert ist und den Regeln dieses Repositorys folgt,
- angemessen getestet ist (neue Logik bekommt Tests),
- dokumentiert ist: Code-Kommentare wo nötig, `docs/api.md` bei API-Änderungen,
  `docs/decisions.md` bei Grundsatzentscheidungen, `docs/frontend/README.md` bei
  wesentlichen Frontend-Änderungen,
- und die Dokumentation nur tatsächlich Umgesetztes als funktionsfähig beschreibt.

## Befehle

| Zweck | Befehl (ab Repository-Root) |
|---|---|
| Datenbank starten | `docker compose up -d` |
| Backend starten | `cd backend && ./gradlew bootRun` |
| Backend testen | `cd backend && ./gradlew test` (Datenbank muss laufen) |
| Frontend starten | `cd frontend && npm run dev` |
| Frontend testen, linten, bauen | siehe `frontend/AGENTS.md` |
