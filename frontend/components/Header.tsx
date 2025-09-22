import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo ou título */}
        <div className="text-lg font-extrabold tracking-wider text-cyan-300">
          OSINT Noahide
        </div>

        {/* Menu */}
        <nav className="flex items-center gap-6 text-sm font-semibold text-white/80">
          <Link
            href="/resultados"
            className="transition hover:text-white"
            aria-label="Ir para Resultados"
          >
            Resultados
          </Link>
          <Link
            href="/coletar"
            className="transition hover:text-white"
            aria-label="Ir para Coletar Publicação"
          >
            Coletar
          </Link>
          <Link
            href="/dossie"
            className="transition hover:text-white"
            aria-label="Ir para Dossiê"
          >
            Dossiê
          </Link>
        </nav>
      </div>
    </header>
  );
}
