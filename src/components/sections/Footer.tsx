import { Link } from "react-router-dom";
import { DanishFlag } from "@/components/icons";
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

export function Footer() {
  return (
    <footer className="bg-ink text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Logo + kontakt */}
          <div className="lg:col-span-2">
            {/* SWAP: rigtigt logo */}
            <span className="text-2xl font-extrabold tracking-tight">MinBil<span className="text-brand">Pris</span></span>
            <p className="mt-4 text-white/60 text-sm max-w-xs">Vi opkøber og eksporterer brugte biler i hele Danmark og betaler dig mere end det danske marked.</p>

            <div className="mt-6 space-y-2 text-sm">
              <p className="text-white/50 uppercase tracking-wider text-xs font-semibold mb-2">Kundeservice</p>
              {/* SWAP: rigtig kontaktinfo */}
              <a href="tel:+4570605040" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                70 60 50 40
              </a>
              <a href="mailto:kontakt@minbilpris.dk" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                kontakt@minbilpris.dk
              </a>
            </div>

            {/* Sociale ikoner */}
            <div className="mt-6 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link-kolonner */}
          <div>
            <p className="text-white/50 uppercase tracking-wider text-xs font-semibold mb-4">Sælg din bil</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href={`${BASE}#tilbud`} className="hover:text-white transition-colors">Personbil</a></li>
              <li><a href={`${BASE}#tilbud`} className="hover:text-white transition-colors">Varebil</a></li>
              <li><a href={`${BASE}#anmeldelser`} className="hover:text-white transition-colors">Anmeldelser</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white/50 uppercase tracking-wider text-xs font-semibold mb-4">Virksomhed</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Om os</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karriere</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white/50 uppercase tracking-wider text-xs font-semibold mb-4">Juridisk</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Cookiepolitik</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privatlivspolitik</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Handelsbetingelser</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© 2026 MinBilPris. Alle rettigheder forbeholdes.</p>
          <div className="flex items-center gap-2">
            <DanishFlag className="w-6 h-4 rounded-sm" />
            <span className="text-sm text-white/50">Dansk virksomhed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
