# 🍰 Pastelería Dulzura — Plataforma Web & Panel Admin

Aplicación web moderna y panel de administración artesanal para **Pastelería Dulzura** (Tortas, Postres, Bocaditos por mayor y Panes artesanal).

## 🚀 Arquitectura

El proyecto se divide en dos módulos independientes:

- `backend/`: API REST desarrollada con **Node.js, Express, Prisma ORM** (soporta PostgreSQL, MySQL y SQLite) y autenticación JWT + Multer para carga física de imágenes.
- `frontend/`: Aplicación SPA responsive en **React + Vite + TailwindCSS + React Query + React Router**.

---

## 🛠️ Cómo Ejecutar en Desarrollo Local

### 1. Iniciar el Backend (Puerto 5000)
```bash
cd backend
npm run dev
```
*El backend generará automáticamente la base de datos `dev.db` y servirá las imágenes físicas desde `backend/uploads/`.*

### 2. Iniciar el Frontend (Puerto 3000)
```bash
cd frontend
npm run dev
```

Navega a:
- **Sitio Público:** [http://localhost:3000](http://localhost:3000)
- **Panel Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔐 Credenciales del Panel Administrador

- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 📲 Flujo de Pedidos & Preparación para Pasarela (Izipay)

- **Actualidad:** Al seleccionar un producto en el sitio público, el cliente es redirigido a WhatsApp con un mensaje prellenado configurable desde la tabla `Contacto`.
- **Fase Futura:** La lógica de pedido está aislada en `backend/src/modules/pagos/paymentProvider.js` y `frontend/src/services/pedido.js`. Para activar pagos en línea (Izipay u otra pasarela), solo se requiere cambiar `MODO_PAGO="izipay"` en las variables de entorno sin modificar los componentes visuales.
