# QRent

QRent ist ein digitales Verleihsystem für Medientechnik am TGM.

## Projekt

Dieses Repository enthält die im Rahmen der Diplomarbeit 2026/27 entwickelte Version von QRent.

Die bestehende QRent-Version wird separat als Legacy-System geführt und dient ausschließlich als Referenz für die Weiterentwicklung.

## Team

- Fabian Steinhauser
- Hanki Lee
- Sebastian Nosek
- Nico Sonnleithner


## Voraussetzungen

- Docker Desktop
- JDK 25 (z. B. Eclipse Temurin)
- Für das Frontend: Node.js

## Schnellstart

```bash
cp .env.example .env        # einmalig: lokale Konfiguration anlegen
docker compose up -d        # MariaDB starten
cd backend
./gradlew bootRun           # Backend starten (Port 8080)
```

Test: http://localhost:8080/api/categories liefert JSON.

Beim ersten Start legt Flyway automatisch alle Tabellen und die Inventardaten an.

## Projektstruktur

```
backend/   Spring Boot (Java 25, Gradle)
frontend/  Vue 3 + Vite
docs/      api.md (Schnittstellen), decisions.md (Entscheidungen)
```

## Frontend an das Backend anbinden

In `frontend/vite.config.js` einen Proxy eintragen, dann im Frontend einfach `/api/...` aufrufen (kein CORS nötig):

```js
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

## Nützliche Befehle

| Befehl | Zweck |
|---|---|
| `docker compose stop` | Datenbank stoppen (Daten bleiben) |
| `docker compose down -v` | Datenbank komplett löschen (wird beim nächsten Start neu aufgebaut) |
| `./gradlew test` | Tests ausführen (Datenbank muss laufen) |

## Häufige Probleme

- **Port 3306 belegt:** Läuft noch die Legacy-Datenbank? `docker ps` prüfen, ggf. `docker stop mariadb`.
- **IntelliJ zeigt Tassen-Icons statt „C“:** Rechtsklick auf `backend/build.gradle` → *Link Gradle Project*.

## Arbeitsweise

- Nie direkt auf `main` arbeiten: Branch `feature/...` anlegen, Pull Request erstellen.
- Datenbankänderungen nur als neue Flyway-Datei (`V3__...sql`). Bestehende Migrationen nie ändern.
- API-Änderungen immer auch in `docs/api.md` eintragen.