# QRent

QRent ist ein digitales Verleihsystem für Medientechnik am TGM.

## Projekt

Dieses Repository enthält die im Rahmen der Diplomarbeit 2026/27 entwickelte Version von QRent.

Die bestehende QRent-Version wird separat als Legacy-System geführt und dient ausschließlich als Referenz für die Weiterentwicklung.

**Inhalt**

1. [Team](#team)
2. [Voraussetzungen](#voraussetzungen)
3. [Schnellstart vom Backend und Docker Container mit DB](#schnellstart-vom-backend-und-docker-container-mit-db)
4. [Schnellstart vom Frontend](#schnellstart-vom-frontend)
5. [Projektstruktur](#projektstruktur)
6. [Frontend an das Backend anbinden](#frontend-an-das-backend-anbinden)
7. [Nützliche Befehle](#nützliche-befehle)
8. [Häufige Probleme](#häufige-probleme)
9. [Arbeitsweise](#arbeitsweise)
    1. [Pull Requests und Freigabe](#pull-requests-und-freigabe)
10. [Arbeiten mit KI-Agenten (Claude Code / Codex)](#arbeiten-mit-ki-agenten-claude-code--codex)
    1. [Wo die Regeln stehen](#wo-die-regeln-stehen)
    2. [Claude Code einrichten und starten](#claude-code-einrichten-und-starten)
    3. [Spielregeln im Team](#spielregeln-im-team)

## Team

- Fabian Steinhauser
- Hanki Lee
- Sebastian Nosek
- Nico Sonnleithner


## Voraussetzungen

- Docker Desktop
- JDK 25 (z. B. Eclipse Temurin)
- Für das Frontend: Node.js

## Schnellstart vom Backend und Docker Container mit DB

```bash
cp .env.example .env        # einmalig: lokale Konfiguration anlegen
docker compose up -d        # MariaDB starten
cd backend
./gradlew bootRun           # Backend starten (Port 8080)
```

Test: http://localhost:8080/api/categories liefert JSON.

Beim ersten Start legt Flyway automatisch alle Tabellen und die Inventardaten an.

## Schnellstart vom Frontend

In einem **zweiten Terminal**, ausgehend vom Projektverzeichnis:

```bash
cd frontend
npm ci        # installiert exakt die Versionen aus package-lock.json
npm run dev
```

Die Oberfläche ist dann unter **http://localhost:5173** erreichbar.


## Projektstruktur

```
backend/   Spring Boot (Java 25, Gradle)
frontend/  Vue 3 + Vite + Vuetify
docs/      api.md (Schnittstellen), decisions.md (Entscheidungen), frontend/ (Frontend-Doku)
AGENTS.md  Regeln für KI-Agenten (zusätzlich in backend/ und frontend/)
CLAUDE.md  Import von AGENTS.md für Claude Code (siehe unten)
```

## Frontend an das Backend anbinden

API-Anfragen an `/api` werden vom Vite-Entwicklungsserver automatisch an das Backend unter `http://localhost:8080` weitergeleitet.

## Nützliche Befehle

| Befehl | Zweck |
|---|---|
| `docker compose stop` | Datenbank stoppen (Daten bleiben) |
| `docker compose down -v` | Datenbank komplett löschen (wird beim nächsten Start neu aufgebaut) |
| `./gradlew test` | Backend-Tests ausführen, in `backend/` (Datenbank muss laufen) |
| `node --test "src/**/*.test.js"` | Frontend-Tests ausführen, in `frontend/` |

## Häufige Probleme

- **Port 3306 belegt:** Läuft noch die Legacy-Datenbank? `docker ps` prüfen, ggf. `docker stop mariadb`.
- **IntelliJ zeigt Tassen-Icons statt „C“:** Rechtsklick auf `backend/build.gradle` → *Link Gradle Project*.

## Arbeitsweise

- Nie direkt auf `main` arbeiten: Branch `feature/...` anlegen, Pull Request erstellen.
- Datenbankänderungen nur als neue Flyway-Datei mit der nächsten freien Nummer (aktuell `V5__...sql`). Bestehende Migrationen nie ändern.
- API-Änderungen immer auch in `docs/api.md` eintragen.
- Die vollständigen Regeln für Mensch und KI stehen in `AGENTS.md` (Root, `backend/`, `frontend/`).

### Pull Requests und Freigabe

Jede Änderung kommt nur über einen Pull Request nach `main`, und jeder Pull Request braucht die
**Freigabe durch ein anderes Teammitglied**. Auf den eigenen Feature-Branch darf beliebig oft
gepusht werden; die Freigabe ist erst für den Merge nach `main` nötig.

Mit der Freigabe tragen **beide** Verantwortung – mit klar getrennten Aufgaben:

| Rolle | Verantwortlich für |
|---|---|
| **Autor/in** | Den Code: Funktion, Tests, Dokumentation. Jede Zeile erklären können – auch von der KI geschriebene. „Hat die KI gemacht“ ist keine Antwort. |
| **Reviewer/in** | Die Prüfung: Code gelesen und verstanden, Auffälligkeiten angesprochen, bei UI-Änderungen den Branch einmal lokal gestartet. Nur freigeben, was man selbst vertreten kann. |

Für gute Pull Requests:

- **Klein halten:** ein Thema pro Pull Request. Richtwert: in etwa 20 Minuten prüfbar.
  Größere Aufgaben in mehrere Pull Requests aufteilen.
- **Beschreibung ausfüllen:** was wurde geändert und warum, welche Prüfungen wurden
  ausgeführt, offene Punkte und ob bzw. wofür KI verwendet wurde.
- Neue Commits nach einer Freigabe werden erneut geprüft.
- Alle Review-Kommentare werden vor dem Merge geklärt.

## Arbeiten mit KI-Agenten (Claude Code / Codex)

Wir entwickeln mit KI-Unterstützung, hauptsächlich mit **Claude Code**; **Codex** kann ebenfalls
verwendet werden. Beide Werkzeuge halten sich an dieselben Projektregeln.

### Wo die Regeln stehen

| Datei | Inhalt |
|---|---|
| `AGENTS.md` | Regeln für das ganze Repository (Git, Sprache, Sicherheit, Definition of Done) |
| `backend/AGENTS.md` | Backend-Regeln (Paketstruktur, DTOs, Flyway, Tests) |
| `frontend/AGENTS.md` | Frontend-Regeln (Architektur, Meldungen, Tests, Linting) |
| `CLAUDE.md` (in allen drei Ordnern) | Enthält nur `@AGENTS.md` |

**Warum der `@AGENTS.md`-Import wichtig ist:** Codex liest automatisch `AGENTS.md`, Claude Code
liest automatisch nur `CLAUDE.md`. Die Zeile `@AGENTS.md` in jeder `CLAUDE.md` importiert die
`AGENTS.md` im selben Ordner. So gibt es die Regeln nur einmal, und beide Werkzeuge arbeiten mit
demselben Stand.

- Regeln **nur in `AGENTS.md`** ändern, nie in `CLAUDE.md`.
- Die `CLAUDE.md`-Dateien **nicht löschen** und den Import nicht entfernen – sonst arbeitet
  Claude ohne Projektregeln.
- Änderungen an den Regeln laufen wie Code über einen Pull Request, damit das ganze Team
  zustimmt.

### Claude Code einrichten und starten

1. Installation laut <https://docs.claude.com/en/docs/claude-code> und einmalig anmelden.
2. Claude muss im **Projekt-Root** (`qrent/`) laufen, nicht in `backend/` oder `frontend/`.
   Maßgeblich ist der Ordner, in dem Claude gestartet wird – nicht, wo man später eine
   Frage stellt.

   - **Im Terminal:**

     ```bash
     cd qrent
     claude
     ```

   - **In einer IDE** (z. B. IntelliJ, VS Code): Die IDE startet Claude im geöffneten
     Projektordner. Deshalb immer den **gesamten Ordner `qrent` als Projekt öffnen**, nicht nur
     `backend/` oder `frontend/`.

3. Claude lädt `CLAUDE.md` im Root sofort; die Regeln für `backend/` bzw. `frontend/` werden
   automatisch geladen, sobald dort gearbeitet wird.

| Befehl | Zweck |
|---|---|
| `claude` | Neue Sitzung starten |
| `claude -c` | Letzte Sitzung mit vollem Verlauf fortsetzen |
| `claude --resume` | Ältere Sitzung auswählen und fortsetzen |
| `/memory` (in Claude) | Geladene Regel- und Memory-Dateien anzeigen – zur Kontrolle, ob `./CLAUDE.md` des Roots dabei ist |

Claude erinnert sich **nicht** automatisch an frühere Sitzungen. Für Fortsetzungen `claude -c`
verwenden; dauerhaft gültiges Projektwissen gehört in `AGENTS.md` bzw. `docs/`.

### Spielregeln im Team

- **Vor dem Start einen eigenen Branch anlegen** (`feature/...`). Die KI arbeitet auf diesem Branch.
- **Jede Änderung selbst prüfen**, bevor sie committet wird (`git diff`). Wer committet, ist für
  den Code verantwortlich – auch wenn ihn eine KI geschrieben hat.
- Die KI committet, pusht und merged nur auf ausdrückliche Aufforderung.
- Aufgaben klein und konkret formulieren; bei größeren Aufgaben zuerst einen Plan verlangen.
- Keine Zugangsdaten, `.env`-Inhalte oder persönlichen Daten in Prompts kopieren.
- Persönliche Vorlieben (z. B. Antwortsprache, eigene Abkürzungen) in `CLAUDE.local.md` ablegen.
  Diese Datei wird nicht committet.
- Stellt sich heraus, dass eine Regel fehlt oder die KI wiederholt denselben Fehler macht:
  Regel in der passenden `AGENTS.md` ergänzen (per Pull Request).