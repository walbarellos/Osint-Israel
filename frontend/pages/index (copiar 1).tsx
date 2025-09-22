// frontend/pages/index.tsx
import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";

type Resultado = {
  id: number;
  autor: string;
  comentario: string;
  foto_url?: string | null;
  url_post?: string | null;
  url_comentario?: string | null;
  categoria?: string | null;
  palavras?: string | null;
  data_detectada?: string | null;
};

export default function Home() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [q, setQ] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get<Resultado[]>("/resultados/")
      .then((res) => {
        if (alive) setResultados(res.data || []);
      })
      .catch((e) => {
        if (alive) setErr(e?.message || "Erro ao carregar resultados");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (resultados || []).filter((r) => {
      if (categoria && r.categoria !== categoria) return false;
      if (!term) return true;
      const blob = [
        r.autor,
        r.comentario,
        r.categoria,
        r.palavras,
        r.url_post,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [resultados, q, categoria]);

  const categoriaBorder = (cat?: string | null) => {
    switch (cat) {
      case "violenta":
        return "border-red-500";
      case "generica":
        return "border-green-500";
      case "neutra":
      default:
        return "border-neutral-600";
    }
  };

  return (
    <main className="min-h-screen p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            Vitrine de Resultados
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Dados coletados de <code>/resultados/</code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input"
            placeholder="Pesquisar por nome, texto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas categorias</option>
            <option value="violenta">Violentas</option>
            <option value="generica">Genéricas</option>
            <option value="neutra">Neutras</option>
            <option value="dossie">Dossiê</option>
          </select>
        </div>
      </header>

      {loading && <div className="text-neutral-400">Carregando…</div>}
      {err && <div className="text-red-400">Erro: {err}</div>}

      {!loading && !err && filtered.length === 0 && (
        <div className="text-neutral-400">Nenhum resultado encontrado.</div>
      )}

      <section className="grid-cards">
        {filtered.map((r) => (
          <article
            key={r.id}
            className={`card border-2 ${categoriaBorder(r.categoria)}`}
          >
            <div className="flex items-center gap-3">
              {r.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.foto_url}
                  alt={r.autor}
                  className="w-12 h-12 rounded-full object-cover border border-neutral-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white font-bold">
                  {r.autor?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              <div>
                <h2 className="font-semibold">{r.autor}</h2>
                <p className="text-xs text-neutral-400">{r.categoria || "—"}</p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed">{r.comentario}</p>

            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
              <span>{r.data_detectada || ""}</span>
              <div className="flex gap-3">
                {r.url_post && (
                  <a
                    href={r.url_post}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Ver post
                  </a>
                )}
                {r.url_comentario && (
                  <a
                    href={r.url_comentario}
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-400 hover:underline"
                  >
                    Ver comentário
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
