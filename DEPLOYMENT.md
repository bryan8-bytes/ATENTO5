# Guía de Deployment - Sistema de Correo Atento5

## 📋 Requisitos Previos

### Servidor (cPanel/Shared Hosting)
- Node.js 18+ o 20+
- PostgreSQL 14+ o acceso a base de datos remota
- Acceso SSH o cPanel File Manager
- PM2 (para Node.js process management)
- Nginx o Apache (para reverse proxy)
- SSL/TLS certificate (Let's Encrypt o comercial)

### Base de Datos
- PostgreSQL 14+ con acceso remoto o en el mismo servidor
- Credenciales de base de datos (usuario, contraseña, nombre de BD)
- Permisos para crear tablas e índices

### Dominio
- Dominio configurado (ej: correo.atento5.com)
- DNS apuntando al servidor
- SSL/TLS configurado

## 🚀 Pasos de Deployment

### 1. Preparación del Servidor

#### 1.1 Instalar Node.js y PM2

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version

# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar PM2
pm2 --version
```

#### 1.2 Configurar PostgreSQL

```bash
# Instalar PostgreSQL (si no está instalado)
sudo apt install -y postgresql postgresql-contrib

# Iniciar PostgreSQL
sudo service postgresql start

# Crear usuario y base de datos
sudo -u postgres psql

# En psql:
CREATE USER atento5_mail WITH PASSWORD 'tu_contraseña_segura';
CREATE DATABASE atento5_mail OWNER atento5_mail;
GRANT ALL PRIVILEGES ON DATABASE atento5_mail TO atento5_mail;
\q

# Configurar acceso remoto (opcional)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Agregar: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Agregar: host all all 0.0.0.0/0 md5

# Reiniciar PostgreSQL
sudo service postgresql restart
```

### 2. Desplegar la Aplicación

#### 2.1 Subir Archivos

```bash
# Clonar o subir archivos al servidor
cd /var/www
git clone https://github.com/tu-repo/atento5-premium.git
cd atento5-premium

# O usar SCP/FTP para subir archivos
```

#### 2.2 Instalar Dependencias

```bash
cd /var/www/atento5-premium
npm install --production
```

#### 2.3 Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con valores de producción
nano .env
```

**Configuración .env de Producción:**

```env
# Server Configuration
SERVER_PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://correo.atento5.com

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=atento5_mail
DB_USER=atento5_mail
DB_PASSWORD=tu_contraseña_segura_postgres

# JWT Secret (generar uno nuevo)
JWT_SECRET=generar-nuevo-secret-aleatorio-muy-largo-y-seguro

# IMAP Configuration
IMAP_HOST=mail.atento5.com
IMAP_PORT=993

# SMTP Configuration
SMTP_HOST=mail.atento5.com
SMTP_PORT=465

# Sync Configuration
SYNC_INTERVAL=60000
```

#### 2.4 Inicializar Base de Datos

```bash
# Ejecutar script de inicialización
node server/database/init.js
```

### 3. Configurar PM2

#### 3.1 Crear Ecosystem File

```bash
nano ecosystem.config.js
```

**Contenido de ecosystem.config.js:**

```javascript
module.exports = {
  apps: [
    {
      name: 'atento5-backend',
      script: './server/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'atento5-frontend',
      script: './node_modules/.bin/vite',
      args: 'preview --host 0.0.0.0 --port 5173',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

#### 3.2 Iniciar Aplicación con PM2

```bash
# Crear directorio de logs
mkdir -p logs

# Iniciar aplicaciones
pm2 start ecosystem.config.js

# Guardar configuración PM2
pm2 save

# Configurar PM2 para iniciar al boot
pm2 startup
```

#### 3.3 Comandos PM2 Útiles

```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs

# Reiniciar aplicación
pm2 restart atento5-backend

# Detener aplicación
pm2 stop atento5-backend

# Eliminar aplicación
pm2 delete atento5-backend

# Monitorear
pm2 monit
```

### 4. Configurar Nginx Reverse Proxy

#### 4.1 Instalar Nginx

```bash
sudo apt install -y nginx
sudo service nginx start
```

#### 4.2 Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/atento5-correo
```

**Configuración Nginx:**

```nginx
# Backend API
server {
    listen 80;
    server_name api.atento5.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name correo.atento5.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4.3 Habilitar Configuración

```bash
# Crear enlaces simbólicos
sudo ln -s /etc/nginx/sites-available/atento5-correo /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo service nginx restart
```

### 5. Configurar SSL/TLS con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificados
sudo certbot --nginx -d api.atento5.com -d correo.atento5.com

# Renovación automática (ya está configurada)
sudo certbot renew --dry-run
```

### 6. Configurar Firewall

```bash
# Permitir SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

### 7. Monitoreo y Logs

#### 7.1 Configurar Log Rotation

```bash
sudo nano /etc/logrotate.d/atento5-correo
```

**Contenido:**

```
/var/www/atento5-premium/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

#### 7.2 Monitoreo con PM2 Plus (Opcional)

```bash
pm2 link
```

## 🔒 Seguridad Adicional

### 1. Configurar Fail2Ban

```bash
sudo apt install -y fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

### 2. Configurar Rate Limiting en Nginx

Agregar a la configuración Nginx:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

location /api/auth/login {
    limit_req zone=login_limit burst=5 nodelay;
    # ... resto de configuración
}

location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # ... resto de configuración
}
```

### 3. Encriptación de Credenciales

Considerar usar bcrypt para encriptar contraseñas IMAP en la base de datos:

```javascript
// En server/routes/auth.js
const bcrypt = require('bcryptjs');
const saltRounds = 12;

// Al guardar
const hashedPassword = await bcrypt.hash(imapPassword, saltRounds);

// Al usar
const isValid = await bcrypt.compare(imapPassword, hashedPassword);
```

## 📊 Monitoreo y Mantenimiento

### Scripts de Mantenimiento

**backup-database.sh:**

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/atento5-mail"
mkdir -p $BACKUP_DIR

pg_dump -U atento5_mail atento5_mail | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

**Cron job para backup diario:**

```bash
crontab -e
# Agregar: 0 2 * * * /var/www/atento5-premium/scripts/backup-database.sh
```

### Monitoreo de Salud

Crear endpoint `/api/health` en el backend:

```javascript
// server/routes/health.js
router.get('/health', async (req, res) => {
  try {
    // Check database
    await pool.query('SELECT 1');
    
    // Check IMAP connection (opcional)
    // Check SMTP connection (opcional)
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Error de Conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está ejecutándose
sudo service postgresql status

# Verificar logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 2. Error de PM2

```bash
# Verificar logs de PM2
pm2 logs

# Reiniciar PM2
pm2 restart all

# Limpiar PM2
pm2 flush
```

#### 3. Error de Nginx

```bash
# Verificar configuración
sudo nginx -t

# Verificar logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. Error de IMAP/SMTP

```bash
# Verificar conectividad
telnet mail.atento5.com 993
telnet mail.atento5.com 465

# Verificar firewall
sudo ufw status
```

## 📝 Checklist de Deployment

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL 14+ configurado
- [ ] Base de datos creada y schema inicializado
- [ ] PM2 instalado y configurado
- [ ] Nginx configurado con reverse proxy
- [ ] SSL/TLS configurado con Let's Encrypt
- [ ] Firewall configurado
- [ ] Variables de entorno configuradas
- [ ] Aplicación iniciada con PM2
- [ ] Logs configurados
- [ ] Backup automático configurado
- [ ] Monitoreo de salud configurado
- [ ] Rate limiting configurado
- [ ] Fail2ban configurado
- [ ] Test de IMAP/SMTP ejecutados
- [ ] Test de API ejecutados
- [ ] Test end-to-end completado

## 🎯 Post-Deployment

### 1. Verificar Funcionalidad

```bash
# Ejecutar tests
node server/tests/test-database.js
node server/tests/test-imap.js
node server/tests/test-smtp.js
node server/tests/test-api.js
```

### 2. Monitorear Logs

```bash
# PM2 logs
pm2 logs --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. Configurar Alertas

Considerar usar servicios como:
- Uptime Robot (monitoreo de uptime)
- Sentry (error tracking)
- PagerDuty (alertas)

---

**Estado:** ✅ LISTO PARA DEPLOYMENT
**Última Actualización:** 27-05-2026
