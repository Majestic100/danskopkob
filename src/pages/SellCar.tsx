import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ImagePlus,
  Phone,
  ShieldCheck,
  Sparkles,
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

  // Trin 1 (påkrævet): nummerplade + kontaktoplysninger
  const [plade, setPlade] = useState(formatPlate(params.get("plade") ?? ""));
  const [navn, setNavn] = useState(params.get("navn") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [tel, setTel] = useState(params.get("tel") ?? "");

  // Trin 2 (alt frivilligt)
  const [km, setKm] = useState("");
  const [hvornaar, setHvornaar] = useState("");
  const [stand, setStand] = useState("");
  const [billeder, setBilleder] = useState<Billede[]>([]);
  const [pris, setPris] = useState("");

  const [trin, setTrin] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imgNote, setImgNote] = useState("");
  const [drag, setDrag] = useState(false);
  const [sendt, setSendt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Sælg din bil | MinBilPris — udfyld salgsformularen";
  }, []);

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

  // Trin 1 → 2: leadet er fanget her (nummerplade + kontakt). GHL: send
  // oplysningerne allerede nu, så et afbrudt trin 2 ikke koster leadet.
  function handleTrin1(e: React.FormEvent) {
    e.preventDefault();
    const fejl: Record<string, string> = {};
    if (!isValidPlate(plade))
      fejl.plade = "Indtast en gyldig dansk nummerplade, fx AB 12 345.";
    if (navn.trim().length < 2) fejl.navn = "Skriv dit navn.";
    if (!isValidEmail(email)) fejl.email = "Indtast en gyldig emailadresse.";
    if (!isValidPhone(tel))
      fejl.tel = "Indtast et gyldigt telefonnummer (8 cifre).";
    setErrors(fejl);
    if (Object.keys(fejl).length > 0) return;

    // GHL: opret/opdatér lead med plade, navn, email, telefon.
    setTrin(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Trin 2: alt er frivilligt — kan sendes tomt.
  function handleTrin2(e: React.FormEvent) {
    e.preventDefault();
    // GHL: berig samme lead med km, tidshorisont, stand, billeder og pris.
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
              {billeder.length > 0 && <> og dine {billeder.length} billeder</>}.
              Nu sker der følgende:
            </p>
            <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left">
              {[
                "Vi gennemgår bilens oplysninger og markedet",
                "En dansk rådgiver ringer dig op — typisk inden for 15 min.",
                "Siger du ja, betaler vi — og henter bilen gratis bagefter",
              ].map((trinTekst, i) => (
                <li key={trinTekst} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-extrabold text-brand">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink/75">{trinTekst}</span>
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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="reveal flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-brand">
            <DanishFlag className="h-3.5 w-5 rounded-[2px]" /> Salgsformular
          </p>
          <h1 className="reveal mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {trin === 1 ? "Få prisen på din bil" : "Vil du have en skarpere pris?"}
          </h1>
          <p
            className="reveal mt-3 max-w-2xl text-lg text-ink/60"
            style={{ transitionDelay: "80ms" }}
          >
            {trin === 1
              ? "Nummerplade og kontaktoplysninger — så ringer vi med et uforpligtende tilbud."
              : "Vi har dine oplysninger. Alt herunder er frivilligt, men jo mere vi ved, desto skarpere bliver tilbuddet."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Trin-indikator */}
        <div className="reveal mb-6 flex items-center gap-3">
          {[1, 2].map((n) => (
            <div key={n} className="flex flex-1 items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-colors",
                  trin >= n
                    ? "bg-brand text-white"
                    : "bg-ink/10 text-ink/50",
                )}
              >
                {trin > n ? <Check className="h-4 w-4" strokeWidth={3} /> : n}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  trin >= n ? "text-ink" : "text-ink/45",
                )}
              >
                {n === 1 ? "Dine oplysninger" : "Ekstra info (frivilligt)"}
              </span>
              {n === 1 && (
                <span className="h-px flex-1 bg-black/10 max-sm:hidden" />
              )}
            </div>
          ))}
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
          {trin === 1 ? (
            /* ---------- TRIN 1: nummerplade + kontakt ---------- */
            <form
              noValidate
              onSubmit={handleTrin1}
              className="reveal rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-8"
            >
              {/* Social proof over felterne */}
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-trust/5 px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink">
                  <Sparkles className="h-5 w-5 text-white" strokeWidth={2} />
                </span>
                <p className="text-sm text-ink/75">
                  Mere end <strong className="text-ink">50.000 bilejere</strong>{" "}
                  har brugt formularen
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
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

              <button
                type="submit"
                className="btn-cta mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-lg font-bold text-white shadow-soft sm:w-auto"
              >
                Fortsæt
                <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <p className="mt-3 text-sm text-ink/50">
                Ved at fortsætte accepterer du, at vi kontakter dig om dit
                tilbud. Helt uforpligtende.
              </p>
            </form>
          ) : (
            /* ---------- TRIN 2: alt frivilligt ---------- */
            <form
              noValidate
              onSubmit={handleTrin2}
              className="reveal rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-8"
            >
              {/* Kvittering for trin 1, så de to trin hænger sammen */}
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-tp/5 px-4 py-3">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-tp">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Modtaget
                </span>
                <span className="text-sm text-ink/70">
                  <strong className="text-ink">{plade}</strong> · {navn}
                </span>
                <button
                  type="button"
                  onClick={() => setTrin(1)}
                  className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-ink/55 transition-colors hover:text-ink"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Ret
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FeltLabel label="Kilometertal (frivillig)" htmlFor="km" />
                    <div className="relative">
                      <input
                        id="km"
                        type="text"
                        inputMode="numeric"
                        placeholder="168.000"
                        value={km}
                        onChange={(e) => setKm(e.target.value)}
                        className={cn(inputCls, "pr-12")}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink/45">
                        km
                      </span>
                    </div>
                  </div>
                  <div>
                    <FeltLabel
                      label="Hvornår skal bilen sælges? (frivillig)"
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
                  </div>
                </div>

                <div>
                  <FeltLabel
                    label="Bilens stand (frivillig)"
                    hint="Bedre beskrivelse = bedre pris"
                    htmlFor="stand"
                  />
                  <textarea
                    id="stand"
                    rows={2}
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
                      "flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-5 text-center transition-colors",
                      drag
                        ? "border-trust bg-trust/5"
                        : "border-black/15 bg-white hover:border-trust/50",
                    )}
                  >
                    <ImagePlus className="h-5 w-5 shrink-0 text-ink/35" />
                    <span className="text-sm font-medium text-ink/75">
                      Klik eller træk billeder hertil{" "}
                      <span className="text-ink/45">(højst {MAX_IMAGES})</span>
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

                <div className="sm:max-w-[50%]">
                  <FeltLabel label="Forventet pris (frivillig)" htmlFor="pris" />
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
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="btn-cta inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 text-lg font-bold text-white shadow-soft"
                >
                  Send og få dit tilbud
                  <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
                </button>
                <button
                  type="submit"
                  className="rounded-xl px-4 py-3 font-semibold text-ink/55 transition-colors hover:text-ink"
                >
                  Spring over — ring mig bare op
                </button>
              </div>
            </form>
          )}

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div
              className="reveal rounded-2xl bg-white p-6 shadow-soft ring-1 ring-black/5"
              style={{ transitionDelay: "80ms" }}
            >
              <h2 className="font-extrabold text-ink">Derfor betaler det sig</h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Tilbud inden for 24 timer",
                  "Pengene på din konto, før vi henter bilen",
                  "Gratis afhentning i hele Danmark",
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
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-tp/5 px-3 py-2.5 text-xs font-semibold text-tp">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Straksoverførsel — beløbet står på kontoen, før bilen køres væk
              </p>
            </div>

            {/* Rådgiver-kort med billede ved telefonnummeret */}
            <div
              className="reveal rounded-2xl bg-ink p-6 text-white shadow-soft"
              style={{ transitionDelay: "140ms" }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Sofie Hansen, bilkonsulent"
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white/15"
                />
                <div>
                  <p className="text-sm font-bold leading-tight">
                    Sofie Hansen
                  </p>
                  <p className="text-xs text-white/55">Bilkonsulent</p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-tp">
                    <span className="h-1.5 w-1.5 rounded-full bg-tp" />
                    Klar ved telefonen
                  </span>
                </div>
              </div>
              <a
                href="tel:+4570605040"
                className="mt-4 flex items-center gap-2 text-2xl font-extrabold tracking-tight transition-colors hover:text-brand"
              >
                <Phone className="h-5 w-5" /> 70 60 50 40
              </a>
              <p className="mt-1.5 text-sm text-white/60">
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
