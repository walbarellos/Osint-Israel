import { useState } from "react";
import { useRouter } from "next/router";

type Comentario = {
  id: number;
  autor: string;
  comentario: string;
  data_detectada: string;
};

export default function Coletar() {
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [novos, setNovos] = useState<Comentario[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("⏳ Coletando...");
    setNovos([]);

    try {
      const res = await fetch("http://localhost:8000/coletar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ ${data.novos} novos comentários inseridos`);
        setNovos(data.comentarios || []);
        // redireciona após 3 segundos
        setTimeout(() => router.push("/resultados"), 3000);
      } else {
        setStatus(`❌ Erro: ${data.detail || "Falha na coleta"}`);
      }
    } catch (err) {
      setStatus("❌ Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="mx-auto max-w-xl py-10">
      <h1 className="mb-4 text-2xl font-bold text-white">Coletar Publicação</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          placeholder="Cole o link da publicação..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          className="flex-1 rounded-md border border-gray-700 bg-gray-900 p-2 text-white"
        />
        <button
          type="submit"
          className="rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-500"
        >
          Coletar
        </button>
      </form>

      {status && <p className="mt-4 text-white">{status}</p>}

      {novos.length > 0 && (
        <div className="mt-6 rounded-md border border-gray-700 bg-gray-800 p-4">
          <h2 className="mb-2 text-lg font-semibold text-cyan-300">
            Novos comentários:
          </h2>
          <ul className="space-y-2">
            {novos.map((c) => (
              <li key={c.id} className="rounded bg-gray-900 p-2">
                <p className="text-sm text-white">
                  <span className="font-bold">{c.autor}:</span> {c.comentario}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(c.data_detectada).toLocaleString("pt-BR")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
