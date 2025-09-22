// frontend/pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
