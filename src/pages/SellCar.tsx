import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ImagePlus,
  Phone,
  X,
} from "lucide-react";
import { DanishFlag, TrustpilotStar, TrustStars } from "@/components/icons";
import { PlateEuBadge } from "@/components/LeadForm";
import {
  formatPlate,
  isValidEmail,
  isValidPhone,
  isValidPlate,
} from "@/lib/form";
import { cn } from "@/lib/utils";

const MAX_IMAGES = 6;

const HVORNAAR = [
  "Hurtigst muligt",
  "Inden for 14 dage",
  "Inden for en måned",
  "Om et par måneder",
  "Jeg undersøger bare prisen",
];

const KILDER = [
  "Google",
  "Facebook / Instagram",
  "Anbefaling fra familie eller venner",
  "Radio / TV",
  "Andet",
];

interface Billede {
  file: File;
  url: string;
}

function FeltLabel({
  label,
  hint,
  htmlFor,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="font-bold text-ink">
        {label}
      </label>
      {hint && <span className="text-sm text-ink/45">{hint}</span>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-ink outline-none transition focus:border-trust focus:ring-2 focus:ring-trust/20";

export default function SellCar() {
  const [params] = useSearchParams();

  const [navn, setNavn] = useState(params.get("navn") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [tel, setTel] = useState(params.get("tel") ?? "");
  const [plade, setPlade] = useState(formatPlate(params.get("plade") ?? ""));
  const [km, setKm] = useState("");
  const [hvornaar, setHvornaar] = useState("");
  const [stand, setStand] = useState("");
  const [billeder, setBilleder] = useState<Billede[]>([]);
  const [pris, setPris] = useState("");
  const [kilde, setKilde] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imgNote, setImgNote] = useState("");
  const [drag, setDrag] = useState(false);
  const [sendt, setSendt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Sælg din bil | MinBilPris — udfyld salgsformularen";
  }, []);

  // Ryd op i preview-URL'er når siden forlades
  useEffect(
    () => () => {
      billeder.forEach((b) => URL.revokeObjectURL(b.url));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  function tilfoejBilleder(liste: FileList | null) {
    if (!liste) return;
    setImgNote("");
    const nye: Billede[] = [];
    for (const f of Array.from(liste)) {
      if (!f.type.startsWith("image/")) continue;
      nye.push({ file: f, url: URL.createObjectURL(f) });
    }
    setBilleder((prev) => {
      const plads = MAX_IMAGES - prev.length;
      if (nye.length > plads) {
        setImgNote(`Du kan højst uploade ${MAX_IMAGES} billeder.`);
        nye.slice(plads).forEach((b) => URL.revokeObjectURL(b.url));
      }
      return [...prev, ...nye.slice(0, Math.max(0, plads))];
    });
  }

  function fjernBillede(idx: number) {
    setBilleder((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
    setImgNote("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fejl: Record<string, string> = {};
    if (navn.trim().length < 2) fejl.navn = "Skriv dit navn.";
    if (!isValidEmail(email)) fejl.email = "Indtast en gyldig emailadresse.";
    if (!isValidPhone(tel))
      fejl.tel = "Indtast et gyldigt telefonnummer (8 cifre).";
    if (!isValidPlate(plade))
      fejl.plade = "Indtast en gyldig dansk nummerplade, fx AB 12 345.";
    if (!/^\d{1,7}$/.test(km.replace(/[.\s]/g, "")))
      fejl.km = "Indtast bilens kilometertal i tal, fx 168000.";
    if (!hvornaar) fejl.hvornaar = "Vælg hvornår bilen skal sælges.";
    setErrors(fejl);
    if (Object.keys(fejl).length > 0) return;

    // GHL: her sendes felterne (inkl. billeder) til GoHighLevel/webhook.
    setSendt(true);
    window.scrollTo({ top: 0 });
  }

  if (sendt) {
    return (
      <div className="bg-offwhite">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-black/5 sm:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tp/10">
              <Check className="h-8 w-8 text-tp" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink">
              Tak, {navn.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-ink/70">
              Vi har modtaget oplysningerne om{" "}
              <strong className="text-ink">{plade}</strong>
              {billeder.length > 0 && (
                <> og dine {billeder.length} billeder</>
              )}
              . Nu sker der følgende:
            </p>
            <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left">
              {[
                "Vi gennemgår bilens oplysninger og markedet",
                "En dansk rådgiver ringer dig op — typisk inden for 15 min.",
                "Du får dit tilbud. Siger du ja, henter vi bilen gratis",
              ].map((trin, i) => (
                <li key={trin} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-extrabold text-brand">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink/75">{trin}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="btn-cta rounded-xl bg-brand px-6 py-3.5 font-bold text-white shadow-soft"
              >
                Tilbage til forsiden
              </Link>
              <Link
                to="/blog"
                className="rounded-xl px-6 py-3.5 font-bold text-ink/70 transition-colors hover:text-ink"
              >
                Læs vores guides →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite">
      {/* Side-hoved */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="reveal flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            <DanishFlag className="h-3.5 w-5 rounded-[2px]" /> Salgsformular
          </p>
          <h1 className="reveal mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Fortæl os om din bil
          </h1>
          <p
            className="reveal mt-4 max-w-2xl text-lg text-ink/60"
            style={{ transitionDelay: "80ms" }}
          >
            Jo mere vi ved, desto skarpere kan tilbuddet blive. Det tager 2
            minutter — og er selvfølgelig helt uforpligtende.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          {/* Formularen */}
          <form
            noValidate
            onSubmit={handleSubmit}
            className="reveal rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-8"
          >
            {/* Om dig */}
            <h2 className="text-lg font-extrabold text-ink">Om dig</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FeltLabel label="Navn" htmlFor="navn" />
                <input
                  id="navn"
                  type="text"
                  autoComplete="name"
                  value={navn}
                  onChange={(e) => setNavn(e.target.value)}
                  className={cn(inputCls, errors.navn && "border-brand")}
                />
                {errors.navn && (
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {errors.navn}
                  </p>
                )}
              </div>
              <div>
                <FeltLabel label="E-mail" htmlFor="email" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(inputCls, errors.email && "border-brand")}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <FeltLabel label="Telefonnummer" htmlFor="tel" />
                <input
                  id="tel"
                  type="tel"
                  autoComplete="tel"
                  placeholder="12 34 56 78"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  className={cn(inputCls, errors.tel && "border-brand")}
                />
                {errors.tel && (
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {errors.tel}
                  </p>
                )}
              </div>
            </div>

            {/* Om bilen */}
            <h2 className="mt-9 text-lg font-extrabold text-ink">Om bilen</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <FeltLabel label="Nummerplade" htmlFor="plade" />
                <div
                  className={cn(
                    "plate plate--compact",
                    errors.plade && "is-invalid",
                  )}
                  style={{ boxShadow: "none" }}
                >
                  <PlateEuBadge />
                  <input
                    id="plade"
                    type="text"
                    className="plate__input"
                    placeholder="EF 11223"
                    maxLength={7}
                    size={7}
                    autoComplete="off"
                    value={plade}
                    onChange={(e) => setPlade(formatPlate(e.target.value))}
                  />
                </div>
                {errors.plade && (
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {errors.plade}
                  </p>
                )}
              </div>
              <div>
                <FeltLabel label="Kilometertal" htmlFor="km" />
                <div className="relative">
                  <input
                    id="km"
                    type="text"
                    inputMode="numeric"
                    placeholder="168.000"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    className={cn(inputCls, "pr-12", errors.km && "border-brand")}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
                    km
                  </span>
                </div>
                {errors.km && (
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {errors.km}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <FeltLabel
                  label="Hvornår skal bilen sælges?"
                  htmlFor="hvornaar"
                />
                <div className="relative">
                  <select
                    id="hvornaar"
                    value={hvornaar}
                    onChange={(e) => setHvornaar(e.target.value)}
                    className={cn(
                      inputCls,
                      "appearance-none pr-10",
                      !hvornaar && "text-ink/45",
                      errors.hvornaar && "border-brand",
                    )}
                  >
                    <option value="" disabled>
                      Vælg mulighed
                    </option>
                    {HVORNAAR.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                </div>
                {errors.hvornaar && (
                  <p className="mt-1.5 text-sm font-medium text-brand">
                    {errors.hvornaar}
                  </p>
                )}
              </div>
            </div>

            {/* Frivillige felter */}
            <div className="mt-9 border-t border-black/5 pt-7">
              <h2 className="text-lg font-extrabold text-ink">
                Frivilligt — men giver ofte en bedre pris
              </h2>

              <div className="mt-4 space-y-6">
                <div>
                  <FeltLabel
                    label="Beskriv bilens stand (frivillig)"
                    hint="Bedre beskrivelse = bedre pris"
                    htmlFor="stand"
                  />
                  <textarea
                    id="stand"
                    rows={5}
                    value={stand}
                    onChange={(e) => setStand(e.target.value)}
                    placeholder="Fx servicehistorik, ridser/buler, nye dæk, ekstraudstyr …"
                    className={cn(inputCls, "resize-y")}
                  />
                </div>

                <div>
                  <FeltLabel
                    label="Billeder af bilen (frivillig)"
                    hint="Bedre billeder = bedre pris"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      tilfoejBilleder(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      tilfoejBilleder(e.dataTransfer.files);
                    }}
                    className={cn(
                      "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
                      drag
                        ? "border-trust bg-trust/5"
                        : "border-black/15 bg-white hover:border-trust/50",
                    )}
                  >
                    <ImagePlus className="h-7 w-7 text-ink/35" />
                    <span className="font-medium text-ink/75">
                      Klik eller træk filer hertil for at uploade
                    </span>
                    <span className="text-sm text-ink/45">
                      Du kan højst uploade {MAX_IMAGES} billeder.
                    </span>
                  </button>
                  {imgNote && (
                    <p className="mt-1.5 text-sm font-medium text-brand">
                      {imgNote}
                    </p>
                  )}
                  {billeder.length > 0 && (
                    <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {billeder.map((b, i) => (
                        <li key={b.url} className="group relative">
                          <img
                            src={b.url}
                            alt={`Billede ${i + 1} af bilen`}
                            className="aspect-square w-full rounded-lg object-cover ring-1 ring-black/10"
                          />
                          <button
                            type="button"
                            onClick={() => fjernBillede(i)}
                            aria-label={`Fjern billede ${i + 1}`}
                            className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white shadow-soft transition-colors hover:bg-brand"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FeltLabel
                      label="Forventet pris (frivillig)"
                      htmlFor="pris"
                    />
                    <div className="relative">
                      <input
                        id="pris"
                        type="text"
                        inputMode="numeric"
                        placeholder="120.000"
                        value={pris}
                        onChange={(e) => setPris(e.target.value)}
                        className={cn(inputCls, "pr-10")}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
                        kr
                      </span>
                    </div>
                  </div>
                  <div>
                    <FeltLabel
                      label="Hvor har du hørt om os (frivillig)"
                      htmlFor="kilde"
                    />
                    <div className="relative">
                      <select
                        id="kilde"
                        value={kilde}
                        onChange={(e) => setKilde(e.target.value)}
                        className={cn(
                          inputCls,
                          "appearance-none pr-10",
                          !kilde && "text-ink/45",
                        )}
                      >
                        <option value="" disabled>
                          Vælg mulighed
                        </option>
                        {KILDER.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <p className="mt-6 rounded-xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand">
                Udfyld venligst de markerede felter, så vi kan give dig det
                rigtige tilbud.
              </p>
            )}

            <button
              type="submit"
              className="btn-cta mt-7 inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-4 text-lg font-bold text-white shadow-soft"
            >
              Send og få dit tilbud
              <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <p className="mt-3 text-sm text-ink/50">
              Ved at indsende accepterer du, at vi kontakter dig om dit tilbud.
              Helt uforpligtende.
            </p>
          </form>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div
              className="reveal rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5"
              style={{ transitionDelay: "80ms" }}
            >
              <h3 className="font-extrabold text-ink">Derfor betaler det sig</h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Tilbud inden for 24 timer",
                  "Gratis afhentning i hele Danmark",
                  "Betaling samme dag som afhentning",
                  "Vi klarer afmelding og papirarbejde",
                ].map((punkt) => (
                  <li
                    key={punkt}
                    className="flex items-start gap-2.5 text-sm text-ink/75"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-tp"
                      strokeWidth={2.5}
                    />
                    {punkt}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="reveal rounded-2xl bg-ink p-6 text-white shadow-soft"
              style={{ transitionDelay: "140ms" }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <Phone className="h-4 w-4" /> Foretrækker du telefonen?
              </div>
              <a
                href="tel:+4570605040"
                className="mt-2 block text-2xl font-extrabold tracking-tight hover:text-brand"
              >
                70 60 50 40
              </a>
              <p className="mt-2 text-sm text-white/60">
                Hverdage 8–20 · weekend 10–16
              </p>
            </div>

            <div
              className="reveal flex items-center gap-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5"
              style={{ transitionDelay: "200ms" }}
            >
              <TrustpilotStar className="h-8 w-8 shrink-0" />
              <div>
                <TrustStars className="flex" />
                <p className="mt-1 text-sm text-ink/70">
                  <strong className="text-ink">4,8 ud af 5</strong> · 1.247
                  anmeldelser
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
