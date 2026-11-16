# QRent-Frontend

## Aktueller Stand

Das Frontend verwendet Vue 3 mit Composition API und JavaScript, Vue Router 5,
Vite, Vuetify 3, Pinia und lokal eingebundene Material Design Icons (`@mdi/font`).
Axios ist mit zentraler Fehleraufbereitung eingerichtet. Auth-Service und
Session-Store, geschütztes Routing und Login-Oberfläche sind implementiert.
Dashboard und globales Meldungssystem sind eingerichtet. Die Vorgangsübersichten
im Dashboard bleiben vorerst Platzhalter. Die Development-Seite ist im DEV-Modus verfügbar. Equipment-Liste und Produktdetails
verwenden echte Backend-Daten; die übrigen fachlichen Views sind noch Platzhalter.

Vue Router 5 wird bewusst beibehalten. Das Projekt verwendet explizite
JavaScript-Routen und kein dateibasiertes Routing.

## Installation und Start

Voraussetzung laut `frontend/package.json`: Node.js `^22.18.0 || >=24.12.0`.
Im Verzeichnis `frontend/`:

```sh
npm ci
npm run dev
```

Der Entwicklungsserver läuft auf Port 5173. Der vorhandene Vite-Proxy leitet
`/api` an `http://localhost:8080` weiter. Backend und Datenbank werden separat
gestartet. Bei der ersten geschützten Navigation wird `/api/auth/me` geprüft.
Die Equipment-Views laden die vorhandenen Inventardaten. Die Mock-Auth-Endpunkte stehen im Backend nur außerhalb des
Profils `prod` zur Verfügung.

```sh
npm run build
npm run preview
```

## Struktur und Konfiguration

- `src/main.js`: registriert Pinia vor dem Router sowie Vuetify und globale Styles.
- `src/plugins/vuetify.js`: helles Theme `qrentLight`, semantische Farben,
  lokale MDI-Icons und zentrale Komponentenstandards.
- `src/styles/main.css`: globale Typografie und Inhaltsbreite.
- `src/App.vue`: Vuetify-Anwendungsrahmen mit Router-Ausgabe.
- `src/layouts/AuthLayout.vue`: zentrierte öffentliche Login-Seite ohne Navigation.
- `src/layouts/MainLayout.vue`: gemeinsamer Seitenrahmen, Inhaltsbreite und Logout-Aktion.
- `src/components/common/AppNotification.vue`: einmalige globale Snackbar.
- `src/components/common/TransactionOverview.vue`: wiederverwendbarer Vorgangsbereich.
- `src/stores/notificationStore.js`: Meldungswarteschlange mit optionalen Aktionen.
- `src/views/DashboardView.vue`: Dashboard mit rollenabhängigen Vorgangsbereichen.
- `src/views/EquipmentListView.vue`: Inventarliste, Filter und Ansichtswechsel.
- `src/views/EquipmentDetailView.vue`: Produktdetails und physische Exemplare.
- `src/components/equipment/`: Filtereingaben, Produkttabelle und Produktkarte.
- `src/services/equipmentService.js`: bestehende Inventar-Endpunkte.
- `src/utils/equipmentFilters.js`: lokale Such- und Filterlogik.
- `src/views/DevelopmentView.vue`: Diagnose und isolierte UI-Vorschau, nur im DEV-Modus.
- `src/dev/useDevelopmentTools.js`: lokaler Vorschauzustand und lesender Session-Test.
- `src/components/layout/AppHeader.vue`: Benutzeranzeige, Benutzermenü und mobiler Drawer.
- `src/components/layout/AppNavigation.vue`: gemeinsame Desktop- und Mobilnavigation.
- `src/router/navigation.js`: zentrale Navigationseinträge mit Prüfung der Routen-Mindestrollen.
- `src/router/index.js`: neue Routen und kompatible bisherige Routen.
- `src/router/guards.js`: Session-Prüfung, Rollenprüfung und sichere Login-Rückkehrziele.
- `src/utils/permissions.js`: zentrale Rollenhierarchie.
- `src/views/`: Login, Fehlerseiten und fachliche Platzhalterseiten.
- `vite.config.js`: automatische Vuetify-Komponentenimporte über
  `vite-plugin-vuetify` und Asset-URL-Verarbeitung für Vue-Templates.

Komponenten nutzen Theme-Farben wie `primary` und `surface` sowie Vuetify-Abstands-
und Layoutklassen. Neue Designstandards werden zentral in der Vuetify-Konfiguration
ergänzt. Für Icons kann beispielsweise `v-icon` mit `mdi-account` verwendet werden.
Die Systemschrift Arial benötigt keinen externen Schriftanbieter.
Die zentrale Akzentfarbe `primary` ist `#D3EEFA`, mit schwarzem Text auf
Akzentflächen (`on-primary`). Navigationstexte sind über die Theme-Farbe
`navigation` schwarz; aktive Menüziele erhalten einen dunkelgrauen Unterstrich
(`navigation-indicator`) als gerade Linie statt eines farbigen Hintergrunds.
Die Menüleiste verwendet die Akzentfarbe als Hintergrund. Produktlinks in der
Equipment-Tabelle und den Karten sind ebenfalls schwarz.
Beim Hover erhalten Menüeinträge eine weiße, rechteckige Fläche. Graue
Vuetify-Overlays und Klickwellen sind für diese Einträge deaktiviert; die
Tastaturbedienung behält eine sichtbare Fokusumrandung.

## API-Anbindung und Fehlerbehandlung

`src/services/apiClient.js` stellt die gemeinsame Axios-Instanz bereit:
Basis `/api`, `withCredentials: true` und 15 Sekunden Timeout. Session-Cookies
verwaltet der Browser; das Frontend liest oder speichert keine Session-Kennung.

Der Response-Interceptor übersetzt Fehler über `apiErrors.js` in `ApiError`
mit `message`, `status` und `code`. Unterstützt werden insbesondere 400, 401,
403, 404, Serverfehler, Netzwerkfehler, Timeouts und abgebrochene Requests.
Ungeprüfte Servertexte und die ursprüngliche Axios-Konfiguration werden nicht
übernommen, damit etwa Login-Zugangsdaten nicht im Fehlerzustand landen.

Der Client zeigt keine Meldungen an. Aufrufende Views behandeln Fehler lokal
oder über den Notification-Store, um Doppelmeldungen zu vermeiden.
Eine 401 außerhalb der Auth-Aufrufe invalidiert über einen beim Start
registrierten Callback den lokalen Session-Zustand. Auf einer geschützten Seite
wird anschließend zum Login mit der aktuellen URL als Rückkehrziel gewechselt.

## Auth-Service und Session-Store

`src/services/authService.js` kapselt die vorhandenen Backend-Verträge:

- `login({ email, password })`: `POST /auth/login`, liefert den Backend-Benutzer.
- `getCurrentUser()`: `GET /auth/me`, liefert Benutzer oder bei 401 `null`.
- `logout()`: `POST /auth/logout`, beendet die Session.

Die URLs sind relativ zur API-Basis `/api`. Die Service-Schnittstelle dient
als späterer Austauschpunkt für Schul-SSO. Es sind keine Testzugangsdaten im
Frontend hinterlegt.

`src/stores/authStore.js` exportiert `useAuthStore` mit:

- `user`, `role`, `isAuthenticated`: ausschließlich vom Backend abgeleiteter Zustand.
- `initialized`, `initializationError`, `isLoading`: Zustand der Session-Prüfung
  und laufender Auth-Aufrufe.
- `initializeSession()`: einmalige Prüfung bei der ersten geschützten Navigation
  oder beim Aufruf des Logins; parallele Aufrufe
  teilen sich einen Request. Technische Fehler werden gespeichert und erneut
  geworfen; eine spätere Wiederholung ist möglich. Initiale 401 ist kein Fehler.
- `login(credentials)` und `logout()`: aktualisieren den Benutzer nach bestätigter
  Backend-Antwort; Fehler werden an die spätere UI weitergereicht.
- `invalidateSession()`: entfernt den Benutzer bei bestätigtem Session-Verlust.

Login und Logout werden nacheinander ausgeführt. Eine ältere Initialisierungs-
antwort überschreibt keine neuere Anmeldung oder Session-Invalidierung.
Bei einem technischen Logout-Fehler bleibt der Benutzer erhalten, da die
serverseitige Abmeldung nicht bestätigt ist. Weder Passwörter noch Benutzer-
oder Session-Daten werden in Local Storage gespeichert.

In Komponenten kann der Store so verwendet werden:

```js
import { useAuthStore } from '@/stores/authStore.js'

const auth = useAuthStore()
// In einer asynchronen Formularaktion; Fehler dort lokal behandeln:
// await auth.login({ email, password })
```

Ein technischer Initialisierungsfehler bleibt über `initializationError`
zugänglich. Der Guard gibt keine geschützten Inhalte frei, sondern führt zum
Login. Dort erscheint ein lokaler Alert mit „Session erneut prüfen“. Der Store
nimmt selbst keine Navigation vor.

## Login, Routing und Berechtigungen

`LoginView.vue` verwendet ein Vuetify-Formular mit Pflichtfeld- und E-Mail-
Validierung direkt an den Eingabefeldern. Das Passwort kann über einen zugänglich
beschrifteten Button sichtbar gemacht werden. Während der Anmeldung sind die
Eingaben gesperrt und der Button zeigt eine Ladeanzeige. Login-Fehler stehen
ausschließlich als Alert innerhalb der Karte oberhalb des Login-Buttons und
werden vor einem neuen Versuch zurückgesetzt. Nach erfolgreicher Anmeldung
wird das Passwortfeld geleert. Unter dem DEV-Hinweis zeigt
`src/dev/DevelopmentLoginUsers.vue` die sechs ausdrücklich vorgesehenen
Mock-E-Mail-Adressen mit ihren Testpasswörtern. Die Komponente wird nur bei
`import.meta.env.DEV` dynamisch importiert; Produktions-Builds enthalten weder
die Tabelle noch diese Zugangsdaten. Die Angaben werden nicht automatisch in
das Formular übernommen oder im Browser-Speicher persistiert.

Die Guards warten vor geschützten Seiten auf die Session-Initialisierung.
Unangemeldete Benutzer gelangen nach `/login?redirect=...`; nach Login geht es
zum geprüften internen Ziel einschließlich Query und Hash, sonst zum Dashboard.
Bereits angemeldete Benutzer werden vom Login ebenfalls weitergeleitet.
Externe, unbekannte oder öffentliche Rückkehrziele werden verworfen.

| Route | Zugriff / Stand |
|---|---|
| `/login` | Öffentlich, implementiert |
| `/dashboard` | Angemeldet, Dashboard mit klar gekennzeichneten Vorgangsplatzhaltern |
| `/equipment`, `/equipment/:id` | Angemeldet, echte Inventardaten |
| `/checkout`, `/return`, `/my-transactions` | Angemeldet, Platzhalter |
| `/management/equipment`, `/management/templates` | Mindestens TEACHER, Platzhalter |
| `/management/roles` | ADMIN, Platzhalter |
| `/tutorials`, `/logs` | Angemeldet, bisherige Views erhalten |
| `/verleihungen` | TEACHER oder ADMIN, bisherige View erhalten |
| `/dev` | Angemeldet und nur DEV, Session-/API-Diagnose und UI-Tests |
| `/forbidden` | Angemeldet, lokale Berechtigungsfehlerseite |
| Unbekannte URLs | Öffentliche Nicht-gefunden-Seite |

`/` führt zum Dashboard, `/ausleihen` nach `/checkout`, `/rueckgabe` nach `/return`
und `/inventar` nach `/equipment`. Die drei alten Fachrouten übernehmen Query
und Hash. Die bisherigen Routennamen `home`, `checkout`, `return`, `inventory`,
`tutorials`, `active-rentals` und `logs` bleiben erhalten.

`hasRole(actualRole, requiredRole)` prüft `STUDENT < TEACHER < ADMIN` und lehnt
unbekannte Rollen ab. Der Guard verwendet nur `auth.role` vom Backend.
Fehlende Berechtigungen führen nach `/forbidden`. Dies steuert das Frontend;
die noch fehlende verbindliche Backend-Autorisierung wird dadurch nicht ersetzt.

## Hauptlayout und Navigation

Die sichtbare Anwendungsversion steht zentral als `APP_VERSION` in
`src/version.js` (aktuell `V0.4`). `AppVersion.vue` zeigt sie rechtsbündig als
„QRent V0.4“ direkt unter dem letzten Seiteninhalt an. Das gilt für geschützte
Seiten, Login und die Nicht-gefunden-Seite; die Anzeige ist nicht fixiert.

`MainLayout.vue` bindet `AppHeader.vue` einmal für alle geschützten Seiten ein.
Vuetifys `v-app-bar` reserviert über das Layout-System automatisch den Platz
oberhalb von `v-main`. Die Inhaltsbreite bleibt zentral begrenzt, die Abstände
sind auf kleinen Bildschirmen reduziert. Ein Tastatur-Link „Zum Inhalt springen“
führt direkt zum Hauptinhalt.

Ab dem Vuetify-Breakpoint `lg` (1280 Pixel) ist die Navigation horizontal:
Dashboard, Equipment, Ausleihen, Rückgabe, Tutorials, Aktuelle Verleihungen und Logs.
„Aktuelle Verleihungen“ ersetzt den bisherigen Menüeintrag „Meine Vorgänge“ und
verwendet die bestehende Route `/verleihungen`; `/my-transactions` bleibt direkt
erreichbar.
„Aktuelle Verleihungen“ ist nur für TEACHER und ADMIN sichtbar; die Route
`/verleihungen` prüft ebenfalls diese Mindestrolle.
Das Menü „Verwaltung“ enthält für TEACHER/ADMIN Equipment und Vorlagen,
für ADMIN zusätzlich Rollen.
Das Menü „Mehr“ enthält die registrierte Development-Route ausschließlich im
Entwicklungsmodus und entfällt ohne zusätzliche Einträge.

Unter 1280 Pixeln öffnet ein beschrifteter Hamburger-Button eine temporäre
Navigation mit denselben gruppierten Zielen. Es gibt keine permanente Sidebar.
Der Drawer überlagert den Inhalt, bleibt schmaler als der Bildschirm und schließt
bei Navigation, beim Anklicken des Hintergrunds, über den Schließen-Button und
beim Wechsel des Breakpoints. Die Vuetify-Menüs unterstützen Tastaturbedienung.

`AppNavigation.vue` verwendet dieselben Einträge für beide Darstellungen.
`getNavigationItems(router, actualRole)` liest `requiredRole` aus den registrierten
Routen; die Berechtigungsregeln werden nicht erneut im Header definiert.
Detailseiten markieren das zugehörige Navigationsziel. Routen und Guards bleiben
unverändert und sichern direkte Navigation weiterhin anhand der echten Rolle ab.

Rechts zeigt der Desktop-Header Vor-/Nachname (ersatzweise E-Mail) und die
übersetzte Rolle aus dem Auth-Store. Lange Namen werden gekürzt; das Benutzermenü
zeigt den vollständigen Namen, E-Mail, Rollenbezeichnung und technischen Rollencode.
Auf kleinen Bildschirmen öffnet ein Account-Symbol dasselbe Menü; Name und Rolle
sind zusätzlich im Drawer sichtbar. Es gibt keine Rollensimulation.

„Abmelden“ im Benutzermenü und im mobilen Drawer wird an das Layout delegiert.
Während der Abmeldung sind diese Aktionen gesperrt. Fehler erscheinen nun als
globale Fehler-Snackbar mit „Erneut versuchen“. Erst bestätigter Logout führt zum
Login. Dabei werden vorherige Meldungen gelöscht und eine Erfolgsmeldung angezeigt.

## Dashboard

Das Dashboard zeigt für alle Rollen „Meine Reservierungen und Ausleihen“.
TEACHER und ADMIN sehen zusätzlich „Alle Reservierungen und Ausleihen“.
Die Prüfung verwendet `hasRole` und ausschließlich die tatsächliche Backend-Rolle.
Auf großen Bildschirmen stehen die beiden Bereiche nebeneinander, sonst untereinander.
Ein Button führt zur bestehenden Equipment-Route.

Für Vorgänge existiert noch keine API. Deshalb gibt es keine erfundenen Einträge,
Zahlen oder eine scheinbar bestätigte Leermeldung. Beide Bereiche zeigen einen
erklärenden Platzhalter. `TransactionOverview.vue` kapselt Überschrift, Beschreibung
und Darstellung; sein Default-Slot kann später dieselbe Listenkomponente mit
unterschiedlichen Datenquellen aufnehmen. Das Dashboard ruft keine neue API auf.

## Globales Meldungssystem

`AppNotification.vue` ist genau einmal unterhalb des Router-Views in `App.vue`
eingebunden. Die Vuetify-Snackbar erscheint rechts oben; Vuetifys Layout-Abstände
setzen sie automatisch unter die vorhandene Hauptnavigation. Ohne Header erscheint
sie oben. Ihre Breite ist auf kleinen Bildschirmen begrenzt. Das Overlay verschiebt
keinen Inhalt und rendert ohne Meldung keinen sichtbaren Platzhalter.

```js
import { useNotificationStore } from '@/stores/notificationStore.js'

const notifications = useNotificationStore()
notifications.success('Änderungen gespeichert.')
notifications.info('Daten aktualisiert.')
notifications.warning('Bitte Angaben überprüfen.')
notifications.error('Server nicht erreichbar.', {
  action: { label: 'Erneut versuchen', handler: async () => { /* Aktion wiederholen */ } },
})
```

Die Beispiele zeigen die Verwendung; sie stellen keine bereits vorhandenen
Schreiboperationen dar. Callback-Fehler sollten geworfen werden, damit der Store
sie zentral behandeln kann. Server-/Netzwerkfehler werden über `normalizeApiError`
aufbereitet. Die fehlgeschlagene Aktion bleibt erneut ausführbar.

| Typ | Theme-Farbe | Dauer |
|---|---|---|
| Success | Grün | 4 Sekunden |
| Info | Blau | 5 Sekunden |
| Warning | Orange | 7 Sekunden |
| Error | Rot | Bis zum manuellen Schließen |

Jede Meldung hat ein Symbol und einen beschrifteten Schließen-Button. Optional
ist eine asynchrone Aktion möglich; während ihrer Ausführung ist der Aktionsbutton
gesperrt und der automatische Timeout pausiert. Vuetify pausiert den Timeout
außerdem beim Überfahren mit dem Mauszeiger.

Der Store zeigt Meldungen in Eingangsreihenfolge. Die nächste Meldung beginnt
nach der Schließanimation der vorherigen. Unmittelbare Duplikate (Typ, Text und
Aktionsbeschriftung) werden unterdrückt. Veraltete Animationsereignisse können
keine neuere Meldung schließen. `clear()` entfernt aktive und wartende Meldungen;
verspätete Ergebnisse alter Aktionen schließen danach keine neue Meldung und
erzeugen auch keine veralteten Fehler.

Globale Aktionsrückmeldungen verwenden diesen Store. Login-Fehler bleiben
ausschließlich in der Login-Karte; Inhaltsfehler bleiben lokale Alerts mit
Wiederholen-Aktion, Feldvalidierung bleibt direkt am Eingabefeld. Der Axios-
Interceptor erzeugt weiterhin keine Snackbar, auch nicht bei initialer 401.

## Equipment-Liste und Produktdetails

`equipmentService.js` verwendet die gemeinsame Axios-Instanz und ausschließlich:

| Funktion | Bestehender Endpunkt | Ergebnis |
|---|---|---|
| `getCategories({ signal })` | `GET /api/categories` | Kategorien samt Unterkategorien |
| `getProducts({ signal })` | `GET /api/products` | Alle Produkte samt Kategorie, Unterkategorie und Gesamtanzahl der Exemplare |
| `getProduct(id, { signal })` | `GET /api/products/{id}` | Produktbeschreibung und einzelne Exemplare |

Die optionalen `signal`-Parameter erlauben den Request-Abbruch. Ungültige
Produktkennungen werden lokal als API-Fehler mit Status 400 zurückgewiesen.
Alle übrigen Fehler werden durch die bestehende HTTP-Fehleraufbereitung gereicht.
Die Antwortfelder entsprechen den Controller-DTOs; es gibt keine zusätzlichen
Endpunkte, Schreiboperationen oder erfundenen Verfügbarkeitsfelder.

Die Listen-View lädt Kategorien und Produkte parallel und zeigt Ergebnisse erst,
wenn beide Antworten vorliegen. Namens- und Produktcodesuche sind unabhängig
von Groß-/Kleinschreibung; führende Nullen in Codes bleiben erhalten. Suche,
Kategorie und Unterkategorie werden mit UND kombiniert. Unterkategorien können
erst nach einer Kategorie gewählt werden und gehören ausschließlich zu ihr.
Ein Kategorie-Wechsel setzt die bisherige Unterkategorie zurück.

Filter, Suchtext und Ansichtswechsel erzeugen keine weiteren Requests. Sie bleiben
lokaler Seitenzustand und werden beim erneuten Betreten der Seite zurückgesetzt.
Es gibt keine serverseitige Pagination; die Backend-Sortierung bleibt erhalten.
Die Tabelle ist horizontal scrollbar, die Karten passen sich über das Grid an.
Die Seite startet auf allen Bildschirmgrößen in der Kartenansicht; die Darstellung
kann jederzeit über die beschrifteten Symbolbuttons gewechselt werden.

`EquipmentFilters.vue` enthält nur Eingaben und Models. `EquipmentTable.vue`
und `EquipmentCard.vue` stellen dieselben gefilterten Daten dar und verlinken
auf die Produktdetails. Keine Komponente ruft Axios direkt auf.
`InventoryView.vue` bleibt als kompatibler Wrapper für bisherige Importe erhalten;
der Routername `inventory` und die Weiterleitung `/inventar` bleiben bestehen.

Die Detailseite zeigt Produktname, Code, Kategorie, Unterkategorie, Beschreibung
und sämtliche Exemplare mit Inventarnummern und Bemerkungen. Fehlende Beschreibung
und Bemerkungen werden ausdrücklich als nicht hinterlegt bezeichnet. Zeilenumbrüche
bleiben erhalten; Texte werden sicher als Text statt HTML ausgegeben.
Ein Wechsel der Produkt-ID lädt die Daten neu. Laufende Requests werden beim
Verlassen oder erneuten Laden abgebrochen; verspätete Antworten überschreiben
keinen neueren Seitenzustand.

Beide Views zeigen Ladezustände und lokale Fehler-Alerts. Technische Fehler bieten
„Erneut versuchen“. Nicht vorhandene Produkte zeigen einen eigenen 404-Zustand;
ungültige IDs und 404 benötigen keinen Wiederholungsbutton, die Rückkehr zur Liste
bleibt möglich. Leeres Inventar und eine erfolglose Filterung werden unterschieden.
Ein Produkt ohne Exemplare erhält ebenfalls einen erklärenden Leerzustand.

`itemCount` bedeutet Gesamtbestand, nicht verfügbare Exemplare. Beide Ansichten
weisen darauf hin, dass keine Verfügbarkeitsinformationen vorliegen. Es gibt keine
erfundenen Bilder, Verfügbarkeitsanzeigen oder Ausleihaktionen.

## Development-Seite

`/dev` ist nur bei `import.meta.env.DEV` registriert und übernimmt den
Authentifizierungs-Guard des geschützten Layouts. Die dynamische Einbindung der
`DevelopmentView.vue` steht unmittelbar in diesem bedingten Routeneintrag.
Produktions-Builds enthalten weder diese View noch `useDevelopmentTools.js`;
`/dev` erreicht dort die öffentliche Nicht-gefunden-Seite. Der Navigationslink
erscheint nur bei tatsächlich registrierter Development-Route.

Die Seite zeigt aktuelle Benutzerdaten, tatsächliche Backend-Rolle,
Authentifizierungsstatus, Initialisierung und laufende Auth-Anfragen.
Passwörter, Cookie-Inhalte, Tokens oder Session-Kennungen werden nicht ausgelesen.
Diagnosedaten bleiben im Arbeitsspeicher und werden nicht automatisch protokolliert.

Der manuelle API-Test verwendet `authService.getCurrentUser()` und ausschließlich
`GET /api/auth/me` mit den tatsächlichen Session-Cookies. Er zeigt die Benutzer-
JSON-Antwort und HTTP 200 beziehungsweise 401. Der Service übersetzt 401 in `null`;
die Diagnose rekonstruiert diesen Status anhand des bestehenden Vertrags.
Es handelt sich nicht um einen allgemeinen HTTP-Client oder eine Header-Anzeige.
Technische Fehler erscheinen lokal und können über denselben Button erneut
geprüft werden. Mehrfachklicks erzeugen keine parallelen Testanfragen.
Die Diagnose aktualisiert den Auth-Store bewusst nicht: Eine abgelaufene
Server-Session kann so vom noch vorhandenen lokalen Zustand unterschieden werden.

Meldungstests umfassen Erfolg, Information, Warnung, Fehler, eine Warteschlange
mit unmittelbar doppelter Meldung und einen Aktionsbutton. Die Meldungen sind mit
`DEV` gekennzeichnet. „Alle Meldungen leeren“ entfernt aktive und wartende Meldungen.
Keine dieser Testaktionen schreibt fachliche Backend-Daten.

Die Rollensimulation bleibt ein lokales `ref` im Development-Composable.
Die Standardauswahl verwendet die echte Rolle; alternativ sind STUDENT, TEACHER
und ADMIN möglich. Die gewählte Rolle beeinflusst nur nicht interaktive
Navigations-Chips und eine Dashboard-Vorschau mit den bestehenden Komponenten.
Die Vorschau enthält keine Router-Links und keine administrativen Aktionen.
Echte und simulierte Rolle sind nebeneinander erkennbar. Der globale Header,
`auth.user`, `auth.role`, Route Guards und API-Aufrufe bleiben unverändert.
Beim Verlassen der Seite wird die Simulation verworfen; verspätete API-Antworten
werden nicht mehr in den lokalen Diagnosezustand übernommen.

## Prüfungen

Service- und Store-Tests verwenden den Node-Test-Runner ohne neue Testabhängigkeit
und einen simulierten Axios-Adapter; sie benötigen kein laufendes Backend:

```sh
node --test --test-isolation=none src/services/auth.test.js src/services/equipmentService.test.js src/router/guards.test.js src/router/navigation.test.js src/stores/notificationStore.test.js src/dev/useDevelopmentTools.test.js
```

Geprüft werden Session-Initialisierung, parallele Aufrufe, erwartete und spätere
401-Antworten, technischer Fehler mit Wiederholung, Login-Vertrag, Logout-Fehler,
verspätete Session-Antworten und Fehlerkategorien. Die Guard-Tests verwenden
einen Memory-Router für Login-Weiterleitungen, Rollenprüfungen, sichere
Rückkehrziele und technische Session-Fehler. Navigationstests prüfen die Einträge
für alle Rollen, erhaltene Bereiche, dynamische Routen-Mindestrollen und den
Development-Link. Notification-Tests prüfen FIFO-Reihenfolge, feste Laufzeiten,
Duplikate, Schließen, asynchrone Aktionen und verspätete Aktionsereignisse nach
dem Leeren. Equipment-Tests prüfen Endpunkte und DTO-Weitergabe, Abbruchsignale,
ungültige IDs, 404, kombinierte Filter und die Unterkategorie-Auswahl.
Die Inventarverträge wurden zusätzlich lesend am laufenden lokalen Backend
geprüft: Kategorien, Produkte, Produktdetails, UTF-8 und 404 bei unbekannter ID.
Development-Tests prüfen insbesondere, dass eine ADMIN-Vorschau mit echtem
STUDENT weiterhin am ADMIN-Guard scheitert und keine Backend-Anfrage auslöst.
Weitere Tests prüfen den unveränderten Store beim API-Test, lokale 401-/Netzwerk-
Diagnosen sowie parallele Klicks und verspätete Antworten.
Der DEV-Server wurde für die Transformation der View und ihrer Module geprüft.
Ein Produktions-Build mit `npm run build -- --manifest` wurde anhand des Manifests
und der JavaScript-Ausgabe auf ausgeschlossenen Development-Code geprüft.
Dies ersetzt keinen späteren
Browser-Test mit echten Session-Cookies und laufendem Backend.

## Noch ausstehend

Die technische Abschlussprüfung wurde am 10.11.2026 durchgeführt.
Ergebnisse, geprüfte Routen und verbleibende Browser-Abnahme sind im
[Phase-1-Prüfbericht](PHASE1_PRUEFBERICHT.md) dokumentiert. Die visuelle
Browser-Abnahme steht noch aus. Das Backend bleibt unverändert.

Die vorhandenen Lint- und Format-Skripte verändern Dateien (`--fix`/`--write`).
Für eine reine ESLint-Prüfung kann `npx --no-install eslint .` verwendet werden.
