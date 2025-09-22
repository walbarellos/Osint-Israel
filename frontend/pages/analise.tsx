import { useEffect, useState } from "react";
import api from "../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Resultado = {
  id: number;
  autor: string;
  comentario: string;
  categoria?: string | null;
  palavras?: string | null;
  data_detectada?: string | null;
};

export default function Analise() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Resultado[]>("/resultados/")
      .then((res) => setResultados(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando análise…</div>;

  // ---------- MÉTRICAS ----------
  const total = resultados.length;
  const violentas = resultados.filter((r) => r.categoria === "violenta").length;
  const genericas = resultados.filter((r) => r.categoria === "generica").length;
  const neutras = resultados.filter((r) => r.categoria === "neutra").length;

  // ---------- PIE DATA ----------
  const pieData = [
    { name: "Violentas", value: violentas },
    { name: "Genéricas", value: genericas },
    { name: "Neutras", value: neutras },
  ];
  const COLORS = ["#ef4444", "#3b82f6", "#22c55e"];

  // ---------- BAR DATA (palavras mais comuns) ----------
  const wordCount: Record<string, number> = {};
  resultados.forEach((r) => {
    if (r.palavras) {
      r.palavras.split(",").forEach((p) => {
        const w = p.trim().toLowerCase();
        if (w) wordCount[w] = (wordCount[w] || 0) + 1;
      });
    }
  });
  const barData = Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // ---------- ÚLTIMOS VIOLENTOS ----------
  const ultimosViolentos = resultados
    .filter((r) => r.categoria === "violenta")
    .slice(-5)
    .reverse();

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard de Análise</h1>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-neutral-400">Total</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-400">{violentas}</div>
          <div className="text-neutral-400">Violentas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-400">{genericas}</div>
          <div className="text-neutral-400">Genéricas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{neutras}</div>
          <div className="text-neutral-400">Neutras</div>
        </div>
      </div>

      {/* PIE */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Distribuição por categoria</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Top palavras detectadas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ÚLTIMOS VIOLENTOS */}
      <div className="card p-6">
        <h2 className="font-semibold mb-4">Últimos comentários violentos</h2>
        <ul className="space-y-3">
          {ultimosViolentos.map((r) => (
            <li key={r.id} className="border-b border-neutral-800 pb-2">
              <span className="font-semibold">{r.autor}</span>:{" "}
              <span className="text-sm text-neutral-300">{r.comentario}</span>
              <div className="text-xs text-neutral-500">
                {r.data_detectada || ""}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
