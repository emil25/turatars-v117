# V122 – ellenőrzött nyilvános adatok

V122 a V41–V121 személyes Store/adatmodelljét változatlanul hagyja. A nyilvános katalógus saját, forrásalapú rétege a meglévő `Store.platform().catalog` objektumban készül elő; ez nem második túra- vagy útvonalmodell.

## Kötelező provenance mezők

Minden importált túra, hely vagy esemény rekordnak tartalmaznia kell:

- `source`, `sourceUrl`
- `sourceLicense` (ha ismert)
- `attribution`
- `importedAt`, `verifiedAt`
- `dataStatus`: `verified`, `needs_review` vagy `archived`

Túráknál a név, régió, koordináta, táv, szint, nehézség, becsült idő és megbízható útvonal mezői csak akkor kerülnek ki a nyilvános felületre, ha az adat ténylegesen rendelkezésre áll. Ismeretlen értékhez nem készül generált érték.

Eseménynél a név, szervező, dátum, helyszín és hivatalos URL kötelező. Lejárt esemény nem kerül a közelgő listába.

## Közzétételi szabály

Csak a `dataStatus === "verified"` és nem archivált rekord jelenik meg. A korábbi beépített katalógusrekordok és helylisták forrásellenőrzés nélkül maradnak a privát kompatibilitási rétegben, de a publikus oldal nem jeleníti meg őket.

## Jogi határok

Külső oldal szövege, fényképe, GPX-e és térképcsempéje nem másolható be jogalap nélkül. A rekord tényszerű mezői, a forrás URL-je és a kötelező attribúció megőrzendő. A felhasználó saját túrája és GPS/GPX trackje saját adat marad.

Az ellenőrzéshez használható előkészítő útvonal: `#/forrasok` (bejelentkezés után). Ez jelenleg validálja a rekordot, de nem tesz közzé adatot automatikusan.
