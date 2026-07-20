# Bilmærke-logoer

Her ligger logo-filerne til mærke-striben (`Logos3`). Alle 14 mærker har nu
logo:

```
vw.webp   audi.svg   bmw.png   mercedes.svg   skoda.png   toyota.webp   kia.svg
ford.png  volvo.png  peugeot.png  renault.svg  hyundai.png  opel.png  tesla.png
```

## Sådan tilføjer/udskifter du et logo

1. Læg filen her i mappen. **Endelsen skal matche det faktiske format** —
   en JPEG skal hedde `.jpg`, en PNG `.png`, en WebP `.webp`, en SVG `.svg`.
   (En JPEG omdøbt til `.svg` bliver serveret med forkert MIME-type og kan
   ikke vises.) Tjek evt. med `file <navn>`.
2. Sæt stien på mærket via feltet `logo:` i
   `src/components/ui/logos3.tsx`, fx `logo: "logos/ford.png"`.

## Look

Hvert mærke vises som en hvid "chip" med logoet i dets **naturlige farver**
(klassisk logo-cloud). Derfor virker et logo med **transparent baggrund**
bedst — SVG (skarpt i alle størrelser) eller PNG/WebP med transparens. Raster
uden transparens (fx JPEG med hvid baggrund) fungerer også, da chippen er hvid.

Falder et logo fra (404 eller forkert format), vises mærkets navn som tekst i
stedet, så striben aldrig ser brudt ud.

Store raster-filer skaleres ned til ~240px højde for at holde siden let.

Filerne serveres fra `/<base>/logos/<filnavn>` (base = `/danskopkob/`).
