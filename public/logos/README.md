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
navnet. Mangler filen, vises mærkets navn som tekst (så striben aldrig ser
brudt ud).

På det mørke trust-band vises logoerne som ensfarvet hvid (monokrom) for et
ensartet, professionelt look — så en-farvede SVG'er fungerer bedst.

Filerne serveres fra `/<base>/logos/<navn>.svg` (base = `/danskopkob/`).
