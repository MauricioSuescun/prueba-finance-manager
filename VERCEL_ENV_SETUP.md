# 🚀 Configuración de Variables de Entorno en Vercel para Better Auth

## Variables Requeridas

### 1. Base de Datos PostgreSQL
```
DATABASE_URL=postgresql://usuario:password@host:puerto/basedatos
DIRECT_URL=postgresql://usuario:password@host:puerto/basedatos
```

### 2. GitHub OAuth App
```
GITHUB_ID=tu_github_client_id
GITHUB_SECRET=tu_github_client_secret
```

## ⚙️ Configuración en GitHub

1. Ve a **GitHub Settings** → **Developer settings** → **OAuth Apps**
2. Edita tu aplicación OAuth existente o crea una nueva
3. Configura las URLs:
   - **Homepage URL**: `https://prueba-finance-manager.vercel.app`
   - **Authorization callback URL**: `https://prueba-finance-manager.vercel.app/api/auth/callback/github`

## 🔧 Configuración en Vercel

1. Ve a tu proyecto en **Vercel Dashboard**
2. Ve a **Settings** → **Environment Variables**
3. Agrega cada variable:
   - Nombre: `DATABASE_URL`
   - Valor: Tu URL de PostgreSQL
   - Entornos: Production, Preview, Development

4. Repite para todas las variables listadas arriba

## ✅ Verificación

Después del despliegue, puedes verificar que todo funciona visitando:
- `https://prueba-finance-manager.vercel.app/api/health` - Debe mostrar status: "ok"
- `https://prueba-finance-manager.vercel.app/api/auth/session` - Debe responder con JSON

## 🔄 Diferencias con NextAuth

Better Auth utiliza rutas diferentes:
- ✅ Autenticación: `/api/auth/sign-in/github`
- ✅ Sesión: `/api/auth/session`
- ✅ Cerrar sesión: `/api/auth/sign-out`

## 🎯 Beneficios de Better Auth

- ⚡ Mejor rendimiento
- 🔧 Más fácil de configurar
- 🛡️ Mejor seguridad por defecto
- 📱 Mejor soporte para TypeScript
- 🚀 Optimizado para Vercel