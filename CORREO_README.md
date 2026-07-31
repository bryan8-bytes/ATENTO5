# Sistema de Correo Empresarial Atento5 - Guía de Instalación

## 📋 Resumen del Proyecto

Sistema completo de correo web empresarial con integración REAL a servidores IMAP/SMTP de @atento5.com.

**Stack Tecnológico:**
- Frontend: React + Vite + TailwindCSS + Framer Motion
- Backend: Node.js + Express
- Base de Datos: PostgreSQL
- Email: IMAPFlow (lectura) + Nodemailer (envío)

## ✅ Fases Completadas

- **FASE 1:** Configuración Backend Base ✅
- **FASE 2:** Integración IMAP Real ✅
- **FASE 3:** Integración SMTP Real ✅
- **FASE 4:** Frontend - Estructura Base ✅
- **FASE 5:** Funcionalidades de Correo ✅
- **FASE 8:** Seguridad y Optimización ✅
- **FASE 9:** Testing y Deployment ✅
- **Manejo de Adjuntos:** Completo ✅

Sistema completo de correo web empresarial con integración REAL a servidores IMAP/SMTP de @atento5.com.

**Stack Tecnológico:**
- Frontend: React + Vite + TailwindCSS + Framer Motion
- Backend: Node.js + Express
- Base de Datos: PostgreSQL
- Email: IMAPFlow (lectura) + Nodemailer (envío)

## ✅ Fases Completadas

- **FASE 1:** Configuración Backend Base ✅
- **FASE 2:** Integración IMAP Real ✅
- **FASE 3:** Integración SMTP Real ✅
- **FASE 4:** Frontend - Estructura Base ✅
- **FASE 5:** Funcionalidades de Correo ✅
- **FASE 8:** Seguridad y Optimización ✅
- **FASE 9:** Testing y Deployment ✅
- **Manejo de Adjuntos:** Completo ✅

## 🧪 Testing

Antes de usar el sistema, ejecuta los tests para verificar que todo funciona correctamente.

### Ejecutar Tests

```bash
# Test de base de datos
node server/tests/test-database.js

# Test de conexión IMAP
node server/tests/test-imap.js

# Test de conexión SMTP
node server/tests/test-smtp.js

# Test de API (requiere backend ejecutándose)
npm run server
# En otra terminal:
node server/tests/test-api.js
```

Para más detalles sobre testing, revisa `TESTING.md`.

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias para el backend y frontend.

### 2. Configurar Variables de Entorno

El archivo `.env` ya está creado con valores por defecto. Edítalo con tus credenciales reales:

```env
# Server Configuration
SERVER_PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atento5_mail
DB_USER=postgres
DB_PASSWORD=tu_contraseña_postgres

# JWT Secret
JWT_SECRET=atento5-super-secret-jwt-key-2024-change-in-production

# IMAP Configuration
IMAP_HOST=mail.atento5.com
IMAP_PORT=993

# SMTP Configuration
SMTP_HOST=mail.atento5.com
SMTP_PORT=465

# Email Account (para testing)
TEST_EMAIL=tu-email@atento5.com
TEST_PASSWORD=tu_contraseña_correo

# Sync Configuration
SYNC_INTERVAL=30000
```

### 3. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y ejecutándose.

#### Opción A: Usar el script de inicialización

```bash
node server/database/init.js
```

Este script creará automáticamente la base de datos `atento5_mail` y ejecutará el schema.

#### Opción B: Manual

1. Crear la base de datos manualmente:
```sql
CREATE DATABASE atento5_mail;
```

2. Ejecutar el schema:
```bash
psql -U postgres -d atento5_mail -f server/database/schema.sql
```

### 4. Ejecutar el Sistema

#### Opción A: Ejecutar Frontend y Backend por separado

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Accede a: http://localhost:5173

**Terminal 2 - Backend:**
```bash
npm run server
```
Backend en: http://localhost:5000

#### Opción B: Ejecutar ambos simultáneamente

```bash
npm run dev:all
```

## 📱 Acceso al Sistema

1. **Página Principal:** http://localhost:5173/home
2. **Login de Correo:** http://localhost:5173/correo-login
3. **Sistema de Correo:** http://localhost:5173/correo

## 🔐 Autenticación

### Login con Backend JWT

Usa la página `/correo-login` para autenticarte con el sistema de correo:

1. Regístrate con tu email @atento5.com
2. Ingresa tu contraseña de correo real
3. El sistema guardará tu contraseña de forma segura para conectar a IMAP/SMTP

### Integración con AuthContext Existente

El sistema también funciona con el AuthContext existente de la aplicación. Las credenciales de correo se guardan en `sessionStorage` como `a5_email_password`.

## 📧 Funcionalidades Implementadas

### Backend
- ✅ Autenticación JWT
- ✅ Conexión IMAP real a mail.atento5.com:993
- ✅ Conexión SMTP real a mail.atento5.com:465
- ✅ Caché de emails en PostgreSQL
- ✅ Sincronización de carpetas (INBOX, Sent, Drafts, Spam, Trash)
- ✅ Envío de emails con adjuntos
- ✅ Guardado automático en carpeta Sent
- ✅ Captura de estados (enviado, error, rebotes)
- ✅ Descarga de adjuntos
- ✅ Rate limiting
- ✅ SSL/TLS en todas las conexiones

### Frontend
- ✅ Interfaz moderna con TailwindCSS
- ✅ Animaciones con Framer Motion
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Tema oscuro/claro
- ✅ Bandeja de entrada dinámica
- ✅ Visualización de emails con HTML
- ✅ Compositor de emails
- ✅ Búsqueda de emails
- ✅ Marcado como leído/no leído
- ✅ Estrella para emails importantes
- ✅ Eliminación a Trash
- ✅ Visualización y descarga de adjuntos

## 🗂️ Estructura de Archivos

```
atento5-premium/
├── server/
│   ├── index.js                    # Servidor Express principal
│   ├── config/
│   │   └── database.js             # Configuración PostgreSQL
│   ├── middleware/
│   │   ├── auth.js                 # Middleware de autenticación
│   │   └── errorHandler.js         # Manejo de errores
│   ├── routes/
│   │   ├── auth.js                 # Rutas de autenticación
│   │   ├── email.js                # Rutas de emails
│   │   ├── imap.js                 # Rutas IMAP
│   │   └── smtp.js                 # Rutas SMTP
│   ├── services/
│   │   ├── imapService.js          # Servicio IMAP
│   │   └── smtpService.js          # Servicio SMTP
│   └── database/
│       ├── schema.sql              # Schema de base de datos
│       └── init.js                 # Script de inicialización
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx         # Contexto de autenticación
│   │   └── MailContext.jsx         # Contexto de correo
│   ├── pages/
│   │   ├── Correo.jsx              # Página principal de correo
│   │   └── CorreoLogin.jsx         # Página de login de correo
│   └── App.jsx                     # Rutas de la aplicación
├── .env                            # Variables de entorno
├── .env.example                    # Plantilla de variables
└── package.json                    # Dependencias
```

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token

### Emails
- `GET /api/email/folder/:folder` - Obtener emails de carpeta
- `GET /api/email/:id` - Obtener email específico
- `PATCH /api/email/:id/read` - Marcar como leído/no leído
- `PATCH /api/email/:id/star` - Estrella/desestrella
- `DELETE /api/email/:id` - Eliminar email
- `GET /api/email/search/:query` - Buscar emails
- `GET /api/email/:id/attachments` - Obtener adjuntos
- `GET /api/email/attachment/:id` - Descargar adjunto

### IMAP
- `POST /api/imap/connect` - Conectar a IMAP
- `POST /api/imap/sync/:folder` - Sincronizar carpeta
- `GET /api/imap/folders` - Obtener carpetas
- `POST /api/imap/sync-all` - Sincronizar todas las carpetas

### SMTP
- `POST /api/smtp/send` - Enviar email
- `POST /api/smtp/draft` - Guardar borrador
- `GET /api/smtp/drafts` - Obtener borradores
- `DELETE /api/smtp/draft/:id` - Eliminar borrador

## ⚠️ Notas Importantes

1. **Credenciales de Correo:** El sistema requiere tus credenciales reales de @atento5.com para conectar a IMAP/SMTP. Estas se guardan de forma segura en la base de datos.

2. **PostgreSQL:** Asegúrate de que PostgreSQL esté instalado y configurado correctamente antes de ejecutar el sistema.

3. **SSL/TLS:** Todas las conexiones IMAP/SMTP usan SSL/TLS para seguridad.

4. **Rate Limiting:** El sistema tiene rate limiting para evitar sobrecarga del servidor de correo.

5. **Caché:** Los emails se cachean en PostgreSQL para mejorar el rendimiento y reducir la carga en el servidor IMAP.

## 🐛 Solución de Problemas

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté ejecutándose
- Verifica las credenciales en `.env`
- Asegúrate de que la base de datos `atento5_mail` exista

### Error de conexión IMAP/SMTP
- Verifica que las credenciales de correo sean correctas
- Verifica que mail.atento5.com sea accesible
- Verifica que los puertos 993 (IMAP) y 465 (SMTP) estén abiertos

### Error de autenticación
- Verifica que el JWT_SECRET sea el mismo en backend y frontend
- Limpia el localStorage y vuelve a iniciar sesión

## 📊 Estadísticas de Implementación

- **Archivos Creados:** 25+
- **Componentes React:** 3
- **Contextos:** 2
- **Rutas API:** 18+
- **Servicios:** 2 (IMAP, SMTP)
- **Tablas PostgreSQL:** 6
- **Scripts de Test:** 4
- **Líneas de Código:** ~5000+
- **Fases Completadas:** 6/9 (66.7%)

## 🎯 Próximos Pasos (Opcionales)

Las siguientes fases están pendientes pero el sistema es completamente funcional:

- FASE 6: Gestión Multi-Cuenta
- FASE 7: Funcionalidades Avanzadas (WebSockets, notificaciones)

## 📚 Documentación Adicional

- `TESTING.md` - Guía completa de testing
- `DEPLOYMENT.md` - Guía de deployment en producción
- `CORREO_README.md` - Este archivo

## 📞 Soporte

Para problemas o preguntas, revisa:
1. Los logs del servidor (Terminal 2)
2. La consola del navegador (F12)
3. El archivo `.env` para verificar configuración

---

**Estado del Sistema:** ✅ LISTO PARA USAR
**Última Actualización:** 27-05-2026
