import "./../styles/globals.css";
import Link from "next/link";

export const metadata = {
  title: "OSINT Noahide",
  description: "Dashboard de análise de comentários coletados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col font-sans">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 bg-neutral-900 border-b border-neutral-800 shadow-md">
          <nav className="container mx-auto px-4 flex items-center justify-between h-14">
            {/* Logo / título */}
            <Link href="/" className="text-lg font-bold tracking-wide">
              OSINT <span className="text-green-400">Noahide</span>
            </Link>

            {/* Menu principal */}
            <ul className="flex gap-6 text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-400 transition-colors"
                >
                  Vitrine
                </Link>
              </li>
              <li>
                <Link
                  href="/comentarios"
                  className="hover:text-green-400 transition-colors"
                >
                  Comentários
                </Link>
              </li>
              <li>
                <Link
                  href="/analise"
                  className="hover:text-green-400 transition-colors"
                >
                  Análise
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* CONTEÚDO */}
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
          <div className="flex flex-col items-center gap-2">
            <span>
              © {new Date().getFullYear()} OSINT Noahide · Todos os direitos
              reservados
            </span>
            <div className="flex items-center gap-2 text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 animate-pulse"
              >
                <path d="M12 2l2.39 4.92L20 8.26l-3.91 3.81L17.3 18 12 15.27 6.7 18l1.21-5.93L4 8.26l5.61-1.34L12 2z" />
              </svg>
              <span className="font-semibold">Am Israel Chai</span>
            </div>
            {/* Botão de voltar ao topo */}
            <a
              href="#"
              className="mt-2 text-green-400 hover:text-green-300 transition-colors"
            >
              ↑ Voltar ao topo
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
