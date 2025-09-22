// frontend/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex gap-4 bg-neutral-900 text-white px-6 py-3 shadow-md">
      <Link
        href="/"
        className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-sm font-medium"
      >
        🏠 Home
      </Link>
      <Link
        href="/resultados"
        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm font-medium"
      >
        📊 Resultados
      </Link>
      <Link
        href="/coletar"
        className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-sm font-medium"
      >
        📥 Coletar
      </Link>
    </nav>
  );
}
