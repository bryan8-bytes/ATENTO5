import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { jsPDF } from 'jspdf';

const fs = await import('fs');
const logoPath = resolve('src/assets/Logo Atento5.png');
const logoExists = fs.existsSync(logoPath);

const ATENTO5 = {
  nombre: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
  ruc: '20612345678',
  direccion: 'Asoc. Villa el Rosario, MZ D, Lote 1, Calle 3, Chaclacayo, Lima, Perú',
  telefono: '+51 955 295 390',
  correo: 'Juan.ampuero@atento5.com',
  web: 'www.atento5.com',
};

const today = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: '2-digit' });

// A4: 210 x 297 mm => 595.28 x 841.89 pt
const PAGE_WIDTH = 595.28;
const MARGIN_X = 59; // 20mm (1mm = 2.377pt... 20mm ≈ 56pt)

// jsPDF auto calcula; usar unidades pt
const doc = new jsPDF({ unit: 'pt', format: 'a4' });
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const marginLeft = 56;
const marginRight = 56;
const marginTop = 56;
const marginBottom = 70;

// Logo como imagen (si existe)
let logoDataUrl = '';
if (logoExists) {
  const buf = fs.readFileSync(logoPath);
  const b64 = buf.toString('base64');
  const mime = 'image/png';
  logoDataUrl = `data:${mime};base64,${b64}`;
}

// Header (dibujado en cada página) - lo simulamos con contentLeft/contentRight y margen superior
// jsPDF no tiene header/footer automático nativo, pero podemos usar markdowns... Lo simulamos
// dibujando el header/footer en cada página.

doc.setFontSize(9);
let cursorY = marginTop;

function drawHeader() {
  doc.setLineWidth(0.5);
  doc.setDrawColor(61, 180, 255);
  doc.setFillColor(255, 255, 255);
  // dibujar línea divisor superior
  doc.setDrawColor(61, 180, 255);
  doc.line(marginLeft, cursorY - 6, pageWidth - marginRight, cursorY - 6);
}

function drawFooter(pageNum, pageTotal) {
  const footerY = pageHeight - 20;
  doc.setLineWidth(0.5);
  doc.setDrawColor(61, 180, 255);
  doc.line(marginLeft, footerY - 6, pageWidth - marginRight, footerY - 6);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - 90, footerY + 0, 36, 16);
    } catch (e) {
      // fallback
    }
    doc.text(ATENTO5.nombre, pageWidth / 2 - 46, footerY + 11);
  }
  const footerText = `${ATENTO5.nombre}  |  RUC: ${ATENTO5.ruc}  |  Tlf: ${ATENTO5.telefono}  |  Email: ${ATENTO5.correo}`;
  doc.text(footerText, pageWidth / 2, footerY + 11, { align: 'center' });
  doc.text(`Página ${pageNum} de ${pageTotal}`, pageWidth / 2, footerY + 26, { align: 'center' });
  doc.setTextColor(26, 35, 59);
}

// Drawer footer en todas las páginas existentes
function applyFooter(pageNum, pageTotal) {
  drawFooter(pageNum, pageTotal);
}

// --- CONTENIDO DE LA CARTA ---

// Header con logo + nombre
doc.setFontSize(12);
doc.setTextColor(210, 20, 30);
let x = marginLeft;
if (logoDataUrl) {
  try {
    doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - 95, marginTop - 4, 38, 18);
  } catch (e) {}
  doc.text(ATENTO5.nombre, pageWidth / 2 + 14, marginTop + 8);
} else {
  doc.text(ATENTO5.nombre, pageWidth / 2, marginTop - 2, { align: 'center' });
}
doc.setLineWidth(0.5);
doc.setDrawColor(61, 180, 255);
doc.line(marginLeft, marginTop + 14, pageWidth - marginRight, marginTop + 14);

cursorY = marginTop + 24;

doc.setTextColor(26, 35, 59);
doc.setFontSize(15);
doc.text('Carta de Presentación Corporativa', pageWidth / 2, cursorY, { align: 'center' });
cursorY += 18;

doc.setFontSize(10);
doc.text(today, pageWidth - marginRight, cursorY, { align: 'right' });
cursorY += 14;

doc.setFontSize(11);
doc.text('A la atención de:', marginLeft, cursorY);
cursorY += 14;
doc.text('[Nombre del Cliente / Responsable]', marginLeft, cursorY);
cursorY += 22;

doc.text('Estimado/a [Nombre]:', marginLeft, cursorY);
cursorY += 16;

const body = [
  'Por medio de la presente, nos dirigimos a usted para comunicarle que ATENTO5 SERVICIOS GENERALES E.I.R.L. se encuentra a su disposición para brindarle soluciones integrales en los siguientes rubros:',
  '\u2022 Mantenimiento General',
  '\u2022 Construcción y reparación',
  '\u2022 Gasfitería y electricidad',
  '\u2022 Jardinería y limpieza industrial',
  '\u2022 Servicios de infraestructura corporativa',
  'Contamos con una experiencia de más de 10 años en el mercado peruano, garantizando transparencia técnica, optimización de presupuestos y una capacidad de respuesta inmediata ante cualquier requerimiento.',
  'Quedamos atentos a su pronta respuesta. No dude en contactarnos por cualquiera de nuestros canales.',
  'Atentamente,\nJuan José Ampuero Torres\nGerente General\nATENTO5 SERVICIOS GENERALES E.I.R.L.',
];

for (const line of body) {
  if (line.startsWith('\u2022')) {
    doc.text(line, marginLeft + 10, cursorY);
    cursorY += 7;
  } else if (line.includes('\n')) {
    const parts = line.split('\n');
    for (const p of parts) {
      doc.text(p, marginLeft, cursorY);
      cursorY += 7;
    }
  } else {
    const txt = doc.splitTextToSize(line, pageWidth - marginLeft - marginRight - 12);
    for (const p of txt) {
      doc.text(p, marginLeft, cursorY);
      cursorY += 6.2;
    }
  }
  cursorY += 5;
}

// Footer simple estático (se añade a la página 1)
const pageTotal = doc.internal.getNumberOfPages();
applyFooter(1, pageTotal);

writeFileSync(resolve('ATENTO5_Hoja_Membretada.pdf'), Buffer.from(doc.output('arraybuffer')));
console.log('PDF generado: ATENTO5_Hoja_Membretada.pdf | páginas:', doc.output('blob').size);
