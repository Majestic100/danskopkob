# Bilmærke-logoer

Her ligger logo-filerne til mærke-striben (`Logos3`). Aktuelt indsat:

```
vw.webp   audi.svg   bmw.png   mercedes.svg   skoda.png   toyota.webp   kia.svg
```

Mangler endnu (vises som tekst indtil filen ligger her): `ford`, `volvo`,
`peugeot`, `renault`, `hyundai`, `opel`, `tesla`.

## Sådan tilføjer du et logo

1. Læg filen her i mappen. **Endelsen skal matche det faktiske format** —
   en JPEG skal hedde `.jpg`, en PNG `.png`, en WebP `.webp`, en SVG `.svg`.
   (En JPEG omdøbt til `.svg` bliver serveret med forkert MIME-type og kan
   ikke vises.) Tjek evt. med `file <navn>`.
2. Sæt stien på mærket via feltet `logo:` i
   `src/components/ui/logos3.tsx`, fx `logo: "logos/ford.svg"`.

## Look

Hvert mærke vises som en hvid "chip" med logoet i dets **naturlige farver**
(klassisk logo-cloud). Derfor virker et logo med **transparent baggrund**
bedst — SVG (skarpt i alle størrelser) eller PNG/WebP med transparens. Raster
uden transparens (fx JPEG med hvid baggrund) fungerer også, da chippen er hvid.

Falder et logo fra (404 eller forkert format), vises mærkets navn som tekst i
stedet, så striben aldrig ser brudt ud.

Filerne serveres fra `/<base>/logos/<filnavn>` (base = `/danskopkob/`).
