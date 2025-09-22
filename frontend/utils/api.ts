// frontend/utils/api.ts
import axios, { AxiosError } from "axios";

const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Interceptor de resposta → loga erros no console (útil em dev)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === "ECONNABORTED") {
      console.error("[API] Timeout:", error.message);
    } else if (error.response) {
      console.error("[API] Erro HTTP:", error.response.status, error.response.data);
    } else {
      console.error("[API] Erro de rede:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

/* -------------------------------
   Funções utilitárias da API
--------------------------------*/

// Lista todos os comentários já salvos no banco
export async function getComentarios() {
  const res = await api.get("/resultados/");
  return res.data;
}

// Deleta um comentário pelo ID
export async function deleteComentario(id: number) {
  const res = await api.delete(`/resultados/${id}`);
  return res.data;
}

// Coleta comentários de um post público do Facebook
// Aceita tanto query quanto JSON, mas aqui usamos JSON (mais limpo)
export async function coletarComentarios(link: string) {
  const res = await api.post("/coletar/", { link });
  return res.data;
}
