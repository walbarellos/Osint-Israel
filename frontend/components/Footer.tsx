import React from "react";
import StarOfDavid from "./StarOfDavid";

const Footer: React.FC = () => {
  return (
    <footer
      className="mt-10 border-t border-white/10 bg-gradient-to-b from-transparent to-black/30
                 backdrop-blur-sm"
      role="contentinfo"
      aria-label="Rodapé OSINT Noahide"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Marca */}
          <div className="flex items-center gap-3">
            <StarOfDavid
              size={48}
              className="text-cyan-300 drop-shadow-lg animate-pulse-glow"
              title="Magen David"
            />
            <div className="leading-tight">
              <p
                className="text-lg font-extrabold tracking-wider text-white"
                aria-label="Am Israel Chai"
                title="Am Israel Chai"
              >
                AM ISRAEL CHAI
              </p>
              <p className="text-xs text-white/60">
                Vigilância cívica e documentação OSINT
              </p>
            </div>
          </div>

          {/* Ações/Links */}
          <nav className="flex items-center gap-4 text-sm text-white/80">
            <a
              href="/resultados/"
              className="transition hover:text-white"
              aria-label="Ir para Vitrine de Comentários"
            >
              Vitrine
            </a>
            <a
              href="/api/docs"
              className="transition hover:text-white"
              aria-label="Abrir documentação da API"
            >
              API
            </a>
            <a
              href="https://github.com/walbarellos"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-white/10 px-3 py-1.5
                         text-white/90 transition hover:border-white/20 hover:text-white"
              aria-label="Saiba mais"
            >
              Saiba mais
            </a>
          </nav>
        </div>

        {/* Verso sagrado */}
        <div className="mt-8 text-center">
          <p className="text-2xl font-extrabold text-amber-300 tracking-widest glow-hebrew">
            שִׁוִּיתִי ה׳ לְנֶגְדִּי תָמִיד
          </p>
          <p className="text-sm text-white/70 italic">
            “Sempre coloco o Eterno diante de mim” — Tehilim 16:8
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
