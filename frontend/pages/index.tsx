import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";

type Resultado = {
  id?: number | null;
  autor?: string | null;
  comentario?: string | null;
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
  const [onlyHasPhoto, setOnlyHasPhoto] = useState(false);
  const [categoria, setCategoria] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchResultados = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await api.get<Resultado[]>("/resultados/");
      setResultados(res.data || []);
    } catch (e: any) {
      setErr(e?.message || "Erro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultados();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/resultados/${id}`);
      setResultados((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Falha ao deletar.");
    }
  };

  const handleAddToDossie = async (id: number) => {
    try {
      await api.post(`/dossie/adicionar/${id}`);
      alert("Adicionado ao dossiê!");
    } catch {
      alert("Falha ao adicionar ao dossiê.");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Tem certeza que deseja excluir TODOS os resultados?")) return;
    try {
      await api.delete("/resultados/todos");
      await fetchResultados();
    } catch {
      alert("Falha ao excluir todos.");
    }
  };

  const handleAddAllToDossie = async () => {
    try {
      await api.post("/resultados/adicionar_todos_dossie");
      alert("Todos adicionados ao dossiê!");
      await fetchResultados();
    } catch {
      alert("Falha ao adicionar todos ao dossiê.");
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (resultados || []).filter((r) => {
      if (onlyHasPhoto && !r.foto_url) return false;
      if (categoria && r.categoria !== categoria) return false;
      if (!term) return true;
      const blob = [
        r.autor,
        r.comentario,
        r.categoria,
        r.palavras,
        r.url_post,
        r.url_comentario,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(term);
    });
  }, [resultados, q, onlyHasPhoto, categoria]);

  const categoriaBorder = (cat?: string | null) => {
    switch (cat) {
      case "violenta":
        return "border-red-500";
      case "generica":
        return "border-green-500";
      case "neutra":
        return "border-neutral-600";
      default:
        return "border-neutral-700";
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Vitrine de Comentários (OSINT)
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Resultados carregados de <code>/resultados/</code>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="input"
            placeholder="Filtrar por nome, texto, cat…"
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
          <label className="flex items-center gap-2 text-sm text-neutral-400">
            <input
              type="checkbox"
              checked={onlyHasPhoto}
              onChange={(e) => setOnlyHasPhoto(e.target.checked)}
              className="accent-green-500"
            />
            Apenas com foto
          </label>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-3 justify-end">
        <button
          onClick={handleDeleteAll}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
        >
          🗑️ Deletar Todos
        </button>
        <button
          onClick={handleAddAllToDossie}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
        >
          📑 Adicionar Todos ao Dossiê
        </button>
        <a
          href={`${
            process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
          }/dossie/exportar`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium"
        >
          📄 Exportar Dossiê (PDF)
        </a>
      </div>

      {loading && <div className="text-neutral-400">Carregando…</div>}
      {err && <div className="text-red-400">Erro: {err}</div>}
      {!loading && !err && filtered.length === 0 && (
        <div className="text-neutral-400">Nada encontrado.</div>
      )}

      <section className="grid-cards">
        {filtered.map((r, idx) => (
          <article
            key={r.id ?? idx}
            className={`card relative border-2 ${categoriaBorder(r.categoria)}`}
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => r.id && handleAddToDossie(r.id)}
                className="text-blue-400 hover:text-blue-600"
                title="Adicionar ao dossiê"
              >
                📑
              </button>
              <button
                onClick={() => r.id && handleDelete(r.id)}
                className="text-red-500 hover:text-red-700"
                title="Descartar"
              >
                ❌
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center">
                {r.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.foto_url || ""}
                    alt={r.autor || "foto"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">👤</span>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-medium truncate">{r.autor || "—"}</h2>
                <div className="text-xs text-neutral-400 truncate">
                  {r.categoria || "—"}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
              {r.comentario || "Sem texto."}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
              <span className="truncate">
                {r.data_detectada
                  ? new Date(r.data_detectada).toLocaleString("pt-BR")
                  : ""}
              </span>
              <div className="flex gap-3">
                {r.url_post && (
                  <a
                    className="underline hover:no-underline text-blue-400"
                    href={r.url_post}
                    target="_blank"
                    rel="noreferrer"
                  >
                    publicação
                  </a>
                )}
                {r.url_comentario && (
                  <a
                    className="underline hover:no-underline text-green-400"
                    href={r.url_comentario}
                    target="_blank"
                    rel="noreferrer"
                  >
                    comentário
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
