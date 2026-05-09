"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      saveToken(res.data.token);
      router.push("/dashboard");
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--bg-primary)">
      <div className="w-full max-w-md p-8 rounded-2xl border border-(--border) bg-(--bg-card)">
        <h1 className="text-2xl font-bold mb-2 text-(--text-primary)">
          StockFlow
        </h1>
        <p className="mb-8 text-sm text-(--text-secondary)">
          Ingresá a tu cuenta
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm mb-1 block text-(--text-secondary)">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-(--border) outline-none transition-all bg-(--bg-secondary) text-(--text-primary)"
            />
          </div>

          <div>
            <label className="text-sm mb-1 block text-(--text-secondary)">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-(--border) outline-none transition-all bg-(--bg-secondary) text-(--text-primary)"
            />
          </div>

          {error && <p className="text-sm text-(--danger)">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer bg-(--accent) text-white"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}
