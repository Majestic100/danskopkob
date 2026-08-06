/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Hvor serverlaget ligger. Tom værdi betyder samme domæne som sitet.
   *
   * Ligger sitet på Vercel, findes /api/* samme sted, og variablen skal ikke
   * sættes. Bliver sitet på GitHub Pages med en Cloudflare Worker ved siden af,
   * sættes den til fx https://api.minbilpris.dk.
   *
   * VITE_-variabler bages ind i klient-bundlen og er derfor synlige. Det er
   * fint her: det er en adresse, ikke en hemmelighed. Tokenet bliver på
   * serveren.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
