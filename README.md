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

#### Cloudflare Workers, trin for trin

Sitet bliver, hvor det er. Kun serverlaget flytter. Hele opsætningen tager
omkring et kvarter og kræver ikke, at man kan kode.

**1. Opret en gratis Cloudflare-konto** på [dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up).
Der skal ikke oplyses betalingskort. Den gratis plan giver 100.000 kald om
dagen, hvilket er rigeligt.

**2. Log ind fra maskinen.** Kommandoen åbner en browser, hvor du godkender.

```bash
npx wrangler login
```

**3. Læg tokenet ind som en hemmelighed.** Den spørger efter værdien og viser
den ikke på skærmen. Tokenet havner hos Cloudflare, ikke i koden.

```bash
npx wrangler secret put MOTORAPI_TOKEN
```

**4. Deploy.**

```bash
npm run api:deploy
```

Til sidst skriver den en adresse, der ender på `.workers.dev`. Den skal du
bruge i næste trin, så gem den.

**5. Tjek at det virker.** Åbn adressen i en browser med din egen nummerplade
sat ind til sidst:

```
https://<din-adresse>.workers.dev/api/vehicle/AB12345
```

Kommer der JSON tilbage med bildata, virker serverlaget.

**6. Peg sitet på serverlaget.** Adressen sættes som `VITE_API_BASE_URL` i
build-trinnet i `.github/workflows/deploy.yml`, fordi den skal bages ind i
klient-bundlen, når GitHub Actions bygger sitet. En `.env`-fil på din egen
maskine rækker ikke — den følger ikke med til GitHub.

Til lokal udvikling kan du lægge den samme linje i en `.env`-fil:

```
VITE_API_BASE_URL=https://minbilpris-api.sinan1.workers.dev
```

**7. Kun hvis du senere lægger API'et på eget domæne:** tilføj sitets adresse
til `ALLOWED_ORIGINS` i `worker/index.ts`, så browseren har lov at kalde det.

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
| `GET /vehicles/{reg-nr}` og dets felter | **Verificeret** mod et rigtigt svar, 2026-08-06. Se `samples/vehicle.json`. |
| Feltnavne på bilkortet | **Verificeret.** `make`, `model`, `variant`, `fuel_type`, `color`, `first_registration`. |
| `/usage`-schema | **Verificeret** mod strukturen i dokumentationen. |
| Statuskoder (200/401/404/429/5xx) | **Verificeret** mod dokumentationen. |
| Endpoint-stier og `X-AUTH-TOKEN` | **Verificeret** i praksis — workeren kalder API'et. |
| `GET /vehicles` (listen) | **Ikke verificeret.** Endpointet er ikke kaldt. |
| Om lister pakkes ind i `{ data: [...] }` | **Ikke verificeret.** Begge former håndteres. |
| `/environment` og `/equipment` | **Ikke verificeret.** Ingen af dem er kaldt. |

Feltnavnene er engelske og i snake_case, selvom værdierne er danske
(`"Registreret"`, `"Personbil"`, `"Diesel"`).

**To fælder, som det rigtige svar afslørede**, og som koden er bygget op om:

- `model_year` kan være `0`. Ikke `null`, ikke fraværende — nul. Årgangen
  udledes derfor af `first_registration`, og `model_year` bruges kun som
  reserve, når værdien er troværdig.
- Tekstfelter kan indeholde `"Ukendt"` eller tom streng i stedet for `null`.
  Uden filtrering ville kortet vise "Ukendt" som om det var en farve.

Schemaet er stadig tolerant med vilje: alle felter er valgfrie, og ukendte
felter bevares. Ét svar viser, hvilke felter der findes for én bil, ikke hvilke
der altid findes — en elbil har ingen motorvolumen, og et afmeldt køretøj kan
mangle syn.

**Sådan hentes et nyt eksempelsvar:**

```bash
curl -H "X-AUTH-TOKEN: $MOTORAPI_TOKEN" \
  https://v1.motorapi.dk/vehicles/AB12345 > samples/vehicle.json
npm run motorapi:fields -- samples/vehicle.json   # lister nøglerne fladt ud
```

Nummerplade og VIN i `samples/` er erstattet med pladsholdere, fordi repoet er
offentligt.
