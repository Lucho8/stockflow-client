"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getRole, removeToken } from "@/lib/auth";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Productos", href: "/dashboard/products", icon: "📦" },
  { label: "Categorías", href: "/dashboard/categories", icon: "🏷️" },
  { label: "Proveedores", href: "/dashboard/suppliers", icon: "🏭" },
  { label: "Movimientos", href: "/dashboard/movements", icon: "🔄" },
];

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    setRole(getRole());
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-(--border) bg-(--bg-secondary)">
      <div className="p-6 border-b border-(--border)">
        <h1 className="text-xl font-bold text-(--text-primary)">StockFlow</h1>
        <p className="text-xs mt-1 text-(--text-secondary) capitalize">
          {role}
        </p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-(--accent) text-white font-semibold"
                  : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-(--border)">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-lg text-sm text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--danger) transition-all cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
