"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product, Category, Supplier } from "@/lib/types";
import { getRole } from "@/lib/auth";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    minStock: "",
    categoryId: "",
    supplierId: "",
  });

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/suppliers"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setSuppliers(suppliersRes.data);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRole(getRole());
    fetchData();
  }, []);

  const resetForm = () =>
    setForm({
      name: "",
      sku: "",
      description: "",
      price: "",
      stock: "",
      minStock: "",
      categoryId: "",
      supplierId: "",
    });

  const handleSubmit = async () => {
    setFormError("");

    if (!form.name || !form.sku || !form.description) {
      setFormError("Nombre, SKU y descripción son requeridos.");
      return;
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      setFormError("Precio inválido.");
      return;
    }
    if (!form.stock || isNaN(parseInt(form.stock))) {
      setFormError("Stock inválido.");
      return;
    }
    if (!form.minStock || isNaN(parseInt(form.minStock))) {
      setFormError("Stock mínimo inválido.");
      return;
    }
    if (!form.categoryId) {
      setFormError("Seleccioná una categoría.");
      return;
    }
    if (!form.supplierId) {
      setFormError("Seleccioná un proveedor.");
      return;
    }

    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      minStock: parseInt(form.minStock),
      categoryId: parseInt(form.categoryId),
      supplierId: parseInt(form.supplierId),
    };

    console.log("Enviando payload:", payload);

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
      fetchData();
    } catch (e) {
      console.error("Error al guardar producto:", e);
      setFormError("Error al guardar. Revisá la consola.");
    }
  };

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      sku: p.sku,
      description: p.description,
      price: p.price.toString(),
      stock: p.stock.toString(),
      minStock: p.minStock.toString(),
      categoryId: p.categoryId.toString(),
      supplierId: p.supplierId.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/products/${id}`);
    fetchData();
  };

  if (loading) return <p className="text-(--text-secondary)">Cargando...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-(--text-primary)">Productos</h2>
        {role === "Admin" && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditing(null);
              resetForm();
              setFormError("");
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {showForm && (
        <div className="p-6 rounded-2xl border border-(--border) bg-(--bg-card) grid grid-cols-2 gap-4">
          <h3 className="col-span-2 font-semibold text-(--text-primary)">
            {editing ? "Editar producto" : "Nuevo producto"}
          </h3>

          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="SKU (ej: PAP-001)"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="Precio"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="Stock mínimo"
            type="number"
            min="0"
            value={form.minStock}
            onChange={(e) => setForm({ ...form, minStock: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <input
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          >
            <option value="">Categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
            className="px-4 py-2 rounded-lg border border-(--border) bg-(--bg-secondary) text-(--text-primary) outline-none"
          >
            <option value="">Proveedor</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {formError && (
            <p className="col-span-2 text-sm text-(--danger)">{formError}</p>
          )}

          <div className="col-span-2 flex gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
            >
              {editing ? "Guardar" : "Crear"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setFormError("");
              }}
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
              <th className="px-6 py-4">SKU</th>
              <th className="px-6 py-4">Precio</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Proveedor</th>
              {role === "Admin" && <th className="px-6 py-4">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-(--text-secondary)">
                  Sin productos aún
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-(--border) hover:bg-(--bg-secondary) transition-all text-(--text-primary)"
                >
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4 text-(--text-secondary)">{p.sku}</td>
                  <td className="px-6 py-4">${p.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${p.stock <= p.minStock ? "text-(--warning)" : "text-(--success)"}`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-(--text-secondary)">
                    {p.category?.name}
                  </td>
                  <td className="px-6 py-4 text-(--text-secondary)">
                    {p.supplier?.name}
                  </td>
                  {role === "Admin" && (
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 rounded-lg text-xs bg-(--accent) text-white hover:opacity-90 transition-all cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
