# StockFlow Client

Frontend del sistema de gestión de inventario StockFlow, desarrollado con Next.js y TypeScript.

## Tecnologías

- Next.js 16
- TypeScript
- Tailwind CSS
- Axios
- JWT Decode

## Requisitos

- Node.js 18+
- pnpm

## Instalación

```bash
git clone https://github.com/tu-usuario/stockflow-client
cd stockflow-client
pnpm install
```

Creá el archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5050/api
```

Corré el proyecto:

```bash
pnpm dev
```

La app estará disponible en `http://localhost:3000`.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| NEXT_PUBLIC_API_URL | URL base de la API |

## Páginas

| Ruta | Descripción |
|------|-------------|
| /login | Inicio de sesión |
| /dashboard | Métricas generales |
| /dashboard/products | Gestión de productos |
| /dashboard/categories | Gestión de categorías |
| /dashboard/suppliers | Gestión de proveedores |
| /dashboard/movements | Historial de movimientos de stock |

## Funcionalidades

- Autenticación con JWT
- Rutas protegidas por rol (Admin / Employee)
- Dashboard con métricas en tiempo real
- CRUD completo de productos, categorías y proveedores
- Registro de movimientos de stock (entrada/salida)
- Alerta visual de productos con stock bajo
- Diseño dark mode

## Estructura del proyecto

```
stockflow-client/
├── app/
│   ├── dashboard/
│   │   ├── categories/
│   │   ├── movements/
│   │   ├── products/
│   │   ├── suppliers/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   └── page.tsx
├── components/
│   └── Sidebar.tsx
└── lib/
    ├── api.ts
    ├── auth.ts
    └── types.ts
```
