# Atento5 Enterprise Email System

Sistema de correo empresarial dinámico con autenticación JWT, IMAP/SMTP real para @atento5.com, y bandejas separadas por usuario.

## Características

- ✅ **Login empresarial dinámico** - Cada usuario tiene sus propias credenciales
- ✅ **Roles de usuario** - Sistema de roles (admin, user) para permisos
- ✅ **Inbox real IMAP** - Conexión segura SSL/TLS al servidor de correo
- ✅ **Envío SMTP real** - Envío de correos con autenticación de usuario
- ✅ **CC y CCO** - Soporte completo para copia y copia oculta
- ✅ **Adjuntos** - Subida y descarga de archivos en correos
- ✅ **Bandejas separadas por usuario** - Cada usuario ve solo sus correos
- ✅ **Seguridad SSL/TLS** - Conexiones cifradas para IMAP y SMTP
- ✅ **Dashboard privado** - Interfaz moderna estilo Outlook
- ✅ **Webmail moderno** - UI responsiva con React + TailwindCSS

## Arquitectura

### Backend (Node.js + Express)
- **Autenticación JWT** - Tokens seguros para sesiones de usuario
- **PostgreSQL** - Base de datos para usuarios, correos y adjuntos
- **IMAPFlow** - Cliente IMAP moderno para lectura de correos
- **Nodemailer** - Cliente SMTP para envío de correos
- **SSL/TLS** - Conexiones cifradas al servidor de correo

### Frontend (React + Vite)
- **React** - Framework UI con hooks y contextos
- **TailwindCSS** - Estilos modernos y responsivos
- **Framer Motion** - Animaciones suaves
- **Lucide Icons** - Iconos modernos

## Configuración

### 1. Variables de Entorno

Configura el archivo `.env`:

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
DB_PASSWORD=postgres

# JWT Secret
JWT_SECRET=atento5-super-secret-jwt-key-2024-change-in-production

# IMAP Configuration
IMAP_HOST=mail.atento5.com
IMAP_PORT=993

# SMTP Configuration
SMTP_HOST=mail.atento5.com
SMTP_PORT=465

# Sync Configuration
SYNC_INTERVAL=30000
```

### 2. Base de Datos

Inicializa la base de datos PostgreSQL:

```bash
# Crear la base de datos
createdb atento5_mail

# Ejecutar el schema
psql -d atento5_mail -f server/database/schema.sql
```

### 3. Migraciones

Si ya tienes una base de datos existente, ejecuta la migración para agregar el campo de roles:

```bash
psql -d atento5_mail -f server/database/migrations/add_role_field.sql
```

### 4. Sembrar Usuarios (Opcional)

Para poblar la base de datos con los usuarios autorizados de Atento5:

```bash
node server/database/seed_users.js
```

Esto creará los siguientes usuarios:
- Juan.ampuero@atento5.com (admin)
- Corina.anorga@atento5.com (user)
- Proyectos@atento5.com (user)
- Ventas@atento5.com (user)
- Operaciones@atento5.com (user)

## Instalación y Ejecución

### Backend

```bash
cd server
npm install
npm start
```

El servidor backend correrá en `http://localhost:5000`

### Frontend

```bash
npm install
npm run dev
```

La aplicación frontend correrá en `http://localhost:5173`

## Uso

### Registro de Nuevo Usuario

1. Ve a `/correo-login`
2. Haz clic en "Registrarse"
3. Completa los campos:
   - **Correo Electrónico**: tu-email@atento5.com
   - **Contraseña del Sistema**: Contraseña para acceder al sistema web
   - **Contraseña de Correo IMAP/SMTP**: Contraseña real de tu correo @atento5.com
   - **Nombre Completo**: Tu nombre (opcional en registro)
4. Haz clic en "Registrarse"

### Iniciar Sesión

1. Ve a `/correo-login`
2. Ingresa tu correo y contraseña del sistema
3. Ingresa tu contraseña de correo IMAP/SMTP
4. Haz clic en "Iniciar Sesión"

### Enviar Correo

1. Haz clic en "Nuevo Correo"
2. Completa los campos:
   - **Para**: destinatario@ejemplo.com
   - **CC**: copia@ejemplo.com (opcional)
   - **CCO**: copia-oculta@ejemplo.com (opcional)
   - **Asunto**: Asunto del correo
   - **Mensaje**: Cuerpo del correo
   - **Adjuntos**: Selecciona archivos (opcional)
3. Haz clic en "Enviar"

### Sincronizar Bandeja

1. Selecciona una carpeta (INBOX, Sent, etc.)
2. Haz clic en el botón de actualizar (↻)
3. El sistema sincronizará con el servidor IMAP

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token JWT
- `POST /api/auth/update-imap` - Actualizar contraseña IMAP

### Correos

- `GET /api/email/folder/:folder` - Obtener correos de una carpeta
- `GET /api/email/:id` - Obtener un correo específico
- `PATCH /api/email/:id/read` - Marcar como leído/no leído
- `PATCH /api/email/:id/star` - Marcar como importante
- `DELETE /api/email/:id` - Eliminar correo (mover a papelera)
- `GET /api/email/search/:query` - Buscar correos
- `GET /api/email/:id/attachments` - Obtener adjuntos
- `GET /api/email/attachment/:id` - Descargar adjunto

### IMAP

- `POST /api/imap/connect` - Conectar al servidor IMAP
- `POST /api/imap/sync/:folder` - Sincronizar carpeta
- `GET /api/imap/folders` - Obtener lista de carpetas
- `POST /api/imap/sync-all` - Sincronizar todas las carpetas

### SMTP

- `POST /api/smtp/send` - Enviar correo
- `POST /api/smtp/draft` - Guardar borrador
- `GET /api/smtp/drafts` - Obtener borradores
- `DELETE /api/smtp/draft/:id` - Eliminar borrador

## Seguridad

- **Contraseñas hasheadas** - Las contraseñas del sistema se almacenan con bcrypt
- **JWT Tokens** - Tokens JWT con expiración de 7 días
- **SSL/TLS** - Conexiones cifradas para IMAP (port 993) y SMTP (port 465)
- **Validación de usuario** - Cada usuario solo accede a sus propios correos
- **Rate limiting** - Límite de 100 solicitudes por 15 minutos por IP

## Estructura del Proyecto

```
atento5-premium/
├── server/
│   ├── config/
│   │   └── database.js          # Configuración de PostgreSQL
│   ├── database/
│   │   ├── schema.sql           # Schema de la base de datos
│   │   ├── migrations/          # Migraciones
│   │   ├── seed_users.js        # Script para sembrar usuarios
│   │   └── init.js              # Inicialización
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación JWT
│   │   └── errorHandler.js      # Manejo de errores
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   ├── email.js             # Rutas de correos
│   │   ├── imap.js              # Rutas de IMAP
│   │   └── smtp.js              # Rutas de SMTP
│   ├── services/
│   │   ├── imapService.js       # Servicio IMAP
│   │   └── smtpService.js       # Servicio SMTP
│   └── index.js                 # Punto de entrada del servidor
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx      # Contexto de autenticación
│   │   └── MailContext.jsx      # Contexto de correo
│   ├── pages/
│   │   ├── Correo.jsx           # Página principal de correo
│   │   └── CorreoLogin.jsx      # Página de login
│   └── App.jsx                 # Aplicación principal
└── package.json
```

## Troubleshooting

### Error de conexión IMAP

Verifica que:
- El servidor IMAP sea accesible desde tu red
- Las credenciales IMAP sean correctas
- El puerto 993 esté abierto en el firewall

### Error de conexión SMTP

Verifica que:
- El servidor SMTP sea accesible desde tu red
- Las credenciales SMTP sean correctas
- El puerto 465 esté abierto en el firewall

### Error de base de datos

Verifica que:
- PostgreSQL esté corriendo
- La base de datos `atento5_mail` exista
- Las credenciales en `.env` sean correctas

## Licencia

Propiedad de Atento5 - Sistema de correo empresarial

