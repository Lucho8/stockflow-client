"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StockMovement, Product } from "@/lib/types";
import { getRole, getUser } from "@/lib/auth";

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    productId: "", type: "IN", quantity: "", notes: "", userId: ""
  });

  const fetchData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        api.get("/stockmovements"),
        api.get("/products"),
      ]);
      setMovements(movementsRes.data);
      setProducts(productsRes.data);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRole(getRole());
    const user = getUser();
    if (user) setForm((f) => ({ ...f, userId: user.nameid }));
    fetchData();
  }, []);

  const handleSubmit = async () => {
    setFormError("");
    if (!form.productId) { setFormError("Seleccioná un producto."); return; }
    if (!form.quantity || isNaN(parseInt(form.quantity)) || parseInt(form.quantity) <= 0) {
      setFormError("Cantidad inválida."); return;
    }

    const payload = {
      productId: parseInt(form.productId),
      type: form.type,
      quantity: parseInt(form.quantity),
      notes: form.notes,
      userId: parseInt(form.userId),
    };

    try {
      await api.post("/stockmovements", payload);
      setShowForm(false);
      setForm((f) => ({ ...f, productId: "", type: "IN", quantity: "", notes: "" }));
      fetchData();
    } catch (e: any) {
      setFormError(e.response?.data?.title || "Error al registrar movimiento.");
    }
  };

  if (loading) return <p className="text-(--text-secondary)">Cargando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--text-primary)">Movimientos</h2>
        <button
          onClick={() => { setShowForm(true); setFormError(""); }}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
        >
          + Registrar movimiento
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card) flex flex-col gap-4">
          <h3 className="font-semibold text-(--text-primary)">Nuevo movimiento</h3>
          <select
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          >
            <option value="">Seleccioná un producto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
            ))}
          </select>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          >
            <option value="IN">Entrada</option>
            <option value="OUT">Salida</option>
          </select>
          <input
            placeholder="Cantidad"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="Notas (opcional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          {formError && <p className="text-sm text-(--danger)">{formError}</p>}
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer">
              Registrar
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-(--text-secondary) hover:bg-(--bg-primary) transition-all cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-(--border) bg-(--bg-card)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-(--text-secondary) border-b border-(--border)">
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Cantidad</th>
              <th className="px-6 py-4">Notas</th>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movements.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-4 text-(--text-secondary)">Sin movimientos aún</td></tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="border-b border-(--border) hover:bg-(--bg-secondary) transition-all text-(--text-primary)">
                  <td className="px-6 py-4">{m.product?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.type === "IN" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {m.type === "IN" ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{m.quantity}</td>
                  <td className="px-6 py-4 text-(--text-secondary)">{m.notes || "-"}</td>
                  <td className="px-6 py-4 text-(--text-secondary)">{m.user?.name}</td>
                  <td className="px-6 py-4 text-(--text-secondary)">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}