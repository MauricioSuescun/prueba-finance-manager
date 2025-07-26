# Guía de Despliegue en Vercel

## Variables de Entorno Requeridas

Asegúrate de configurar las siguientes variables de entorno en tu panel de Vercel:

### 1. Base de Datos
```
DATABASE_URL=tu_url_de_postgresql
DIRECT_URL=tu_url_directa_de_postgresql (para Supabase/PlanetScale)
```

### 2. NextAuth.js
```
NEXTAUTH_SECRET=tu_secreto_aleatorio_largo
NEXTAUTH_URL=https://tu-app.vercel.app
```

### 3. GitHub OAuth
```
GITHUB_ID=tu_github_client_id
GITHUB_SECRET=tu_github_client_secret
```

## Configuración de GitHub OAuth

1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Edita tu aplicación OAuth
3. Configura las URLs:
   - **Homepage URL**: `https://tu-app.vercel.app`
   - **Authorization callback URL**: `https://tu-app.vercel.app/api/auth/callback/github`

## Pasos para el Despliegue

### 1. Generar NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### 2. Verificar Variables en Vercel
Ve a tu proyecto en Vercel > Settings > Environment Variables y verifica que todas estén configuradas.

### 3. Verificar Estado de la Aplicación
Después del despliegue, visita:
- `https://tu-app.vercel.app/api/health` - Para verificar la configuración
- `https://tu-app.vercel.app/api/auth/session` - Para verificar NextAuth

### 4. Regenerar Deployment
Si cambias variables de entorno, necesitas hacer un nuevo deployment:
```bash
git commit --allow-empty -m "Trigger deployment"
git push
```

## Solución de Problemas Comunes

### Error 500 en /api/auth/session
- Verifica que `NEXTAUTH_SECRET` esté configurado
- Verifica que `DATABASE_URL` sea válida
- Verifica que la base de datos esté accesible desde Vercel

### Error de GitHub OAuth
- Verifica que `GITHUB_ID` y `GITHUB_SECRET` estén correctos
- Verifica que las URLs en GitHub OAuth coincidan exactamente
- Asegúrate de que `NEXTAUTH_URL` apunte a tu dominio de Vercel

### Problemas de Base de Datos
- Verifica que tu base de datos PostgreSQL permita conexiones externas
- Para Supabase, usa la cadena de conexión "postgres" no la "prisma"
- Asegúrate de tener las tablas de NextAuth creadas con Prisma

## Comandos Útiles

### Sincronizar Base de Datos
```bash
npx prisma db push
```

### Generar Cliente Prisma
```bash
npx prisma generate
```

### Ver Logs de Vercel
```bash
vercel logs tu-app
```