"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Category } from "@/lib/types";
import { getRole, getUser } from "@/lib/auth";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => {
     const user = getUser();
    console.log("user payload:", user);
    setRole(getRole());
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (editing) {
      await api.put(`/categories/${editing.id}`, { name, description });
    } else {
      await api.post("/categories", { name, description });
    }
    setShowForm(false);
    setEditing(null);
    setName("");
    setDescription("");
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  if (loading) return <p className="text-(--text-secondary)">Cargando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--text-primary)">Categorías</h2>
        {role === "Admin" && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              setName("");
              setDescription("");
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
          >
            + Nueva categoría
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card) flex flex-col gap-4">
          <h3 className="font-semibold text-(--text-primary)">
            {editing ? "Editar categoría" : "Nueva categoría"}
          </h3>
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
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
              <th className="px-6 py-4">Descripción</th>
              {role === "Admin" && <th className="px-6 py-4">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-(--text-secondary)">
                  Sin categorías aún
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-(--border) hover:bg-(--bg-secondary) transition-all text-(--text-primary)"
                >
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4 text-(--text-secondary)">
                    {cat.description}
                  </td>
                  {role === "Admin" && (
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-1 rounded-lg text-xs bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
