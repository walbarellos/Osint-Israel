import { useEffect, useState } from "react";
import api from "../utils/api";

interface Resultado {
  id: number;
  autor: string;
  comentario: string;
  foto_url?: string | null;
  url_post?: string | null;
  url_comentario?: string | null;
  categoria?: string | null;
  palavras?: string | null;
  data_detectada?: string;
}

export default function Resultados() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoria, setCategoria] = useState<string>("");

  async function carregar(cat?: string) {
    setLoading(true);
    try {
      const url = cat
        ? `/resultados/?categoria=${cat}`
        : "/resultados/";
      const res = await api.get<Resultado[]>(url);
      setResultados(res.data);
    } catch (err) {
      console.error("Erro ao buscar resultados:", err);
      setError("Erro ao carregar resultados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar(categoria);
  }, [categoria]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-cyan-400">
        Vitrine de Resultados
      </h1>

      {/* Filtro por categoria */}
      <div className="flex items-center gap-3">
        <label className="text-white/80">Categoria:</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-md border border-neutral-700 bg-neutral-900 p-2 text-white"
        >
          <option value="">Todas</option>
          <option value="dossie">Dossiê</option>
          <option value="violenta">Violenta</option>
          <option value="generica">Genérica</option>
          <option value="neutra">Neutra</option>
        </select>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <p className="text-white">⏳ Carregando resultados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : resultados.length === 0 ? (
        <p className="text-neutral-400">Nenhum comentário coletado ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-neutral-700 bg-neutral-800 p-4 space-y-2 shadow hover:shadow-lg transition"
            >
              {/* Foto + Autor */}
              <div className="flex items-center gap-3">
                {r.foto_url ? (
                  <img
                    src={r.foto_url}
                    alt={r.autor}
                    className="w-12 h-12 rounded-full border border-neutral-700 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white">
                    {r.autor?.[0] || "?"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-white">{r.autor}</p>
                  {r.categoria && (
                    <span className="text-xs text-cyan-400">{r.categoria}</span>
                  )}
                </div>
              </div>

              {/* Comentário */}
              <p className="text-sm text-neutral-300">{r.comentario}</p>

              {/* Links */}
              <div className="flex gap-3 text-xs">
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
          ))}
        </div>
      )}
    </div>
  );
}
