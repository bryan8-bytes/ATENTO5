import { Document, ImageRun, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer } from 'docx';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const ATENTO5 = {
  nombre: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
  ruc: '20612345678',
  direccion: 'Asoc. Villa el Rosario, MZ D, Lote 1, Calle 3, Chaclacayo, Lima, Perú',
  telefono: '+51 955 295 390',
  correo: 'Juan.ampuero@atento5.com',
  web: 'www.atento5.com',
};

const logoBuffer = readFileSync(resolve('src/assets/Logo Atento5.png'));
const logoBase64 = logoBuffer.toString('base64');
const logoType = 'png';

const today = new Date().toLocaleDateString('es-PE', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

// Header con TEXTO (evita bug rId0 de ImageRun en header/footer de docx@9.7.1)
const headerParagraph = new Paragraph({
  children: [
    new TextRun({ text: `${ATENTO5.nombre}  |  RUC ${ATENTO5.ruc}  |  ${ATENTO5.telefono}`, bold: true, fontSize: 8, color: '3CB4FF' }),
  ],
  alignment: AlignmentType.CENTER,
});

const footerParagraph = new Paragraph({
  children: [
    new TextRun({ text: `Email: ${ATENTO5.correo}  |  ${ATENTO5.direccion}  |  ${ATENTO5.web}`, fontSize: 7, color: '64748b' }),
  ],
  alignment: AlignmentType.CENTER,
});

const doc = new Document({
  sections: [{
    headers: {
      default: new Header({ children: [headerParagraph] }),
    },
    footers: {
      default: new Footer({ children: [footerParagraph] }),
    },
    properties: {
      page: {
        size: 'A4',
        orientation: 'portrait',
        margin: { top: 1200, right: 600, bottom: 1200, left: 600 },
      },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new ImageRun({
            data: logoBase64,
            type: logoType,
            transformation: { width: 110, height: 50 },
          }),
        ],
      }),
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'Carta de Presentación Corporativa', bold: true, fontSize: 26, color: 'D21414' })],
      }),
      new Paragraph({ text: today, alignment: AlignmentType.RIGHT, spacing: { after: 300 } }),
      new Paragraph({ text: 'A la atención de:', bold: true, spacing: { after: 80 } }),
      new Paragraph({ text: '[Nombre del Cliente / Responsable]', spacing: { after: 200 } }),
      new Paragraph({ text: 'Estimado/a [Nombre]:', spacing: { after: 160 } }),
      new Paragraph({
        text: 'Por medio de la presente, nos dirigimos a usted para comunicarle que ATENTO5 SERVICIOS GENERALES E.I.R.L. se encuentra a su disposición para brindarle soluciones integrales en los siguientes rubros:',
        spacing: { after: 160 },
      }),
      new Paragraph({ text: '• Mantenimiento General', spacing: { after: 60 } }),
      new Paragraph({ text: '• Construcción y reparación', spacing: { after: 60 } }),
      new Paragraph({ text: '• Gasfitería y electricidad', spacing: { after: 60 } }),
      new Paragraph({ text: '• Jardinería y limpieza industrial', spacing: { after: 60 } }),
      new Paragraph({ text: '• Servicios de infraestructura corporativa', spacing: { after: 300 } }),
      new Paragraph({
        text: 'Contamos con una experiencia de más de 10 años en el mercado peruano, garantizando transparencia técnica, optimización de presupuestos y una capacidad de respuesta inmediata ante cualquier requerimiento.',
        spacing: { after: 300 },
      }),
      new Paragraph({
        text: 'Quedamos atentos a su pronta respuesta. No dude en contactarnos por cualquiera de nuestros canales.',
        spacing: { after: 300 },
      }),
      new Paragraph({ text: 'Atentamente,', alignment: AlignmentType.LEFT }),
      new Paragraph({ text: 'Juan José Ampuero Torres', alignment: AlignmentType.LEFT }),
      new Paragraph({ text: 'Gerente General', alignment: AlignmentType.LEFT }),
      new Paragraph({ text: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.', alignment: AlignmentType.LEFT }),
    ],
  }],
});

const buffer = await Packer.toBuffer(doc);
const outPath = resolve('ATENTO5_Hoja_Membretada.docx');
writeFileSync(outPath, buffer);
console.log('DOCX generado:', outPath, buffer.length, 'bytes');
