// frontend/components/Comentarios.tsx
import { useEffect, useState } from "react";
import { getComentarios, deleteComentario, coletarComentarios } from "../utils/api";

interface Comentario {
  id: number;
  autor: string;
  comentario: string;
  foto_url?: string;
  url_post?: string;
}

export default function Comentarios() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // Carrega os comentários existentes
  useEffect(() => {
    getComentarios().then(setComentarios);
  }, []);

  // Apagar comentário
  const handleDelete = async (id: number) => {
    await deleteComentario(id);
    setComentarios(comentarios.filter((c) => c.id !== id));
  };

  // Coletar novos comentários de um link
  const handleColetar = async () => {
    if (!link.trim()) {
      setMsg("Informe um link válido de post do Facebook.");
      return;
    }
    try {
      setLoading(true);
      const res = await coletarComentarios(link);
      setMsg(`${res.novos} novos comentários coletados.`);
      // recarregar lista completa
      const todos = await getComentarios();
      setComentarios(todos);
    } catch (err) {
      console.error(err);
      setMsg("Erro durante coleta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Vitrine de Comentários</h1>

      {/* Formulário para coletar */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Cole o link do post do Facebook"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleColetar}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {loading ? "Coletando..." : "Coletar"}
        </button>
      </div>

      {/* Mensagem de feedback */}
      {msg && <p className="mb-4 text-sm text-gray-700">{msg}</p>}

      {/* Lista de comentários */}
      <div className="grid gap-4">
        {comentarios.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-xl shadow-md flex items-start gap-4"
          >
            {c.foto_url ? (
              <img
                src={c.foto_url}
                alt={c.autor}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
            )}
            <div className="flex-1">
              <h2 className="font-semibold">{c.autor}</h2>
              <p className="text-gray-700">{c.comentario}</p>
              {c.url_post && (
                <a
                  href={c.url_post}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm"
                >
                  Ver post original
                </a>
              )}
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
