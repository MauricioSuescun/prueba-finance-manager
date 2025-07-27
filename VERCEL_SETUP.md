# Configuración de Vercel para Better Auth

## Variables de Entorno Requeridas

En tu panel de Vercel, configura las siguientes variables de entorno:

### 1. Base de Datos
```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database?sslmode=require
DIRECT_URL=postgresql://usuario:contraseña@host:puerto/database?sslmode=require
```

### 2. GitHub OAuth
```
GITHUB_ID=tu_github_client_id
GITHUB_SECRET=tu_github_client_secret
```

### 3. Better Auth (Opcional)
```
BETTER_AUTH_SECRET=un_secreto_aleatorio_muy_largo
```

## Configuración de GitHub OAuth

1. Ve a GitHub Settings > Developer settings > OAuth Apps
2. Edita tu aplicación OAuth existente
3. Actualiza las URLs:
   - **Homepage URL**: `https://prueba-finance-manager.vercel.app`
   - **Authorization callback URL**: `https://prueba-finance-manager.vercel.app/api/auth/callback/github`

## Verificación

Una vez configurado todo:

1. Despliega en Vercel
2. Visita: `https://prueba-finance-manager.vercel.app/api/health`
3. Deberías ver un JSON con el estado "ok"
4. Prueba el login con GitHub en la página principal

## Diferencias con NextAuth.js

- **Ruta de API**: `/api/auth/*` (en lugar de `/api/auth/[...nextauth]`)
- **No requiere NEXTAUTH_URL ni NEXTAUTH_SECRET**
- **Better Auth maneja automáticamente las rutas de callback**
- **Configuración más simple y mejor rendimiento**

## Troubleshooting

Si encuentras errores 500:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa que la URL de callback en GitHub sea correcta
3. Comprueba los logs de Vercel para más detalles
4. Visita `/api/health` para diagnóstico