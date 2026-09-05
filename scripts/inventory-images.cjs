const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const files = fs.readdirSync(assetsDir).filter(f => /\.(jpg|jpeg|png|svg|webp|avif)$/i.test(f));

function getJpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xFF || buffer[1] !== 0xD8) return null;
  let offset = 2;
  while (offset < buffer.length - 1) {
    const marker = buffer.readUInt16BE(offset);
    if ((marker & 0xFF00) !== 0xFF00) return null;
    if (marker === 0xFFDA) break;
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xFFC0 && marker <= 0xFFC3) {
      const height = buffer.readUInt16BE(offset + 3);
      const width = buffer.readUInt16BE(offset + 5);
      return { width, height };
    }
    offset += 2 + length;
  }
  return null;
}

function getPngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString('hex', 0, 8) !== '89504e470d0a1a0a') return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function getWebPDimensions(buffer) {
  if (buffer.length < 12) return null;
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    const width = buffer.readUInt16BE(24);
    const height = buffer.readUInt16BE(26);
    return { width, height };
  }
  return null;
}

function getSvgDimensions(buffer) {
  const text = buffer.toString('utf8');
  const viewBoxMatch = text.match(/viewBox=["']([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)["']/);
  if (viewBoxMatch) {
    return { width: Math.round(parseFloat(viewBoxMatch[3])), height: Math.round(parseFloat(viewBoxMatch[4])) };
  }
  const widthMatch = text.match(/width=["']([\d.]+)/);
  const heightMatch = text.match(/height=["']([\d.]+)/);
  if (widthMatch && heightMatch) {
    return { width: Math.round(parseFloat(widthMatch[1])), height: Math.round(parseFloat(heightMatch[1])) };
  }
  return null;
}

const results = [];

for (const file of files) {
  const filePath = path.join(assetsDir, file);
  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(file).toLowerCase();
  let dimensions = null;

  if (ext === '.jpg' || ext === '.jpeg') dimensions = getJpegDimensions(buffer);
  else if (ext === '.png') dimensions = getPngDimensions(buffer);
  else if (ext === '.webp') dimensions = getWebPDimensions(buffer);
  else if (ext === '.svg') dimensions = getSvgDimensions(buffer);

  const sizeKB = (stat.size / 1024).toFixed(1);
  const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);

  results.push({
    file,
    ext,
    sizeKB,
    sizeMB,
    dimensions: dimensions ? `${dimensions.width}x${dimensions.height}` : 'N/A',
    width: dimensions?.width || null,
    height: dimensions?.height || null,
  });
}

results.sort((a, b) => parseFloat(b.sizeMB) - parseFloat(a.sizeMB));

console.log('\nINVENTARIO DE IMÁGENES - src/assets');
console.log('='.repeat(100));
console.log('Archivo'.padEnd(35), 'Formato'.padEnd(8), 'Peso'.padEnd(12), 'Dimensiones'.padEnd(18), 'Uso estimado');
console.log('-'.repeat(100));

for (const r of results) {
  let usage = '';
  if (r.file.includes('Logo')) usage = 'Logo';
  else if (r.file.includes('hero')) usage = 'Hero/fondo';
  else if (r.file.includes('brochure')) usage = 'Brochure';
  else if (r.ext === '.svg') usage = 'Icono/vector';
  else usage = 'Servicio';

  const sizeDisplay = parseFloat(r.sizeMB) >= 1 ? `${r.sizeMB} MB` : `${r.sizeKB} KB`;
  console.log(
    r.file.padEnd(35),
    r.ext.padEnd(8),
    sizeDisplay.padEnd(12),
    r.dimensions.padEnd(18),
    usage
  );
}

console.log('-'.repeat(100));
const totalMB = results.reduce((acc, r) => acc + parseFloat(r.sizeMB), 0).toFixed(2);
const totalKB = results.reduce((acc, r) => acc + parseFloat(r.sizeKB), 0).toFixed(1);
console.log(`\nTotal: ${results.length} archivos | ${totalMB} MB (${totalKB} KB)`);

const heavy = results.filter(r => parseFloat(r.sizeMB) >= 1);
console.log(`\nImágenes > 1 MB: ${heavy.length}`);
for (const r of heavy) {
  console.log(`  - ${r.file}: ${r.sizeMB} MB (${r.dimensions})`);
}
