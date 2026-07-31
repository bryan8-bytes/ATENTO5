/**
 * Test script for API endpoints
 * Run with: node server/tests/test-api.js
 * Requires: Backend server running on port 5000
 */

import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

let authToken = null;

async function request(endpoint, method = 'GET', data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function testAuthAPI() {
  console.log('='.repeat(60));
  console.log('TEST DE API - AUTENTICACIÓN');
  console.log('='.repeat(60));

  // Test Registration
  console.log('\n📝 Test 1: Registro de usuario...');
  const registerData = {
    email: `test${Date.now()}@atento5.com`,
    password: 'Test123456!',
    name: 'Test User',
    imap_password: 'Test123456!'
  };

  const registerResult = await request('/auth/register', 'POST', registerData);
  if (registerResult.status === 201) {
    console.log('✅ Registro exitoso');
    console.log(`   User ID: ${registerResult.data.user.id}`);
  } else {
    console.log('⚠️  Registro fallido (posiblemente usuario ya existe)');
    console.log(`   Status: ${registerResult.status}`);
  }

  // Test Login
  console.log('\n🔑 Test 2: Login de usuario...');
  const loginData = {
    email: registerData.email,
    password: registerData.password
  };

  const loginResult = await request('/auth/login', 'POST', loginData);
  if (loginResult.status === 200) {
    console.log('✅ Login exitoso');
    authToken = loginResult.data.token;
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Login fallido');
    console.log(`   Status: ${loginResult.status}`);
    console.log(`   Error: ${loginResult.data.error}`);
    return false;
  }

  // Test Verify Token
  console.log('\n✅ Test 3: Verificación de token...');
  const verifyResult = await request('/auth/verify', 'GET', null, authToken);
  if (verifyResult.status === 200) {
    console.log('✅ Token válido');
    console.log(`   User: ${verifyResult.data.user.email}`);
  } else {
    console.log('❌ Token inválido');
  }

  return true;
}

async function testEmailAPI() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST DE API - EMAILS');
  console.log('='.repeat(60));

  if (!authToken) {
    console.log('❌ No hay token de autenticación');
    return false;
  }

  // Test Get Emails
  console.log('\n📧 Test 4: Obtener emails de INBOX...');
  const inboxResult = await request('/email/folder/INBOX', 'GET', null, authToken);
  if (inboxResult.status === 200) {
    console.log('✅ Emails obtenidos');
    console.log(`   Total: ${inboxResult.data.emails.length} emails`);
    if (inboxResult.data.emails.length > 0) {
      console.log(`   Primero: ${inboxResult.data.emails[0].subject}`);
    }
  } else {
    console.log('⚠️  Error al obtener emails');
    console.log(`   Status: ${inboxResult.status}`);
  }

  // Test Get Folders
  console.log('\n📂 Test 5: Obtener carpetas...');
  const foldersResult = await request('/imap/folders', 'GET', null, authToken);
  if (foldersResult.status === 200) {
    console.log('✅ Carpetas obtenidas');
    console.log(`   Total: ${foldersResult.data.folders.length} carpetas`);
    foldersResult.data.folders.forEach(folder => {
      console.log(`   - ${folder.name}: ${folder.last_sync}`);
    });
  } else {
    console.log('⚠️  Error al obtener carpetas');
  }

  // Test Search
  console.log('\n🔍 Test 6: Buscar emails...');
  const searchResult = await request('/email/search/test', 'GET', null, authToken);
  if (searchResult.status === 200) {
    console.log('✅ Búsqueda completada');
    console.log(`   Resultados: ${searchResult.data.emails.length} emails`);
  } else {
    console.log('⚠️  Error en búsqueda');
  }

  return true;
}

async function testSMTPEmailAPI() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST DE API - SMTP');
  console.log('='.repeat(60));

  if (!authToken) {
    console.log('❌ No hay token de autenticación');
    return false;
  }

  // Test Send Email
  console.log('\n📤 Test 7: Enviar email...');
  const emailData = {
    to: 'test@atento5.com',
    subject: 'Test API - Sistema de Correo',
    body: '<h1>Email de prueba desde API</h1><p>Este es un email enviado desde el test de API.</p>'
  };

  const sendResult = await request('/smtp/send', 'POST', emailData, authToken);
  if (sendResult.status === 200) {
    console.log('✅ Email enviado exitosamente');
    console.log(`   Message ID: ${sendResult.data.messageId}`);
    console.log(`   Status: ${sendResult.data.status}`);
  } else {
    console.log('⚠️  Error al enviar email');
    console.log(`   Status: ${sendResult.status}`);
    console.log(`   Error: ${sendResult.data.error}`);
  }

  return true;
}

async function runAllTests() {
  console.log('🧪 SUITE DE TESTS API');
  console.log('⚠️  Asegúrate de que el backend esté ejecutándose en http://localhost:5000');
  console.log('');

  const authSuccess = await testAuthAPI();
  if (authSuccess) {
    await testEmailAPI();
    await testSMTPEmailAPI();
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ TESTS API COMPLETADOS');
  console.log('='.repeat(60));
}

runAllTests();
