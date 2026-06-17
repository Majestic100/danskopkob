import { TrustpilotStar, TrustStars } from "@/components/icons";

export function Reviews() {
  return (
    <section id="anmeldelser" className="py-16 sm:py-24 bg-[#0d0d10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col items-center text-center mb-12">
          {/* Trustpilot-logo (inline SVG) + score */}
          <div className="flex items-center gap-2 mb-3">
            <TrustpilotStar className="w-6 h-6" />
            <span className="text-xl font-extrabold text-white">Trustpilot</span>
          </div>
          <div className="flex items-center gap-3">
            <TrustStars size="lg" className="flex" />
            <span className="text-sm text-white/70"><strong className="text-white">4,8</strong> ud af 5 · 1.247 anmeldelser</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Det siger vores sælgere</h2>
        </div>

        {/* SWAP: rigtige kundeanmeldelser ind her */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Anmeldelse 1 */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft">
            <TrustStars className="flex mb-4" />
            <h3 className="font-bold text-white mb-2">Fik 22.000 mere end forventet</h3>
            <p className="text-sm text-white/70 leading-relaxed">Jeg havde fået bud fra to forhandlere i forvejen, men tilbuddet her var markant højere. Bilen blev hentet to dage efter, og pengene stod på kontoen samme aften. Kan klart anbefales.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-trust/10 text-trust font-bold flex items-center justify-center text-sm">MK</div>
              <div><p className="text-sm font-semibold text-white leading-tight">Martin Kjær</p><p className="text-xs text-white/55">Aarhus</p></div>
            </div>
          </div>

          {/* Anmeldelse 2 */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '80ms' }}>
            <TrustStars className="flex mb-4" />
            <h3 className="font-bold text-white mb-2">Nemt fra start til slut</h3>
            <p className="text-sm text-white/70 leading-relaxed">Skrev nummerpladen ind om formiddagen og havde et tilbud før frokost. Alt foregik gnidningsfrit, og chaufføren der hentede bilen var flink og professionel.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-sm">LN</div>
              <div><p className="text-sm font-semibold text-white leading-tight">Louise Nielsen</p><p className="text-xs text-white/55">Odense</p></div>
            </div>
          </div>

          {/* Anmeldelse 3 */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '160ms' }}>
            <TrustStars className="flex mb-4" />
            <h3 className="font-bold text-white mb-2">Skeptisk, men blev positivt overrasket</h3>
            <p className="text-sm text-white/70 leading-relaxed">Jeg var lidt skeptisk over for at sælge til en eksportør, men det viste sig at være den bedste beslutning. De var ærlige om processen hele vejen, og prisen holdt det de lovede. Ingen overraskelser.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-trust/10 text-trust font-bold flex items-center justify-center text-sm">PA</div>
              <div><p className="text-sm font-semibold text-white leading-tight">Peter Andersen</p><p className="text-xs text-white/55">Aalborg</p></div>
            </div>
          </div>

          {/* Anmeldelse 4 */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '40ms' }}>
            <TrustStars className="flex mb-4" />
            <h3 className="font-bold text-white mb-2">Hurtig afhentning helt ude på landet</h3>
            <p className="text-sm text-white/70 leading-relaxed">Vi bor et godt stykke uden for Esbjerg og havde regnet med besvær. Men de kom hele vejen ud uden ekstra omkostninger. Super service.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-sm">HT</div>
              <div><p className="text-sm font-semibold text-white leading-tight">Hanne Thomsen</p><p className="text-xs text-white/55">Esbjerg</p></div>
            </div>
          </div>

          {/* Anmeldelse 5 */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '120ms' }}>
            <TrustStars className="flex mb-4" />
            <h3 className="font-bold text-white mb-2">Solgte min varebil på en dag</h3>
            <p className="text-sm text-white/70 leading-relaxed">Havde en ældre Transporter stående efter jeg lukkede mit firma. De gav et fair bud med det samme, og hele handlen var afsluttet inden for 24 timer. Anbefales til andre håndværkere.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-trust/10 text-trust font-bold flex items-center justify-center text-sm">SØ</div>
              <div><p className="text-sm font-semibold text-white leading-tight">Søren Østergaard</p><p className="text-xs text-white/55">Vejle</p></div>
            </div>
          </div>

          {/* Anmeldelse 6 */}
          <div className="reveal bg-white/5 border border-white/10 rounded-2xl p-6 shadow-soft" style={{ transitionDelay: '200ms' }}>
            <TrustStars className="flex mb-4" />
            <h3 className="font-bold text-white mb-2">God kommunikation hele vejen</h3>
            <p className="text-sm text-white/70 leading-relaxed">Det jeg satte mest pris på var, at jeg altid vidste hvad der skete. Jeg fik besked på sms både før og efter afhentning. Tryg oplevelse, og en pris jeg ikke kunne finde andre steder.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-sm">CB</div>
              <div><p className="text-sm font-semibold text-white leading-tight">Camilla Bach</p><p className="text-xs text-white/55">København</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
