# Guía de Testing - Sistema de Correo Atento5

## 🧪 Suite de Tests

El sistema incluye scripts de prueba para verificar la funcionalidad de cada componente.

## 📋 Tests Disponibles

### 1. Test de Conexión IMAP

**Archivo:** `server/tests/test-imap.js`

**Propósito:** Verificar la conexión al servidor IMAP y la capacidad de leer emails.

**Ejecución:**
```bash
node server/tests/test-imap.js
```

**Prerrequisitos:**
- Configurar `TEST_EMAIL` y `TEST_PASSWORD` en `.env`
- Servidor IMAP accesible (mail.atento5.com:993)

**Verificaciones:**
- ✅ Conexión SSL a mail.atento5.com:993
- ✅ Autenticación con credenciales
- ✅ Listado de carpetas (INBOX, Sent, Drafts, Spam, Trash)
- ✅ Lectura de emails de INBOX
- ✅ Acceso a carpetas Sent y Drafts

**Output esperado:**
```
============================================================
TEST DE CONEXIÓN IMAP
============================================================
Host: mail.atento5.com
Port: 993
Email: tu-email@atento5.com
============================================================

📡 Conectando al servidor IMAP...
✅ Conexión exitosa

📂 Listando carpetas...
✅ Encontradas 5 carpetas:
   1. INBOX (\Seen \Answered \Flagged \Deleted \Draft)
   2. Sent (\Seen \Answered \Flagged \Deleted \Draft)
   3. Drafts (\Seen \Answered \Flagged \Deleted \Draft)
   4. Spam (\Seen \Answered \Flagged \Deleted \Draft)
   5. Trash (\Seen \Answered \Flagged \Deleted \Draft)

📥 Abriendo carpeta INBOX...
✅ INBOX abierta: 150 mensajes

📋 Leyendo primeros 5 mensajes...

   Mensaje 1:
   From: remitente@ejemplo.com
   Subject: Asunto del email
   Date: 2024-05-27T10:30:00Z
   Size: 15.23 KB

✅ Leídos 5 mensajes

🔒 Cerrando conexión...
✅ Conexión cerrada

============================================================
✅ TEST IMAP COMPLETADO EXITOSAMENTE
============================================================
```

### 2. Test de Conexión SMTP

**Archivo:** `server/tests/test-smtp.js`

**Propósito:** Verificar la capacidad de enviar emails con SMTP.

**Ejecución:**
```bash
node server/tests/test-smtp.js
```

**Prerrequisitos:**
- Configurar `TEST_EMAIL` y `TEST_PASSWORD` en `.env`
- Servidor SMTP accesible (mail.atento5.com:465)

**Verificaciones:**
- ✅ Conexión SSL a mail.atento5.com:465
- ✅ Autenticación SMTP
- ✅ Envío de email básico
- ✅ Envío de email con adjunto
- ✅ Envío de email con CC y BCC

**Output esperado:**
```
============================================================
TEST DE CONEXIÓN SMTP
============================================================
Host: mail.atento5.com
Port: 465
Email: tu-email@atento5.com
============================================================

📡 Verificando conexión SMTP...
✅ Conexión SMTP exitosa

📧 Enviando email de prueba...
✅ Email enviado exitosamente
   Message ID: <message-id@atento5.com>
   Response: 250 2.0.0 OK

📎 Probando envío con adjunto...
✅ Email con adjunto enviado exitosamente
   Message ID: <message-id-2@atento5.com>

📧 Probando CC y BCC...
✅ Email con CC/BCC enviado exitosamente
   Message ID: <message-id-3@atento5.com>

🔒 Cerrando conexión...
✅ Conexión cerrada

============================================================
✅ TEST SMTP COMPLETADO EXITOSAMENTE
============================================================

📝 Recomendaciones:
   1. Verifica que recibiste los emails de prueba
   2. Revisa la carpeta Sent en tu cliente de correo
   3. Confirma que los adjuntos se descargan correctamente
```

### 3. Test de Base de Datos PostgreSQL

**Archivo:** `server/tests/test-database.js`

**Propósito:** Verificar la conexión a PostgreSQL y la integridad del schema.

**Ejecución:**
```bash
node server/tests/test-database.js
```

**Prerrequisitos:**
- PostgreSQL ejecutándose
- Base de datos `atento5_mail` creada
- Schema inicializado
- Credenciales configuradas en `.env`

**Verificaciones:**
- ✅ Conexión a PostgreSQL
- ✅ Existencia de todas las tablas
- ✅ Integridad de schema
- ✅ Operaciones CRUD básicas

**Output esperado:**
```
============================================================
TEST DE CONEXIÓN POSTGRESQL
============================================================
Host: localhost
Port: 5432
Database: atento5_mail
User: atento5_mail
============================================================

📡 Conectando a PostgreSQL...
✅ Conexión exitosa

📊 Verificando schema...
✅ Encontradas 6 tablas:
   1. attachments
   2. drafts
   3. email_accounts
   4. email_cache
   5. folder_sync
   6. users

👤 Verificando tabla users...
✅ Tabla users: 5 registros

📧 Verificando tabla email_cache...
✅ Tabla email_cache: 150 registros

📎 Verificando tabla attachments...
✅ Tabla attachments: 25 registros

📝 Verificando tabla drafts...
✅ Tabla drafts: 3 registros

📂 Verificando tabla folder_sync...
✅ Tabla folder_sync: 5 registros

🔐 Verificando tabla email_accounts...
✅ Tabla email_accounts: 2 registros

➕ Test de inserción...
✅ Inserción exitosa
   User ID: 123
✅ Test user eliminado

🔒 Cerrando conexión...
✅ Conexión cerrada

============================================================
✅ TEST POSTGRESQL COMPLETADO EXITOSAMENTE
============================================================
```

### 4. Test de API Endpoints

**Archivo:** `server/tests/test-api.js`

**Propósito:** Verificar el funcionamiento de las APIs del backend.

**Ejecución:**
```bash
# Primero iniciar el backend
npm run server

# En otra terminal, ejecutar el test
node server/tests/test-api.js
```

**Prerrequisitos:**
- Backend ejecutándose en http://localhost:5000
- Base de datos configurada
- Variables de entorno configuradas

**Verificaciones:**
- ✅ Registro de usuario
- ✅ Login y generación de token JWT
- ✅ Verificación de token
- ✅ Obtención de emails por carpeta
- ✅ Listado de carpetas
- ✅ Búsqueda de emails
- ✅ Envío de email vía API

**Output esperado:**
```
============================================================
TEST DE API - AUTENTICACIÓN
============================================================

📝 Test 1: Registro de usuario...
✅ Registro exitoso
   User ID: 123

🔑 Test 2: Login de usuario...
✅ Login exitoso
   Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✅ Test 3: Verificación de token...
✅ Token válido
   User: test@atento5.com

============================================================
TEST DE API - EMAILS
============================================================

📧 Test 4: Obtener emails de INBOX...
✅ Emails obtenidos
   Total: 150 emails
   Primero: Asunto del email

📂 Test 5: Obtener carpetas...
✅ Carpetas obtenidas
   Total: 5 carpetas
   - INBOX: 2024-05-27T10:30:00Z
   - Sent: 2024-05-27T10:30:00Z
   - Drafts: 2024-05-27T10:30:00Z
   - Spam: 2024-05-27T10:30:00Z
   - Trash: 2024-05-27T10:30:00Z

🔍 Test 6: Buscar emails...
✅ Búsqueda completada
   Resultados: 10 emails

============================================================
TEST DE API - SMTP
============================================================

📤 Test 7: Enviar email...
✅ Email enviado exitosamente
   Message ID: <message-id@atento5.com>
   Status: sent

============================================================
✅ TESTS API COMPLETADOS
============================================================
```

## 🚀 Ejecutar Todos los Tests

### Script de Test Completo

Crear `server/tests/run-all-tests.sh`:

```bash
#!/bin/bash

echo "============================================================"
echo "SUITE COMPLETA DE TESTS - SISTEMA DE CORREO ATENTO5"
echo "============================================================"
echo ""

# Test 1: Database
echo "📊 TEST 1/4: Base de Datos PostgreSQL"
echo "------------------------------------------------------------"
node server/tests/test-database.js
if [ $? -ne 0 ]; then
    echo "❌ TEST DE BASE DE DATOS FALLÓ"
    exit 1
fi
echo ""

# Test 2: IMAP
echo "📧 TEST 2/4: Conexión IMAP"
echo "------------------------------------------------------------"
node server/tests/test-imap.js
if [ $? -ne 0 ]; then
    echo "❌ TEST IMAP FALLÓ"
    exit 1
fi
echo ""

# Test 3: SMTP
echo "📤 TEST 3/4: Conexión SMTP"
echo "------------------------------------------------------------"
node server/tests/test-smtp.js
if [ $? -ne 0 ]; then
    echo "❌ TEST SMTP FALLÓ"
    exit 1
fi
echo ""

# Test 4: API
echo "🔌 TEST 4/4: API Endpoints"
echo "------------------------------------------------------------"
echo "⚠️  Asegúrate de que el backend esté ejecutándose"
echo "   Presiona Enter para continuar o Ctrl+C para cancelar..."
read
node server/tests/test-api.js
if [ $? -ne 0 ]; then
    echo "❌ TEST API FALLÓ"
    exit 1
fi
echo ""

echo "============================================================"
echo "✅ TODOS LOS TESTS COMPLETADOS EXITOSAMENTE"
echo "============================================================"
```

**Ejecución:**
```bash
chmod +x server/tests/run-all-tests.sh
./server/tests/run-all-tests.sh
```

## 🧪 Testing Manual del Frontend

### Checklist de Testing UI

#### 1. Login de Correo
- [ ] Acceder a `/correo-login`
- [ ] Formulario de registro visible
- [ ] Validación de email
- [ ] Validación de contraseña
- [ ] Registro exitoso redirige a `/correo`
- [ ] Login exitoso redirige a `/correo`
- [ ] Error de autenticación muestra mensaje

#### 2. Interfaz Principal
- [ ] Sidebar con carpetas visible
- [ ] Lista de emails cargada
- [ ] Indicador de emails no leídos
- [ ] Botón de refrescar funcional
- [ ] Barra de búsqueda funcional
- [ ] Botón de nuevo correo funcional

#### 3. Visualización de Emails
- [ ] Click en email abre detalle
- [ ] Email marcado como leído automáticamente
- [ ] Botón de estrella funcional
- [ ] Botón de eliminar funcional
- [ ] Adjuntos visibles si existen
- [ ] Descarga de adjuntos funcional

#### 4. Compositor de Emails
- [ ] Modal de composición se abre
- [ ] Campos To, CC, BCC funcionales
- [ ] Campo de asunto funcional
- [ ] Editor de cuerpo funcional
- [ ] Adjunto de archivos funcional
- [ ] Envío exitoso cierra modal
- [ ] Email aparece en carpeta Sent

#### 5. Navegación entre Carpetas
- [ ] Click en INBOX carga emails
- [ ] Click en Sent carga emails
- [ ] Click en Drafts carga emails
- [ ] Click en Spam carga emails
- [ ] Click en Trash carga emails
- [ ] Contador de emails actualizado

#### 6. Búsqueda
- [ ] Búsqueda por asunto funciona
- [ ] Búsqueda por remitente funciona
- [ ] Resultados de búsqueda correctos
- [ ] Limpiar búsqueda restaura lista

#### 7. Responsive Design
- [ ] Funciona en móvil (320px+)
- [ ] Funciona en tablet (768px+)
- [ ] Funciona en desktop (1024px+)
- [ ] Sidebar colapsable en móvil
- [ ] Menú hamburguesa funcional

#### 8. Tema Oscuro/Claro
- [ ] Toggle de tema funcional
- [ ] Tema persiste en localStorage
- [ ] Colores correctos en modo oscuro
- [ ] Colores correctos en modo claro

## 🐛 Debugging de Tests

### Problemas Comunes

#### 1. Error de Conexión IMAP

**Síntoma:** `Error: Connection timeout`

**Soluciones:**
- Verificar que mail.atento5.com sea accesible
- Verificar puerto 993 no esté bloqueado por firewall
- Verificar credenciales correctas
- Usar telnet para probar: `telnet mail.atento5.com 993`

#### 2. Error de Conexión SMTP

**Síntoma:** `Error: Invalid login`

**Soluciones:**
- Verificar credenciales SMTP
- Verificar puerto 465 no esté bloqueado
- Verificar autenticación SMTP habilitada
- Usar telnet para probar: `telnet mail.atento5.com 465`

#### 3. Error de Base de Datos

**Síntoma:** `Error: Connection refused`

**Soluciones:**
- Verificar PostgreSQL ejecutándose: `sudo service postgresql status`
- Verificar credenciales en `.env`
- Verificar base de datos existe: `psql -l`
- Verificar schema inicializado

#### 4. Error de API

**Síntoma:** `Error: ECONNREFUSED`

**Soluciones:**
- Verificar backend ejecutándose: `npm run server`
- Verificar puerto 5000 no en uso
- Verificar CORS configurado
- Verificar firewall permite puerto 5000

## 📊 Reporte de Tests

### Template de Reporte

```markdown
# Reporte de Tests - Sistema de Correo Atento5

**Fecha:** DD/MM/YYYY
**Tester:** Nombre
**Entorno:** Desarrollo/Producción

## Tests Automatizados

### Test IMAP
- ✅/❌ Conexión SSL
- ✅/❌ Autenticación
- ✅/❌ Listado de carpetas
- ✅/❌ Lectura de emails
- **Resultado:** PASS/FAIL

### Test SMTP
- ✅/❌ Conexión SSL
- ✅/❌ Envío básico
- ✅/❌ Envío con adjuntos
- ✅/❌ Envío con CC/BCC
- **Resultado:** PASS/FAIL

### Test PostgreSQL
- ✅/❌ Conexión
- ✅/❌ Schema válido
- ✅/❌ Operaciones CRUD
- **Resultado:** PASS/FAIL

### Test API
- ✅/❌ Registro
- ✅/❌ Login
- ✅/❌ Obtener emails
- ✅/❌ Enviar email
- **Resultado:** PASS/FAIL

## Tests Manuales (UI)

### Login de Correo
- [ ] Registro funcional
- [ ] Login funcional
- [ ] Redirección correcta

### Interfaz Principal
- [ ] Carga de emails
- [ ] Navegación de carpetas
- [ ] Búsqueda funcional

### Compositor
- [ ] Envío de emails
- [ ] Adjuntos funcionales
- [ ] Validación de campos

### Responsive
- [ ] Móvil funcional
- [ ] Tablet funcional
- [ ] Desktop funcional

## Issues Encontrados

1. **Descripción del issue**
   - Severidad: Alta/Media/Baja
   - Pasos para reproducir
   - Screenshot (si aplica)

## Recomendaciones

1. Recomendación 1
2. Recomendación 2

## Conclusión

**Estado General:** PASS/FAIL
**Porcentaje de Tests Pasados:** XX%
**Listo para Deployment:** Sí/No
```

## 🎯 Criterios de Aceptación

### Para Deployment a Producción

- ✅ Todos los tests automatizados PASAN
- ✅ 95%+ de tests manuales PASAN
- ✅ Sin errores críticos
- ✅ Performance aceptable (< 3s carga)
- ✅ Seguridad validada (SSL, JWT, rate limiting)
- ✅ Backup de base de datos configurado
- ✅ Monitoreo configurado
- ✅ Documentación completa

### Para Deployment a Staging

- ✅ 80%+ de tests automatizados PASAN
- ✅ 70%+ de tests manuales PASAN
- ✅ Sin errores críticos
- ✅ Performance aceptable (< 5s carga)

---

**Estado:** ✅ TESTS COMPLETADOS
**Última Actualización:** 27-05-2026
