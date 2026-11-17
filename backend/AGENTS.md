# QRent Backend – Anweisungen für Coding-Agenten

## Geltungsbereich

Diese Datei gilt für Arbeiten in `backend/` und ergänzt die `AGENTS.md` im Repository-Root.
Die allgemeinen Regeln (Git, Sprache, Sicherheit, Arbeitsweise, Definition of Done) stehen
dort und gelten auch hier.

## Technologie

- Java 25, Spring Boot 4.1, Gradle (Wrapper `./gradlew` verwenden).
- Spring Web MVC, Spring Data JPA (Hibernate), Bean Validation, Flyway, MariaDB 11.8.
- Kein Lombok. Getter, Konstruktoren usw. ausschreiben (siehe `docs/decisions.md`).
- Spring Security ist noch nicht eingebunden; die Anmeldung ist ein vorläufiger Mock.

## Paketstruktur

- Basis-Paket `at.ac.tgm.qrent`, Unterpakete **nach Fachbereich**, nicht nach Schicht:
  `inventory`, `authentication`, `authorization`, später z. B. `rental`, `reservation`.
- Pro Fachbereich liegen Entity, Repository, Service, Controller und DTOs im selben Paket.
- Sichtbarkeit so gering wie möglich halten (z. B. `from(...)`-Fabrikmethoden package-private).

## Konventionen im Code

- **Controller** sind schlank: Request annehmen, Service aufrufen, DTO zurückgeben.
  Keine Geschäftslogik und kein Repository-Zugriff im Controller.
- **Services** enthalten die Logik und die Transaktionen. Lesende Methoden mit
  `@Transactional(readOnly = true)` annotieren.
- **Dependency Injection** ausschließlich per Konstruktor mit `private final`-Feldern,
  kein `@Autowired` auf Feldern.
- **DTOs statt Entities als JSON.** Request- und Response-Objekte als Java-`record`
  mit Endung `...Request` bzw. `...Response`, Umwandlung über eine statische
  Fabrikmethode `from(Entity)`. Entities nie direkt aus Controllern zurückgeben.
- **Entities** haben einen geschützten parameterlosen Konstruktor für JPA. Beziehungen nicht
  über Lazy Loading außerhalb von Transaktionen auflösen (`open-in-view` ist deaktiviert).
- **Validierung** von Requests mit Bean Validation (`@Valid`, `@NotBlank`, `@Email`, …),
  nicht von Hand im Controller.
- **Fehler** im Format ProblemDetail (RFC 9457, `spring.mvc.problemdetails.enabled=true`).
  Für einfache Fälle `ResponseStatusException` mit deutscher, benutzerverständlicher
  Meldung; keine reinen Text-Antworten. Keine internen Details (Stacktraces, SQL) nach außen.
- Konfiguration über `application.properties` und Umgebungsvariablen mit lokalen
  Standardwerten (`${DB_PASSWORD:qrent_dev}`). Keine echten Zugangsdaten eintragen.

## Datenbank und Flyway

- Das Schema verwaltet **ausschließlich Flyway** unter `src/main/resources/db/migration/`.
  Hibernate läuft mit `ddl-auto=validate` und darf das Schema nie ändern.
- **Bestehende Migrationen nie ändern, umbenennen oder löschen** – auch nicht für kleine
  Korrekturen. Jede Änderung ist eine neue Datei mit der nächsten freien Nummer
  (vorher den Ordner prüfen), z. B. `V5__create_rental_tables.sql`.
- Dateinamen auf Englisch, kleingeschrieben, mit Unterstrichen.
- Test- und Beispieldaten (Testbenutzer, Testrollen) gehören nicht in reguläre Migrationen,
  die in jeder Umgebung laufen. Bekannter Altbestand: `V4__insert_test_user_roles.sql` –
  vor dem Schulbetrieb lösen; keine weiteren solchen Migrationen anlegen.
- Datenbankänderungen nur nach Rückfrage, wenn sie bestehende Daten betreffen.

## Authentifizierung und Autorisierung

- Rollen: `STUDENT < TEACHER < ADMIN` (`authorization/Role`). Ohne Eintrag in `user_roles`
  ist ein Benutzer `STUDENT`.
- Das **Backend ist für die Autorisierung verantwortlich**. Neue schützenswerte Endpunkte
  prüfen die Rolle serverseitig; Frontend-Prüfungen ersetzen das nicht.
- Die Rollenhierarchie darf nicht von der Reihenfolge der Enum-Konstanten abhängen
  (bekannter Altbestand in `Role.includes`, der `ordinal()` verwendet). Neue Logik nicht
  darauf aufbauen.
- Der Mock-Login (`AuthController`, `MockAuthService`) ist im Profil `prod` deaktiviert und
  wird später durch Schul-SSO ersetzt. Code so kapseln, dass dieser Austausch möglich bleibt.

## Tests

- JUnit 5 mit Spring-Boot-Test-Startern. Neue Services und Controller bekommen Tests
  (z. B. `@WebMvcTest` für Controller, `@DataJpaTest` für Repositories).
- `./gradlew test` benötigt derzeit eine laufende MariaDB (`docker compose up -d` im Root).
  Ist sie nicht erreichbar, das offen melden statt Tests zu deaktivieren.
- Tests nie löschen oder abschwächen, damit sie grün werden.

## Befehle

Im Verzeichnis `backend/`:

| Zweck | Befehl |
|---|---|
| Starten (Port 8080) | `./gradlew bootRun` |
| Tests | `./gradlew test` |
| Bauen inkl. Tests | `./gradlew build` |

Schnelltest bei laufendem Backend: `http://localhost:8080/api/categories` liefert JSON.
Adminer (Datenbank-Oberfläche) läuft unter `http://localhost:8081`.
