"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Supplier } from "@/lib/types";
import { getRole } from "@/lib/auth";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    setRole(getRole());
    fetchSuppliers();
  }, []);

  const handleSubmit = async () => {
    if (editing) {
      await api.put(`/suppliers/${editing.id}`, form);
    } else {
      await api.post("/suppliers", form);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", email: "", phone: "", address: "" });
    fetchSuppliers();
  };

  const handleEdit = (s: Supplier) => {
    setEditing(s);
    setForm({
      name: s.name,
      email: s.email,
      phone: s.phone,
      address: s.address,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/suppliers/${id}`);
    fetchSuppliers();
  };

  if (loading) return <p className="text-(--text-secondary)">Cargando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--text-primary)">
          Proveedores
        </h2>
        {role === "Admin" && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setForm({ name: "", email: "", phone: "", address: "" });
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
          >
            + Nuevo proveedor
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card) flex flex-col gap-4">
          <h3 className="font-semibold text-(--text-primary)">
            {editing ? "Editar proveedor" : "Nuevo proveedor"}
          </h3>
          {["name", "email", "phone", "address"].map((field) => (
            <input
              key={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
            />
          ))}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
            >
              {editing ? "Guardar" : "Crear"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-(--text-secondary) hover:bg-(--bg-primary) transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-(--border) bg-(--bg-card)">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-(--text-secondary) border-b border-(--border)">
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Dirección</th>
              {role === "Admin" && <th className="px-6 py-4">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-(--text-secondary)">
                  Sin proveedores aún
                </td>
              </tr>
            ) : (
              suppliers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-(--border) hover:bg-(--bg-secondary) transition-all text-(--text-primary)"
                >
                  <td className="px-6 py-4">{s.name}</td>
                  <td className="px-6 py-4 text-(--text-secondary)">
                    {s.email}
                  </td>
                  <td className="px-6 py-4 text-(--text-secondary)">
                    {s.phone}
                  </td>
                  <td className="px-6 py-4 text-(--text-secondary)">
                    {s.address}
                  </td>
                  {role === "Admin" && (
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1 rounded-lg text-xs bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
