"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product, StockMovement } from "@/lib/types";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, movementsRes] = await Promise.all([
        api.get("/products"),
        api.get("/stockmovements"),
      ]);
      setProducts(productsRes.data);
      setMovements(movementsRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const lowStock = products.filter((p) => p.stock <= p.minStock);
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

  if (loading) return <p className="text-(--text-secondary)">Cargando...</p>;

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-(--text-primary)">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card)">
          <p className="text-sm text-(--text-secondary)">Total productos</p>
          <p className="text-3xl font-bold mt-1 text-(--text-primary)">
            {products.length}
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card)">
          <p className="text-sm text-(--text-secondary)">Stock bajo</p>
          <p className="text-3xl font-bold mt-1 text-(--warning)">
            {lowStock.length}
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card)">
          <p className="text-sm text-(--text-secondary)">Valor total</p>
          <p className="text-3xl font-bold mt-1 text-(--accent)">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-(--border) bg-(--bg-card) p-6">
        <h3 className="text-lg font-semibold mb-4 text-(--text-primary)">
          Movimientos recientes
        </h3>
        {movements.length === 0 ? (
          <p className="text-sm text-(--text-secondary)">Sin movimientos aún</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-(--text-secondary) border-b border-(--border)">
                <th className="pb-3">Producto</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Cantidad</th>
                <th className="pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="text-(--text-primary)">
              {movements.slice(0, 8).map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-(--border) hover:bg-(--bg-secondary) transition-all"
                >
                  <td className="py-3">{m.product.name}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${m.type === "IN" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {m.type === "IN" ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td className="py-3">{m.quantity}</td>
                  <td className="py-3 text-(--text-secondary)">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
