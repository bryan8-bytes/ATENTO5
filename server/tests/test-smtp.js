/**
 * Test script for SMTP connection
 * Run with: node server/tests/test-smtp.js
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const SMTP_HOST = process.env.SMTP_HOST || 'mail.atento5.com';
const SMTP_PORT = process.env.SMTP_PORT || 465;
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

async function testSMTPConnection() {
  console.log('='.repeat(60));
  console.log('TEST DE CONEXIÓN SMTP');
  console.log('='.repeat(60));
  console.log(`Host: ${SMTP_HOST}`);
  console.log(`Port: ${SMTP_PORT}`);
  console.log(`Email: ${TEST_EMAIL}`);
  console.log('='.repeat(60));

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.error('❌ ERROR: TEST_EMAIL y TEST_PASSWORD son requeridos en .env');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: TEST_EMAIL,
      pass: TEST_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('\n📡 Verificando conexión SMTP...');
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa');

    console.log('\n📧 Enviando email de prueba...');
    const testEmail = {
      from: TEST_EMAIL,
      to: TEST_EMAIL, // Enviar a sí mismo para prueba
      subject: 'Test SMTP - Sistema de Correo Atento5',
      html: `
        <h1>Test SMTP Exitoso</h1>
        <p>Este es un email de prueba automático del sistema de correo Atento5.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <p><strong>Servidor:</strong> ${SMTP_HOST}:${SMTP_PORT}</p>
        <hr>
        <p><em>Si recibes este email, la configuración SMTP es correcta.</em></p>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Email enviado exitosamente');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}`);

    console.log('\n📎 Probando envío con adjunto...');
    const attachmentEmail = {
      from: TEST_EMAIL,
      to: TEST_EMAIL,
      subject: 'Test SMTP con Adjunto - Atento5',
      html: '<h1>Email con Adjunto</h1><p>Este email tiene un archivo adjunto de prueba.</p>',
      attachments: [
        {
          filename: 'test.txt',
          content: 'Este es un archivo de prueba para el sistema de correo Atento5.',
          encoding: 'utf-8'
        }
      ]
    };

    const attachmentInfo = await transporter.sendMail(attachmentEmail);
    console.log('✅ Email con adjunto enviado exitosamente');
    console.log(`   Message ID: ${attachmentInfo.messageId}`);

    console.log('\n📧 Probando CC y BCC...');
    const ccEmail = {
      from: TEST_EMAIL,
      to: TEST_EMAIL,
      cc: TEST_EMAIL,
      bcc: TEST_EMAIL,
      subject: 'Test SMTP CC/BCC - Atento5',
      html: '<h1>Email con CC y BCC</h1><p>Prueba de campos CC y BCC.</p>'
    };

    const ccInfo = await transporter.sendMail(ccEmail);
    console.log('✅ Email con CC/BCC enviado exitosamente');
    console.log(`   Message ID: ${ccInfo.messageId}`);

    console.log('\n🔒 Cerrando conexión...');
    transporter.close();
    console.log('✅ Conexión cerrada');

    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST SMTP COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('\n📝 Recomendaciones:');
    console.log('   1. Verifica que recibiste los emails de prueba');
    console.log('   2. Revisa la carpeta Sent en tu cliente de correo');
    console.log('   3. Confirma que los adjuntos se descargan correctamente');

  } catch (error) {
    console.error('\n❌ ERROR EN TEST SMTP:');
    console.error(`   ${error.message}`);
    console.error('\nPosibles causas:');
    console.error('   1. Credenciales incorrectas');
    console.error('   2. Servidor SMTP no accesible');
    console.error('   3. Puerto 465 bloqueado por firewall');
    console.error('   4. Autenticación SMTP deshabilitada');
    console.error('   5. Límite de envío alcanzado');
    console.error('\n' + '='.repeat(60));
    process.exit(1);
  }
}

testSMTPConnection();
