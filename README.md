# Finance Manager

Sistema de gestión de ingresos y egresos con autenticación OAuth, roles de usuario y generación de reportes.

## Características

- 🔐 Autenticación con GitHub OAuth
- 👥 Sistema de roles (Usuario/Administrador)
- 💰 Gestión de ingresos y egresos
- 📊 Reportes financieros con gráficos
- 📥 Exportación de datos a CSV
- 🛡️ Control de acceso basado en roles (RBAC)
- 📚 Documentación API con Swagger

## Tecnologías

- **Frontend**: Next.js (Pages Router), TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL (Supabase)
- **Autenticación**: NextAuth.js con GitHub Provider
- **ORM**: Prisma
- **Deploy**: Vercel

## Configuración Local

### 1. Clona el repositorio

```bash
git clone <tu-repositorio>
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

# NextAuth
NEXTAUTH_SECRET="tu_secreto_super_seguro_aqui"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="tu_github_client_id"
GITHUB_SECRET="tu_github_client_secret"
```

### 4. Configura la base de datos

```bash
# Generar el cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Poblar la base de datos
npx prisma db seed
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

## Deploy en Vercel

### 1. Configura las variables de entorno en Vercel

En el panel de Vercel (Settings → Environment Variables), añade:

```env
# Base de datos
DATABASE_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://[usuario]:[password]@[host]:[puerto]/[database]

# NextAuth
NEXTAUTH_SECRET=tu_secreto_super_seguro_aqui
NEXTAUTH_URL=https://tu-app.vercel.app

# GitHub OAuth
GITHUB_ID=tu_github_client_id
GITHUB_SECRET=tu_github_client_secret
```

### 2. Actualiza la configuración de GitHub OAuth

En tu aplicación OAuth de GitHub, actualiza:
- **Homepage URL**: `https://tu-app.vercel.app`
- **Authorization callback URL**: `https://tu-app.vercel.app/api/auth/callback/github`

### 3. Deploy

```bash
# Conecta con Vercel CLI (opcional)
npm i -g vercel
vercel

# O simplemente haz push a tu repositorio conectado con Vercel
git add .
git commit -m "Deploy configuration"
git push origin main
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── lib/                # Utilidades y configuraciones
├── pages/              # Páginas y API routes
│   ├── api/            # Endpoints de la API
│   ├── auth/           # Páginas de autenticación
│   ├── index.tsx       # Página de inicio
│   ├── movements.tsx   # Gestión de movimientos
│   ├── users.tsx       # Gestión de usuarios
│   └── reports.tsx     # Reportes financieros
├── styles/             # Estilos globales
└── types/              # Definiciones de TypeScript
```

## API Endpoints

- `GET /api/docs` - Documentación Swagger
- `GET/POST /api/movements` - Gestión de movimientos
- `GET/PUT /api/users` - Gestión de usuarios
- `GET /api/reports` - Generación de reportes

## Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
npm test         # Ejecutar pruebas
```

## Roles y Permisos

- **Usuario**: Acceso a gestión de movimientos
- **Administrador**: Acceso completo a todas las funcionalidades

*Nota: Todos los nuevos usuarios se registran automáticamente como ADMIN para facilitar las pruebas.*

## Troubleshooting

### Error 404 en Vercel

1. Verifica que las variables de entorno estén configuradas correctamente
2. Asegúrate de que GitHub OAuth tenga las URLs correctas
3. Revisa los logs de build en Vercel
4. Confirma que `npm run start` funcione localmente después de `npm run build`

### Error de Base de Datos

1. Verifica las URLs de conexión a Supabase
2. Asegúrate de que las migraciones se ejecutaron correctamente
3. Revisa que la base de datos sea accesible desde Vercel

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request
