# Bilmærke-logoer

Læg de officielle logo-filer her — helst som **SVG** (skarpe i alle størrelser),
alternativt PNG med transparent baggrund. Filerne skal navngives efter mærkets
`id` fra `Logos3` (src/components/ui/logos3.tsx):

```
vw.svg        audi.svg      bmw.svg       mercedes.svg
skoda.svg     toyota.svg    ford.svg      volvo.svg
peugeot.svg   renault.svg   kia.svg       hyundai.svg
opel.svg      tesla.svg
```

Så snart en fil ligger her, viser mærke-striben automatisk logoet i stedet for
navnet. Mangler filen — eller kan den ikke hentes — vises mærkets navn som
tekst (så striben aldrig ser brudt ud).

Hvert mærke vises som en hvid "chip", og logoet vises i sine **naturlige
farver** (klassisk logo-cloud). Derfor fungerer et logo med transparent
baggrund bedst — gerne SVG (skarpt i alle størrelser) eller PNG/WebP med
transparent baggrund.

Filerne serveres fra `/<base>/logos/<filnavn>` (base = `/danskopkob/`).
Navnet behøver ikke matche mærkets `id` — stien sættes eksplicit på hvert
mærke via feltet `logo:` i `src/components/ui/logos3.tsx`.
