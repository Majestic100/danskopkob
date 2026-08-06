# MinBilPris

Landingsside for opkøb og eksport af brugte biler. Vite, React, TypeScript og
Tailwind. Sitet er statisk og deployes til GitHub Pages via
`.github/workflows/deploy.yml`.

```bash
npm install
npm run dev        # udviklingsserver
npm run build      # typecheck + produktionsbuild
npm test           # kør testene
```

## MotorAPI: nummerplade-opslag

Når en bruger taster sin nummerplade på `/saelg-din-bil`, slås bilen op hos
[MotorAPI](https://motorapi.dk), og mærke, model, variant, årgang, brændstof og
farve vises i et kort under feltet. Data følger med som skjulte felter, når
formularen sendes.

Opslaget er additivt. Fejler det, hvad enten det skyldes timeout, opbrugt kvote
eller at serverlaget slet ikke er deployet, vises en neutral besked, og
formularen kan sendes som altid.

### Sitet skal have et sted at køre serverkode

Tokenet må aldrig i browseren, så alle kald til MotorAPI går gennem vores egen
server. **GitHub Pages kan ikke køre serverkode**, så `/api/*` findes ikke i den
nuværende opsætning, og opslaget falder derfor altid tilbage til manuel
udfyldning, indtil et af nedenstående er valgt.

Logikken ligger i `src/server/` og er skrevet mod web-standard
`Request`/`Response`, så den kan køre begge steder uden ændringer:

| Hosting | Adapter | Noter |
| --- | --- | --- |
| Cloudflare Workers | `worker/index.ts` | Sitet bliver på GitHub Pages. Worker deployes separat. Kræver CORS, som allerede er sat op i adapteren. |
| Vercel | `api/vehicle/[regnr].ts` | Sitet flyttes fra GitHub Pages. `/api/*` ligger på samme domæne, så ingen CORS. |

#### Cloudflare Workers

Sitet bliver, hvor det er. Kun serverlaget flytter.

```bash
npx wrangler login
npx wrangler secret put MOTORAPI_TOKEN   # indsæt tokenet, når den spørger
npx wrangler deploy                      # udskriver workerens adresse
```

Sæt derefter `VITE_API_BASE_URL` til den adresse, workeren fik, og byg
frontenden igen. Adressen skal også stå i `ALLOWED_ORIGINS` i
`worker/index.ts`, hvis sitet ligger på et andet domæne end dem, der allerede
er på listen.

#### Vercel

Hele sitet flytter, og `/api/*` ligger så samme sted. `vercel.json` er sat op.

```bash
npx vercel link
npx vercel env add MOTORAPI_TOKEN production
npx vercel --prod
```

`VITE_API_BASE_URL` skal ikke sættes: frontenden kalder samme domæne. Til
gengæld skal DNS for `minbilpris.dk` pege på Vercel i stedet for GitHub Pages,
og `.github/workflows/deploy.yml` bør slås fra, så de to ikke overskriver
hinanden.

### Miljøvariabler

Kopiér `.env.example` til `.env` og udfyld. `.env` er git-ignoreret.

| Variabel | Påkrævet | Beskrivelse |
| --- | --- | --- |
| `MOTORAPI_TOKEN` | ja | Sendes som `X-AUTH-TOKEN`. Kun serverside. |
| `MOTORAPI_BASE_URL` | nej | Standard `https://v1.motorapi.dk`. |
| `MOTORAPI_QUOTA_RESERVE` | nej | Antal kald der holdes i reserve. Standard 5. |
| `VITE_API_BASE_URL` | nej | Hvor serverlaget ligger, set fra browseren. Tom = samme domæne. |

`MOTORAPI_TOKEN` er en hemmelighed og sættes i produktion i hostingens miljø,
aldrig i en fil i git. `VITE_API_BASE_URL` er derimod en byggetids-variabel,
der bages ind i klient-bundlen — der må kun stå adresser, aldrig noget hemmeligt.

### Sådan er kvoten beskyttet

MotorAPI har en dagskvote, og hvert kald koster. Fire ting holder forbruget nede:

- Ugyldigt input afvises lokalt i både browser og server, så `AB1` aldrig sendes.
- Browseren venter 500 ms efter sidste tastetryk og slår kun op ved et gyldigt mønster.
- Svar caches i 24 timer serverside, og samtidige kald på samme plade deler ét request.
- En kvote-guard læser `/usage` (gratis) hvert 5. minut og stopper opslag, før kvoten er helt i bund.

### Endpoints

`GET /api/vehicle/:regnr` er det eneste, browseren kalder. Den svarer altid med
JSON og lækker aldrig upstream-fejl eller -headers.

```jsonc
// fundet
{ "found": true, "vehicle": { "brand": "…", "model": "…" }, "fetchedAt": "2026-08-06T12:00:00.000Z" }
// ingen bil på pladen (også ved 404 upstream)
{ "found": false, "vehicle": null }
// afvist lokalt (400) eller utilgængelig (503)
{ "error": { "code": "invalid_input", "message": "…" } }
```

`/environment` og `/equipment` er implementeret i servicelaget, men kaldes ikke
fra browseren endnu. De koster kvote og skal først hentes, når felterne rent
faktisk vises.

### Verificeret mod rigtige API-svar

| Del | Status |
| --- | --- |
| `/usage`-schema | **Verificeret** mod strukturen i dokumentationen. |
| Statuskoder (200/401/404/429/5xx) | **Verificeret** mod dokumentationen. |
| Endpoint-stier og `X-AUTH-TOKEN` | **Verificeret** mod dokumentationen. |
| Felter i køretøjssvar | **Ikke verificeret.** Ingen samples, og API'et er ikke kaldt. |
| Om lister pakkes ind i `{ data: [...] }` | **Ikke verificeret.** Begge former håndteres. |
| Feltnavne på bilkortet | **Ikke verificeret.** Læses gennem kandidatlister i `fieldMap.ts`. |

Køretøjs-schemaerne i `schemas.ts` er derfor bevidst tolerante: de validerer, at
svaret er et objekt, og lader alle felter passere. Det er valgt frem for at
gætte feltnavne, som ville se verificerede ud i koden uden at være det.

**Sådan låses datamodellen fast, når der findes eksempelsvar:**

```bash
mkdir -p samples
curl -H "X-AUTH-TOKEN: $MOTORAPI_TOKEN" \
  https://v1.motorapi.dk/vehicles/AB12345 > samples/vehicle.json
npm run motorapi:fields -- samples/vehicle.json   # viser de faktiske nøgler
```

Derefter: erstat kandidatlisterne i `src/server/motorapi/fieldMap.ts` med de
rigtige navne, stram `VehicleSchema` i `schemas.ts`, og ret tabellen ovenfor.
