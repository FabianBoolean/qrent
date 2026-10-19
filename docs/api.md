# QRent REST-API

Basis-URL (lokal): `http://localhost:8080/api`
Im Vue-Dev-Server über den Vite-Proxy einfach `/api/...` aufrufen.
Authentifizierung: vorerst keine (kommt später).

## Übersicht

| Methode | URL | Zweck | Status |
|---|---|---|---|
| GET | `/api/categories` | Kategorien inkl. Unterkategorien | umgesetzt |
| GET | `/api/products` | Alle Produkte (Liste) | umgesetzt |
| GET | `/api/products/{id}` | Ein Produkt inkl. Exemplare | umgesetzt |

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

## Fehler

Format: ProblemDetail (RFC 9457).

```json
{
  "title": "Not Found",
  "status": 404,
  "detail": "Produkt mit ID 999 wurde nicht gefunden.",
  "instance": "/api/products/999"
}
```

| Status | Bedeutung |
|---|---|
| 404 | Ressource existiert nicht |
| 500 | Unerwarteter Serverfehler |

## Noch nicht enthalten

- Verfügbarkeit von Exemplaren (hängt von Ausleihen/Reservierungen ab)
- Produktfotos
- Login, Rollen
