# QRent REST-API

Basis-URL (lokal): `http://localhost:8080/api`  
Im Vue-Dev-Server über den Vite-Proxy einfach `/api/...` aufrufen.  
Authentifizierung: vorläufiger Mock-Login mit HTTP-Session (Spring Security folgt).

## Übersicht

| Methode | URL | Zweck | Status |
|---|---|---|---|
| GET | `/api/categories` | Kategorien inkl. Unterkategorien | umgesetzt |
| GET | `/api/products` | Alle Produkte (Liste) | umgesetzt |
| GET | `/api/products/{id}` | Ein Produkt inkl. Exemplare | umgesetzt |
| POST | `/api/auth/login` | Benutzer anmelden | umgesetzt (Mock) |
| GET | `/api/auth/me` | Aktuell angemeldeten Benutzer abrufen | umgesetzt (Mock) |
| POST | `/api/auth/logout` | Benutzer abmelden | umgesetzt (Mock) |

## GET /api/categories

Sortiert nach Code.

```json
[
  {
    "id": 1,
    "code": "01",
    "name": "Lichttechnik",
    "subcategories": [
      { "id": 1, "code": "01", "name": "Dauerlicht" }
    ]
  }
]
```

## GET /api/products

Liefert alle Produkte, alphabetisch sortiert. Suche und Filter erfolgen im Frontend.

```json
[
  {
    "id": 2,
    "code": "0002",
    "name": "Godox MS300",
    "category":    { "id": 1, "name": "Lichttechnik" },
    "subcategory": { "id": 1, "name": "Dauerlicht" },
    "itemCount": 2
  }
]
```

`itemCount` = Anzahl der Exemplare (nicht: Anzahl verfügbar).

## GET /api/products/{id}

```json
{
  "id": 2,
  "code": "0002",
  "name": "Godox MS300",
  "description": null,
  "category":    { "id": 1, "name": "Lichttechnik" },
  "subcategory": { "id": 1, "name": "Dauerlicht" },
  "items": [
    { "id": 2, "inventoryNumber": "01010002", "notes": null },
    { "id": 3, "inventoryNumber": "01010003", "notes": null }
  ]
}
```

`description` und `notes` können `null` sein.

## POST /api/auth/login

Authentifiziert einen Benutzer über den Mock und erstellt eine HTTP-Session.

**Request:**

```json
{
  "email": "lehrer1@tgm.ac.at",
  "password": "teacher123"
}
```

**Response (200 OK):**

```json
{
  "email": "lehrer1@tgm.ac.at",
  "firstName": "Thomas",
  "lastName": "Lehrer",
  "schoolClass": null,
  "role": "TEACHER"
}
```

Die Rolle wird anhand der E-Mail-Adresse aus MariaDB ermittelt. Ohne hinterlegte Sonderrolle gilt `STUDENT`.

## GET /api/auth/me

Liefert den aktuell angemeldeten Benutzer anhand der HTTP-Session.

**Response (200 OK):**

```json
{
  "email": "lehrer1@tgm.ac.at",
  "firstName": "Thomas",
  "lastName": "Lehrer",
  "schoolClass": null,
  "role": "TEACHER"
}
```

Ohne gültige Session wird `401 Unauthorized` zurückgegeben.

## POST /api/auth/logout

Beendet die aktuelle HTTP-Session.

**Response:** `204 No Content`

Nach dem Logout liefert `/api/auth/me` den Status `401 Unauthorized`.

## Fehler

Format der bestehenden Inventar-API: ProblemDetail (RFC 9457).

```json
{
  "title": "Not Found",
  "status": 404,
  "detail": "Produkt mit ID 999 wurde nicht gefunden.",
  "instance": "/api/products/999"
}
```

Die vorläufige Authentifizierungs-API liefert bei ungültigen Zugangsdaten derzeit eine einfache Textantwort.

| Status | Bedeutung |
|---|---|
| 401 | Nicht angemeldet oder ungültige Zugangsdaten |
| 404 | Ressource existiert nicht |
| 500 | Unerwarteter Serverfehler |

## Noch nicht enthalten

- Verfügbarkeit von Exemplaren (hängt von Ausleihen/Reservierungen ab)
- Produktfotos
- Spring Security und verbindliche rollenbasierte Zugriffskontrolle
- Schul-SSO (derzeit Mock-Authentifizierung)
