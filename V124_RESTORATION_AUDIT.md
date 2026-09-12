# V124 helyreállítási jegyzék

## Git-történeti összehasonlítás

- V117/V118: 32 régi katalógustúra, 8 esemény, 16 bakancslistás hely és 37 Nagyhagymás GPX-útvonal szerepelt a forrásban.
- V119: a saját túra munkaterület elkészült; a nyilvános katalógus adatai még a régi konstansokból érkeztek.
- V120: az élő GPS-túra réteg került rá, a katalógushoz nem nyúlt.
- V121: az offline/GPX import-export és útvonalkezelés került rá, a 37 Nagyhagymás útvonal megmaradt.
- V122: a nyilvános nézetet a provenance-köteles `verified` katalógusra váltotta. Emiatt a régi, forrásmezők nélküli rekordok és a szervezői események eltűntek a nyilvános nézetből.
- V123: 10 Visit Harghita túrát és 3 helyet adott hozzá, de több megjelenített név román maradt.

## V124-ben visszaállított tartalom

- 3, a korábbi forrásban már meglévő hivatalos SZATT-útvonal (10/16/40 km), a CsEKE oldalára és a közzétett GPX-fájlokra mutató hivatkozással.
- 8, a korábbi forrásban már meglévő eseményrekord. Ezek közül 4 `verified`, 4 `needs_review`; a lejárt Retyezát-esemény archivált.
- A V123 10 útvonalának és 3 helyének hivatalos magyar megjelenített neve.
- A platformon a nem DEMO szervezői események ismét láthatók `Ellenőrzés alatt` jelöléssel, amíg nincs ellenőrzött provenance-adatuk.

## Megőrzött korábbi funkciók

- A 37 Nagyhagymás GPX-útvonal és a V47 route-rendszer változatlan maradt.
- A Facebook/esemény inbox import `source_url` mezője és eseményfelismerése változatlan maradt.
- A V118 Auth/cloud, V119 munkatér, V120 GPS, V121 offline/GPX és V122 verified/provenance réteg változatlan adatmodellre épül tovább.

## Szándékosan nem visszaállított nyilvános rekordok

- 29 régi túra és 16 régi bakancslistás hely nem kapott automatikus `verified` státuszt, mert a Git-történetben nem volt hozzájuk ellenőrizhető provenance.
- DEMO jelölésű platformesemények nem kerülnek vissza.
- Bizonytalan vagy hiányos eseményadat `needs_review` állapotban marad; ettől nem válik ellenőrzötté.
