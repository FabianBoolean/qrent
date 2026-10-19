# Technische Entscheidungen

| Entscheidung | Warum |
|---|---|
| Ein Repo mit `backend/`, `frontend/`, `docs/` | Ein gemeinsamer Stand, API-Doku an einem Ort |
| Java 25, Spring Boot 4.1, Gradle | Aktuelle LTS-Version; Gradle wie im Legacy-Projekt |
| MariaDB 11.8 in Docker | LTS-Version; gleiche DB für alle ohne Installation. Flyway-Warnung „newer than verified“ ist harmlos |
| Flyway verwaltet das Schema, Hibernate nur `validate` | Ein einziger Ort für DB-Änderungen, nachvollziehbar und reproduzierbar |
| Kategorie → Unterkategorie → Produkt → Exemplar | Fotos/Beschreibung einmal pro Produkt, Inventarnummer pro physischem Gerät |
| Packages nach Fachbereich (`inventory`, später `rental`, …) | Zusammengehöriger Code liegt beisammen, weniger Konflikte im Team |
| DTOs statt Entities als JSON | API bleibt stabil, keine Lazy-Loading-Probleme (Legacy-Fehler) |
| Kein Lombok | Weniger „unsichtbarer“ Code, leichter zu erklären |
| Suche/Filter im Frontend, keine Pagination | Nur ~120 Produkte; bei Bedarf später im Backend |
| Fehler im Format ProblemDetail (RFC 9457) | In Spring eingebaut, einheitlich |
| Vorerst keine Authentifizierung | Bewusst verschoben, kommt als eigener Schritt |

## Vorläufig (mit Betreuer abzuklären)

- Inventarnummer-Format: 8-stellig nach Norberts Liste (Kategorie 2 + Unterkategorie 2 + laufende Nummer 4)
- Inventardaten (V2) stammen aus einer älteren Liste; 23 Unterkategorie-Namen sind abgeleitet
- Wird ein Exemplar oder ein Produkt reserviert?

## Bekannte offene Punkte

- Hibernate schreibt beim Start das DB-Passwort ins Log → vor dem Schulbetrieb beheben
