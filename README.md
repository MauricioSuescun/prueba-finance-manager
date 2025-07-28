# Finance Manager

Sistema de gestión de ingresos y egresos con autenticación OAuth, roles de usuario y generación de reportes.

## 🎯 Características

- 🔐 **Autenticación**: GitHub OAuth con Better Auth
- 👥 **Sistema de roles**: Usuario/Administrador con RBAC
- 💰 **Gestión financiera**: Crear y administrar ingresos y egresos
- 📊 **Reportes visuales**: Gráficos interactivos con Chart.js
- 📥 **Exportación**: Descarga de datos en formato CSV
- 🗄️ **Base de datos real**: PostgreSQL con Prisma ORM
- 📱 **Responsive**: Interfaz moderna con Tailwind CSS + Shadcn/UI
- 🚀 **Deploy**: Optimizado para Vercel

## 🛠️ Tecnologías

- **Frontend**: Next.js 15+ (Pages Router), TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes con TypeScript
- **Base de datos**: PostgreSQL (Supabase)
- **Autenticación**: Better Auth con GitHub Provider
- **ORM**: Prisma v6+ con Prisma Client
- **Gráficos**: Chart.js + React Chart.js 2
- **Deploy**: Vercel

## 🚀 Configuración Local

### 1. Clona el repositorio

```bash
git clone https://github.com/MauricioSuescun/prueba-finance-manager.git
cd finance-manager
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Base de datos Supabase
DATABASE_URL="postgresql://[usuario]:[password]@[host]:[puerto]/[database]?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://[usuario]:[password]@[host]:[puerto]/[database]"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
AUTH_SECRET="tu_secreto_super_seguro_aqui_32_caracteres_minimo"

# GitHub OAuth
GITHUB_ID="tu_github_client_id"
GITHUB_SECRET="tu_github_client_secret"
```

### 4. Configura la base de datos

```bash
# Generar el cliente Prisma
npx prisma generate

# Crear las tablas en la base de datos
npx prisma db push
```

### 5. Configura GitHub OAuth

1. Ve a GitHub Settings → Developer settings → OAuth Apps
2. Crea una nueva aplicación OAuth:
   - **Application name**: Finance Manager
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copia el Client ID y Client Secret a tu `.env.local`

### 6. Ejecuta la aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy en Vercel

### 1. Configura las variables de entorno en Vercel

En el panel de Vercel (Settings → Environment Variables), añade:

```env
# Base de datos
DATABASE_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]

# Better Auth
BETTER_AUTH_URL=https://tu-app.vercel.app
AUTH_SECRET=tu_secreto_super_seguro_aqui_32_caracteres_minimo

# GitHub OAuth
GITHUB_ID=tu_github_client_id
GITHUB_SECRET=tu_github_client_secret
```

### 2. Actualiza la configuración de GitHub OAuth

En tu aplicación OAuth de GitHub, actualiza:
- **Homepage URL**: `https://tu-app.vercel.app`
- **Authorization callback URL**: `https://tu-app.vercel.app/api/auth/callback/github`

### 3. Deploy y migración inicial

```bash
# Deploy a Vercel
git add .
git commit -m "Deploy to production"
git push origin main
```


```
src/
├── components/          # Componentes reutilizables
│   ├── MovementForm.tsx # Formulario de movimientos
│   └── UserEditForm.tsx # Formulario de edición de usuarios
├── lib/                # Configuraciones y utilidades
│   ├── auth.ts         # Configuración Better Auth
│   ├── auth-client.ts  # Cliente Better Auth para frontend
│   ├── prisma.ts       # Cliente Prisma
│   ├── apiAuth.ts      # Middleware de autenticación para APIs
│   └── withAuth.tsx    # HOC para proteger rutas
├── pages/              # Páginas y API routes
│   ├── api/            # Endpoints de la API
│   │   ├── auth/       # Endpoints Better Auth
│   │   ├── movements.ts # CRUD movimientos
│   │   ├── users/      # CRUD usuarios
│   │   ├── reports.ts  # Generación de reportes
│   │   └── full-migration.ts # Migración de BD
│   ├── index.tsx       # Página de inicio con navegación
│   ├── movements.tsx   # Gestión de movimientos financieros
│   ├── users.tsx       # Administración de usuarios
│   └── reports.tsx     # Reportes y gráficos
├── styles/             # Estilos globales
└── prisma/             # Esquema de base de datos
    └── schema.prisma   # Definición de modelos
```

## 🔌 API Endpoints

### Autenticación (Better Auth)
- `POST /api/auth/sign-in/github` - Iniciar sesión con GitHub
- `POST /api/auth/sign-out` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Movimientos
- `GET /api/movements` - Listar movimientos
- `POST /api/movements` - Crear movimiento

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/[id]` - Obtener usuario específico
- `PUT /api/users/[id]` - Actualizar usuario
- `DELETE /api/users/[id]` - Eliminar usuario

### Reportes
- `GET /api/reports` - Generar reporte financiero con gráficos

### Utilidades
- `GET /api/health` - Health check de la aplicación
- `POST /api/full-migration` - Migración de base de datos (requiere auth)

## 🎮 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción (incluye prisma generate)
npm run start    # Servidor de producción
npm run lint     # ESLint + TypeScript check
npm test         # Ejecutar pruebas unitarias
```

## 👥 Roles y Permisos

### Usuario (USER)
- ✅ Ver sus propios movimientos
- ✅ Crear nuevos movimientos
- ✅ Ver reportes

### Administrador (ADMIN)
- ✅ **Acceso completo** a todas las funcionalidades
- ✅ Gestionar usuarios (editar roles, información)
- ✅ Ver todos los movimientos del sistema
- ✅ Generar reportes completos

> **Nota**: Los nuevos usuarios se registran automáticamente como **ADMIN** para facilitar las pruebas y configuración inicial.

## 🐛 Troubleshooting

### Error: "Better Auth Error: internal_server_error"

**Causa**: Tablas de base de datos faltantes.

**Solución**:
```bash
curl -X POST https://tu-app.vercel.app/api/full-migration \
  -H "Authorization: Bearer migrate-now"
```

### Error 404 en Vercel después del deploy

**Posibles causas**:
1. Variables de entorno mal configuradas
2. GitHub OAuth URLs incorrectas
3. Falta archivo `vercel.json`

**Soluciones**:
1. Verificar todas las variables de entorno en Vercel
2. Actualizar URLs en GitHub OAuth App
3. El proyecto incluye configuración optimizada para Vercel

### Error de conexión a base de datos

**Verificar**:
1. `DATABASE_URL` y `DIRECT_URL` correctas
2. Base de datos Supabase accesible
3. Migración ejecutada: `/api/full-migration`

### Login con GitHub no funciona

**Verificar**:
1. `GITHUB_ID` y `GITHUB_SECRET` correctos
2. URLs en GitHub OAuth App actualizadas
3. `BETTER_AUTH_URL` apuntando a la URL correcta

## 📊 Funcionalidades Destacadas

### 🏠 **Home Page**
- Navegación intuitiva a todas las secciones
- Información de sesión del usuario
- Login/logout con GitHub

### 💰 **Gestión de Movimientos**
- Crear ingresos y egresos
- Validación de formularios
- Lista de movimientos con información del usuario
- Interfaz responsive

### 👥 **Administración de Usuarios**
- Lista de usuarios registrados
- Edición de nombres y roles
- Información completa (email, fecha de registro)

### 📈 **Reportes Financieros**
- Gráficos de barras (ingresos vs egresos)
- Agrupación por meses
- Cálculo automático de saldo
- Exportación a CSV
- Visualización con Chart.js

## 🚀 Tecnologías Avanzadas Implementadas

- **Better Auth**: Sistema de autenticación moderno y seguro
- **Prisma ORM**: Gestión de base de datos con type-safety
- **TypeScript**: Desarrollo con tipado estático
- **Chart.js**: Visualización de datos interactiva
- **Tailwind CSS + Shadcn/UI**: Sistema de diseño moderno
- **Vercel**: Deploy optimizado con Edge Functions

## 📝 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---
