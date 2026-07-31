/**
 * Test script for IMAP connection
 * Run with: node server/tests/test-imap.js
 */

import { ImapFlow } from 'imapflow';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const IMAP_HOST = process.env.IMAP_HOST || 'mail.atento5.com';
const IMAP_PORT = process.env.IMAP_PORT || 993;
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

async function testIMAPConnection() {
  console.log('='.repeat(60));
  console.log('TEST DE CONEXIÓN IMAP');
  console.log('='.repeat(60));
  console.log(`Host: ${IMAP_HOST}`);
  console.log(`Port: ${IMAP_PORT}`);
  console.log(`Email: ${TEST_EMAIL}`);
  console.log('='.repeat(60));

  if (!TEST_EMAIL || !TEST_PASSWORD) {
    console.error('❌ ERROR: TEST_EMAIL y TEST_PASSWORD son requeridos en .env');
    process.exit(1);
  }

  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: {
      user: TEST_EMAIL,
      pass: TEST_PASSWORD
    },
    logger: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('\n📡 Conectando al servidor IMAP...');
    await client.connect();
    console.log('✅ Conexión exitosa');

    console.log('\n📂 Listando carpetas...');
    const mailboxes = await client.list();
    console.log(`✅ Encontradas ${mailboxes.length} carpetas:`);
    mailboxes.forEach((mailbox, index) => {
      console.log(`   ${index + 1}. ${mailbox.name} (${mailbox.flags.join(', ')})`);
    });

    console.log('\n📥 Abriendo carpeta INBOX...');
    const inbox = await client.mailboxOpen('INBOX');
    console.log(`✅ INBOX abierta: ${inbox.exists} mensajes`);

    if (inbox.exists > 0) {
      console.log('\n📋 Leyendo primeros 5 mensajes...');
      const messages = await client.fetch({ limit: 5 }, { envelope: true, source: true });
      
      let count = 0;
      for await (const msg of messages) {
        count++;
        console.log(`\n   Mensaje ${count}:`);
        console.log(`   From: ${msg.envelope.from?.[0]?.address || 'N/A'}`);
        console.log(`   Subject: ${msg.envelope.subject || '(Sin asunto)'}`);
        console.log(`   Date: ${msg.envelope.date || 'N/A'}`);
        console.log(`   Size: ${(msg.source.size / 1024).toFixed(2)} KB`);
      }
      console.log(`\n✅ Leídos ${count} mensajes`);
    }

    console.log('\n📂 Probando carpeta Sent...');
    try {
      const sent = await client.mailboxOpen('Sent');
      console.log(`✅ Sent abierta: ${sent.exists} mensajes`);
    } catch (error) {
      console.log(`⚠️  Carpeta Sent no encontrada (normal si está vacía)`);
    }

    console.log('\n📂 Probando carpeta Drafts...');
    try {
      const drafts = await client.mailboxOpen('Drafts');
      console.log(`✅ Drafts abierta: ${drafts.exists} mensajes`);
    } catch (error) {
      console.log(`⚠️  Carpeta Drafts no encontrada (normal si está vacía)`);
    }

    console.log('\n🔒 Cerrando conexión...');
    await client.logout();
    console.log('✅ Conexión cerrada');

    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST IMAP COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERROR EN TEST IMAP:');
    console.error(`   ${error.message}`);
    console.error('\nPosibles causas:');
    console.error('   1. Credenciales incorrectas');
    console.error('   2. Servidor IMAP no accesible');
    console.error('   3. Puerto 993 bloqueado por firewall');
    console.error('   4. Certificado SSL inválido');
    console.error('\n' + '='.repeat(60));
    process.exit(1);
  }
}

testIMAPConnection();
