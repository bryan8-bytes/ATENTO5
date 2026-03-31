import { jsPDF } from 'jspdf';

function rgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function fill(d, h) { const c = rgb(h); d.setFillColor(c.r, c.g, c.b); }
function stroke(d, h) { const c = rgb(h); d.setDrawColor(c.r, c.g, c.b); }
function text(d, h) { const c = rgb(h); d.setTextColor(c.r, c.g, c.b); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadImg(url) {
  return new Promise(resolve => {
    if (!url) { resolve(null); return; }
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        const MAX = 700;
        let w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX || h > MAX) {
          const ratio = Math.min(MAX / w, MAX / h);
          w = Math.round(w * ratio); h = Math.round(h * ratio);
        }
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve({ data: c.toDataURL('image/jpeg', 0.85) });
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function img(d, img, x, y, w, h) {
  if (!img || !img.data) return;
  try { d.addImage(img.data, 'JPEG', x, y, w, h); } catch {}
}

// ════════════ PORTADA ════════════
function p1(d, logo, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  // Shapes de fondo
  d.setGState(new d.GState({ opacity: 0.03 }));
  fill(d, '#00C3FF'); d.rect(0, 0, W * 0.35, H * 0.35, 'F');
  fill(d, '#FF9900'); d.rect(W * 0.65, H * 0.65, W * 0.35, H * 0.35, 'F');
  d.setGState(new d.GState({ opacity: 1 }));

  // Grid
  d.setLineWidth(0.02);
  stroke(d, '#0A2647');
  for (let x = 0; x < W; x += 10) d.line(x, 0, x, H);
  for (let y = 0; y < H; y += 10) d.line(0, y, W, y);

  // Círculos concéntricos
  d.setLineWidth(0.1); stroke(d, '#00C3FF');
  d.setGState(new d.GState({ opacity: 0.04 }));
  d.circle(W / 2, H / 2 - 20, 120, 'S');
  d.circle(W / 2, H / 2 - 20, 160, 'S');
  d.setGState(new d.GState({ opacity: 1 }));

  // Cuadros rotados
  d.setLineWidth(0.2); stroke(d, '#00C3FF');
  d.setGState(new d.GState({ opacity: 0.04 }));
  d.rect(40, 80, 50, 50); // simplified
  stroke(d, '#FF9900');
  d.rect(W - 90, H - 130, 40, 40);
  d.setGState(new d.GState({ opacity: 1 }));

  // Esquinas
  d.setLineWidth(0.8); stroke(d, '#00C3FF');
  d.line(20, 20, 20, 50); d.line(20, 20, 50, 20);
  stroke(d, '#FF9900');
  d.line(W - 20, H - 20, W - 20, H - 50); d.line(W - 20, H - 20, W - 50, H - 20);

  // Logo
  if (logo) img(d, logo, W / 2 - 25, 60, 50, 50);

  // Título
  d.setFont('helvetica', 'bold'); d.setFontSize(58);
  text(d, '#FFFFFF');
  d.text('ATENTO5', W / 2, 135, { align: 'center' });

  // Línea naranja corta
  fill(d, '#FF9900'); d.rect(W / 2 - 24, 140, 48, 2, 'F');

  // Subtítulo
  d.setFont('helvetica', 'normal'); d.setFontSize(11);
  text(d, '#7A8DA6');
  d.text('SERVICIOS GENERALES E.I.R.L.', W / 2, 155, { align: 'center' });

  // Badge cápsula
  d.setLineWidth(0.4); stroke(d, '#00C3FF');
  d.roundedRect(W / 2 - 42, 165, 84, 13, 6.5, 6.5);
  d.setFont('helvetica', 'bold'); d.setFontSize(7);
  text(d, '#00C3FF');
  d.text('BROCHURE CORPORATIVO 2026', W / 2, 173, { align: 'center' });

  // Frase
  d.setFont('helvetica', 'bold'); d.setFontSize(28);
  text(d, '#FFFFFF'); d.text('"SOMOS TU', W / 2, 215, { align: 'center' });
  text(d, '#00C3FF'); d.text('SOLUCION', W / 2, 230, { align: 'center' });
  text(d, '#FF9900'); d.text('INTEGRAL"', W / 2, 245, { align: 'center' });

  // Barra inferior
  d.setGState(new d.GState({ opacity: 0.3 }));
  fill(d, '#00C3FF'); d.rect(0, H - 3, W / 2, 3, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 3, W / 2, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ ÍNDICE ════════════
function p2(d, svcCount, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  // Barra lateral
  fill(d, '#000000'); d.rect(0, 0, 18, H, 'F');
  stroke(d, '#00C3FF'); d.setLineWidth(0.2); d.line(18, 0, 18, H);

  // ÍNDICE rotado
  d.setFont('helvetica', 'bold'); d.setFontSize(20);
  text(d, '#FFFFFF');
  d.text('INDICE', 9, H / 2, { align: 'center', angle: 90 });

  // Divisor
  fill(d, '#00C3FF'); d.rect(28, 18, 20, 1.5, 'F');
  fill(d, '#FF9900'); d.rect(48, 18, 20, 1.5, 'F');

  d.setFont('helvetica', 'bold'); d.setFontSize(14);
  text(d, '#FFFFFF'); d.text('CONTENIDO', 28, 30);

  const items = [
    { n: '01', t: 'Quienes somos?' },
    { n: '02', t: 'Mision y Vision' },
    { n: '03', t: 'Por que elegirnos?' },
    { n: '04', t: 'Nuestros Servicios' },
    { n: '05', t: 'Contactos' },
  ];
  items.forEach((it, i) => {
    const y = 45 + i * 20;
    const c = i % 2 === 0 ? '#00C3FF' : '#FF9900';
    d.setFont('helvetica', 'bold'); d.setFontSize(16);
    text(d, c); d.text(it.n, 28, y + 5);
    d.setFontSize(9); text(d, '#FFFFFF'); d.text(it.t, 48, y + 2);
    stroke(d, c); d.setLineWidth(0.1); d.line(48, y + 7, W - 15, y + 7);
  });

  d.setGState(new d.GState({ opacity: 0.3 }));
  fill(d, '#00C3FF'); d.rect(0, H - 3, W / 2, 3, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 3, W / 2, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ QUIENES SOMOS ════════════
function p3(d, logo, bg, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  if (bg) img(d, bg, 0, 0, W, H * 0.35);
  d.setGState(new d.GState({ opacity: 0.6 }));
  fill(d, '#020610'); d.rect(0, H * 0.28, W, H * 0.08, 'F');
  d.setGState(new d.GState({ opacity: 1 }));

  // Badge
  fill(d, '#00C3FF'); d.roundedRect(W - 22, 5, 16, 7, 2, 2);
  d.setFont('helvetica', 'bold'); d.setFontSize(5);
  text(d, '#020610'); d.text('03', W - 14, 10, { align: 'center' });

  const cy = H * 0.38;
  d.setFont('helvetica', 'bold'); d.setFontSize(18);
  text(d, '#FFFFFF'); d.text('QUIENES', 10, cy + 5);
  text(d, '#00C3FF'); d.text('SOMOS?', 10, cy + 13);
  fill(d, '#00C3FF'); d.rect(10, cy + 16, 18, 1.2, 'F');
  fill(d, '#FF9900'); d.rect(28, cy + 16, 18, 1.2, 'F');

  if (logo) img(d, logo, W - 30, cy - 3, 20, 15);

  // Caja de texto
  const by = cy + 22;
  d.setGState(new d.GState({ opacity: 0.4 }));
  fill(d, '#0A1929'); d.roundedRect(8, by, W - 16, H - by - 20, 4, 4, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
  stroke(d, '#00C3FF'); d.setLineWidth(0.15); d.roundedRect(8, by, W - 16, H - by - 20, 4, 4, 'S');

  d.setFont('helvetica', 'normal'); d.setFontSize(7);
  text(d, '#A8B8CC');
  const paras = [
    'Somos ATENTO5 SERVICIOS GENERALES E.I.R.L., una empresa peruana especializada en brindar diversas lineas de servicios y suministros.',
    'Tenemos mas de 10 anos de experiencia en el mercado y somos especialistas en servicios generales, instalaciones, mantenimientos y venta de materiales.',
    'Nos adecuamos a las necesidades de cada cliente, brindando soporte y soluciones dinamicas con productos y servicios de alta calidad.',
  ];
  let py = by + 8;
  paras.forEach(p => {
    const lines = d.splitTextToSize(p, W - 26);
    d.text(lines, 14, py);
    py += lines.length * 3.5 + 4;
  });

  // Frase destacada
  d.setGState(new d.GState({ opacity: 0.06 }));
  fill(d, '#FF9900'); d.roundedRect(12, py + 2, W - 24, 10, 3, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
  d.setFont('helvetica', 'bold'); d.setFontSize(6.5);
  text(d, '#FF9900');
  d.text('No somos un simple proveedor, SOMOS TU MEJOR SOCIO ESTRATEGICO.', W / 2, py + 9, { align: 'center' });

  d.setGState(new d.GState({ opacity: 0.3 }));
  fill(d, '#00C3FF'); d.rect(0, H - 3, W / 2, 3, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 3, W / 2, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ MISION Y VISION ════════════
function p4(d, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  // Shapes
  d.setGState(new d.GState({ opacity: 0.03 }));
  fill(d, '#00C3FF'); d.rect(20, 20, 40, 40, 'F');
  fill(d, '#FF9900'); d.rect(W - 60, H - 60, 35, 35, 'F');
  d.setGState(new d.GState({ opacity: 1 }));

  // Badge
  fill(d, '#00C3FF'); d.roundedRect(W - 22, 5, 16, 7, 2, 2);
  d.setFont('helvetica', 'bold'); d.setFontSize(5);
  text(d, '#020610'); d.text('04', W - 14, 10, { align: 'center' });

  // Título
  d.setFont('helvetica', 'bold'); d.setFontSize(18);
  text(d, '#FFFFFF'); d.text('NUESTRA', W / 2 - 8, 28, { align: 'center' });
  text(d, '#00C3FF'); d.text('ESENCIA', W / 2 + 12, 28, { align: 'left' });
  fill(d, '#00C3FF'); d.rect(W / 2 - 12, 31, 12, 1.2, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, 31, 12, 1.2, 'F');

  // Misión
  const cx = 10, cw = W - 20, ch = 45;
  d.setGState(new d.GState({ opacity: 0.4 }));
  fill(d, '#0A1929'); d.roundedRect(cx, 40, cw, ch, 5, 5, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
  stroke(d, '#00C3FF'); d.setLineWidth(0.2); d.roundedRect(cx, 40, cw, ch, 5, 5, 'S');
  fill(d, '#00C3FF'); d.rect(cx, 40, cw, 2, 'F');

  d.setFont('helvetica', 'bold'); d.setFontSize(12);
  text(d, '#00C3FF'); d.text('MISION', W / 2, 52, { align: 'center' });
  d.setFont('helvetica', 'normal'); d.setFontSize(7);
  text(d, '#A8B8CC');
  const ml = d.splitTextToSize('Brindar soluciones integrales de alta calidad adaptadas a las exigencias corporativas y estatales, optimizando los tiempos de respuesta y superando las expectativas de nuestros clientes.', cw - 12);
  d.text(ml, W / 2, 59, { align: 'center' });

  // Visión
  const vy = 40 + ch + 8;
  d.setGState(new d.GState({ opacity: 0.4 }));
  fill(d, '#0A1929'); d.roundedRect(cx, vy, cw, ch, 5, 5, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
  stroke(d, '#FF9900'); d.setLineWidth(0.2); d.roundedRect(cx, vy, cw, ch, 5, 5, 'S');
  fill(d, '#FF9900'); d.rect(cx, vy, cw, 2, 'F');

  d.setFont('helvetica', 'bold'); d.setFontSize(12);
  text(d, '#FF9900'); d.text('VISION', W / 2, vy + 12, { align: 'center' });
  d.setFont('helvetica', 'normal'); d.setFontSize(7);
  text(d, '#A8B8CC');
  const vl = d.splitTextToSize('Ser reconocidos a nivel nacional como la empresa lider en servicios generales y soluciones integrales, destacando por nuestra innovacion y excelencia operativa.', cw - 12);
  d.text(vl, W / 2, vy + 19, { align: 'center' });

  // Valores
  const vals = ['COMPROMISO', 'CALIDAD', 'EFICIENCIA', 'CONFIANZA'];
  const valY = vy + ch + 10;
  const valW = (cw - 12) / 4;
  vals.forEach((v, i) => {
    const vx = cx + i * (valW + 4);
    const c = i % 2 === 0 ? '#00C3FF' : '#FF9900';
    d.setGState(new d.GState({ opacity: 0.3 }));
    fill(d, '#0A1929'); d.roundedRect(vx, valY, valW, 16, 3, 3, 'F');
    d.setGState(new d.GState({ opacity: 1 }));
    stroke(d, c); d.setLineWidth(0.15); d.roundedRect(vx, valY, valW, 16, 3, 3, 'S');
    d.setFont('helvetica', 'bold'); d.setFontSize(6);
    text(d, c); d.text(v, vx + valW / 2, valY + 8, { align: 'center' });
    fill(d, c); d.rect(vx + valW / 2 - 5, valY + 11, 10, 0.8, 'F');
  });

  d.setGState(new d.GState({ opacity: 0.3 }));
  fill(d, '#00C3FF'); d.rect(0, H - 3, W / 2, 3, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 3, W / 2, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ POR QUE ELEGIRNOS ════════════
function p5(d, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  fill(d, '#00C3FF'); d.roundedRect(W - 22, 5, 16, 7, 2, 2);
  d.setFont('helvetica', 'bold'); d.setFontSize(5);
  text(d, '#020610'); d.text('05', W - 14, 10, { align: 'center' });

  d.setFont('helvetica', 'bold'); d.setFontSize(18);
  text(d, '#FFFFFF'); d.text('POR QUE', W / 2 - 8, 25, { align: 'center' });
  text(d, '#00C3FF'); d.text('ELEGIRNOS?', W / 2 + 12, 25, { align: 'left' });
  fill(d, '#00C3FF'); d.rect(W / 2 - 12, 28, 12, 1.2, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, 28, 12, 1.2, 'F');

  d.setFont('helvetica', 'normal'); d.setFontSize(7);
  text(d, '#7A8DA6');
  d.text('Nuestra ventaja diferencial se basa en un enfoque integral orientado a resultados.', W / 2, 36, { align: 'center' });

  const items = [
    { t: 'EXPERIENCIA', d: 'Mas de 10 anos con los mas altos estandares.', c: '#00C3FF' },
    { t: 'SOPORTE 24/7', d: 'Acompanamiento constante tecnico.', c: '#FF9900' },
    { t: 'CALIDAD GARANT.', d: 'Mejores materiales y metodologias probadas.', c: '#00C3FF' },
    { t: 'SOLUCION INTEGRAL', d: 'Centralizamos multiples requerimientos.', c: '#FF9900' },
  ];
  const cw = (W - 26) / 2, ch = 35, sx = 8, sy = 44;
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (cw + 8), y = sy + row * (ch + 6);
    d.setGState(new d.GState({ opacity: 0.4 }));
    fill(d, '#0A1929'); d.roundedRect(x, y, cw, ch, 4, 4, 'F');
    d.setGState(new d.GState({ opacity: 1 }));
    stroke(d, it.c); d.setLineWidth(0.15); d.roundedRect(x, y, cw, ch, 4, 4, 'S');
    fill(d, it.c); d.rect(x, y, cw, 1.5, 'F');
    d.setFont('helvetica', 'bold'); d.setFontSize(8);
    text(d, '#FFFFFF'); d.text(it.t, x + cw / 2, y + 10, { align: 'center' });
    d.setFont('helvetica', 'normal'); d.setFontSize(6);
    text(d, '#7A8DA6');
    const lines = d.splitTextToSize(it.d, cw - 10);
    d.text(lines, x + cw / 2, y + 17, { align: 'center' });
  });

  // Banner
  const by = sy + 2 * (ch + 6) + 6;
  d.setGState(new d.GState({ opacity: 0.06 }));
  fill(d, '#00C3FF'); d.roundedRect(8, by, W - 16, 12, 4, 4, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
  stroke(d, '#00C3FF'); d.setLineWidth(0.15); d.roundedRect(8, by, W - 16, 12, 4, 4, 'S');
  d.setFont('helvetica', 'bold'); d.setFontSize(8);
  text(d, '#FFFFFF');
  d.text('EL ALIADO ESTRATEGICO QUE TU EMPRESA NECESITA', W / 2, by + 8, { align: 'center' });

  d.setGState(new d.GState({ opacity: 0.3 }));
  fill(d, '#00C3FF'); d.rect(0, H - 3, W / 2, 3, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 3, W / 2, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ SERVICIOS ════════════
function pSvc(d, svcs, logo, cache, idx, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  d.setFont('helvetica', 'bold'); d.setFontSize(14);
  text(d, '#FFFFFF'); d.text('NUESTROS', 10, 14);
  text(d, '#00C3FF'); d.text('SERVICIOS', 38, 14);
  fill(d, '#00C3FF'); d.rect(10, 17, 16, 1.2, 'F');
  fill(d, '#FF9900'); d.rect(26, 17, 16, 1.2, 'F');

  const pg = idx + 6;
  fill(d, '#00C3FF'); d.roundedRect(W - 22, 5, 16, 7, 2, 2);
  d.setFont('helvetica', 'bold'); d.setFontSize(5);
  text(d, '#020610'); d.text(pg < 10 ? '0' + pg : '' + pg, W - 14, 10, { align: 'center' });

  const cw = (W - 26) / 2, ch = 70, sx = 8, sy = 24;
  svcs.forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (cw + 8), y = sy + row * (ch + 5);
    stroke(d, '#00C3FF'); d.setLineWidth(0.15); d.roundedRect(x, y, cw, ch, 4, 4, 'S');
    const ih = ch * 0.5;
    if (cache[s.key]) img(d, cache[s.key], x + 0.5, y + 0.5, cw - 1, ih - 1);
    else { fill(d, '#0A1929'); d.rect(x + 0.5, y + 0.5, cw - 1, ih - 1, 'F'); }
    fill(d, '#020610'); d.rect(x, y + ih, cw, ch - ih, 'F');
    fill(d, '#FF9900'); d.rect(x + cw / 2 - 4, y + ih + 3, 8, 1, 'F');
    d.setFont('helvetica', 'bold'); d.setFontSize(7);
    text(d, '#FFFFFF'); d.text(s.title.toUpperCase(), x + cw / 2, y + ih + 10, { align: 'center' });
    d.setFont('helvetica', 'normal'); d.setFontSize(5.5);
    text(d, '#7A8DA6');
    const lines = d.splitTextToSize(s.description, cw - 8);
    d.text(lines, x + cw / 2, y + ih + 15, { align: 'center' });
  });

  if (logo) img(d, logo, 10, H - 12, 12, 8);
  d.setFont('helvetica', 'bold'); d.setFontSize(5);
  text(d, '#3A4A5E'); d.text('ATENTO5 SERVICIOS GENERALES', W - 10, H - 6, { align: 'right' });

  d.setGState(new d.GState({ opacity: 0.3 }));
  fill(d, '#00C3FF'); d.rect(0, H - 2, W / 2, 2, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 2, W / 2, 2, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ CONTACTO ════════════
function pContact(d, logo, W, H) {
  fill(d, '#020610'); d.rect(0, 0, W, H, 'F');

  d.setGState(new d.GState({ opacity: 0.03 }));
  fill(d, '#00C3FF'); d.rect(0, 0, W * 0.35, H * 0.35, 'F');
  fill(d, '#FF9900'); d.rect(W * 0.65, H * 0.65, W * 0.35, H * 0.35, 'F');
  d.setGState(new d.GState({ opacity: 1 }));

  // Círculos concéntricos
  d.setLineWidth(0.1); stroke(d, '#00C3FF');
  d.setGState(new d.GState({ opacity: 0.03 }));
  d.circle(W / 2, H * 0.32, 80, 'S');
  d.circle(W / 2, H * 0.32, 110, 'S');
  d.setGState(new d.GState({ opacity: 1 }));

  if (logo) img(d, logo, W / 2 - 22, 40, 44, 40);

  d.setFont('helvetica', 'bold'); d.setFontSize(32);
  text(d, '#00C3FF'); d.text('ATENTO5', W / 2, 100, { align: 'center' });
  d.setFont('helvetica', 'normal'); d.setFontSize(9);
  text(d, '#7A8DA6'); d.text('SERVICIOS GENERALES E.I.R.L.', W / 2, 110, { align: 'center' });
  fill(d, '#FF9900'); d.rect(W / 2 - 14, 114, 28, 1.5, 'F');

  d.setFont('helvetica', 'bold'); d.setFontSize(15);
  text(d, '#FFFFFF'); d.text('CONTACTANOS', W / 2, 128, { align: 'center' });

  const contacts = [
    { l: 'TELEFONO', v: '+51 955 295 390' },
    { l: 'TELEFONO 2', v: '+51 928 006 765' },
    { l: 'CORREO', v: 'contacto@atento5.com' },
    { l: 'UBICACION', v: 'Lima, Peru' },
  ];
  const cw = (W - 26) / 2, ch = 28, sx = 8, sy = 138;
  contacts.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx + col * (cw + 8), y = sy + row * (ch + 6);
    d.setGState(new d.GState({ opacity: 0.45 }));
    fill(d, '#0A1929'); d.roundedRect(x, y, cw, ch, 5, 5, 'F');
    d.setGState(new d.GState({ opacity: 1 }));
    stroke(d, '#00C3FF'); d.setLineWidth(0.15); d.roundedRect(x, y, cw, ch, 5, 5, 'S');
    d.setFont('helvetica', 'bold'); d.setFontSize(4.5);
    text(d, '#4A5A6E'); d.text(c.l, x + cw / 2, y + 10, { align: 'center' });
    d.setFontSize(7.5); text(d, '#FFFFFF'); d.text(c.v, x + cw / 2, y + 19, { align: 'center' });
  });

  // Redes sociales
  const colors = ['#1877F2', '#FD1D1D', '#000000', '#25D366'];
  const sY = sy + 2 * (ch + 6) + 12;
  const sX = W / 2 - (colors.length * 10) / 2;
  colors.forEach((col, i) => {
    fill(d, col); d.circle(sX + i * 10 + 4, sY, 4, 'F');
    stroke(d, '#FFFFFF'); d.setLineWidth(0.15); d.circle(sX + i * 10 + 4, sY, 4, 'S');
  });

  d.setFont('helvetica', 'bold'); d.setFontSize(6);
  text(d, '#5A6A7E'); d.text('ATENTO5 SERVICIOS GENERALES E.I.R.L.', W / 2, sY + 15, { align: 'center' });
  d.setFont('helvetica', 'normal'); d.setFontSize(5);
  text(d, '#3A4A5E'); d.text('Tu socio estrategico en servicios integrales', W / 2, sY + 21, { align: 'center' });

  d.setGState(new d.GState({ opacity: 0.5 }));
  fill(d, '#00C3FF'); d.rect(0, H - 3, W / 2, 3, 'F');
  fill(d, '#FF9900'); d.rect(W / 2, H - 3, W / 2, 3, 'F');
  d.setGState(new d.GState({ opacity: 1 }));
}

// ════════════ EXPORTAR ════════════
export async function generateBrochurePDF(servicesData, logoUrl, bgUrl, onProgress) {
  onProgress(0);

  const logoImg = await loadImg(logoUrl); onProgress(8); await sleep(40);
  const bgImg = await loadImg(bgUrl); onProgress(14); await sleep(40);

  const cache = {};
  for (let i = 0; i < servicesData.length; i++) {
    cache[`svc_${i}`] = await loadImg(servicesData[i].img);
    onProgress(14 + Math.floor((i / servicesData.length) * 40));
    if (i % 4 === 3) await sleep(30);
  }

  onProgress(57); await sleep(60);

  const d = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;

  p1(d, logoImg, W, H); onProgress(62); await sleep(40);
  d.addPage(); p2(d, servicesData.length, W, H); onProgress(66); await sleep(40);
  d.addPage(); p3(d, logoImg, bgImg, W, H); onProgress(70); await sleep(40);
  d.addPage(); p4(d, W, H); onProgress(74); await sleep(40);
  d.addPage(); p5(d, W, H); onProgress(78); await sleep(40);

  for (let i = 0; i < servicesData.length; i += 4) {
    d.addPage();
    const svcs = servicesData.slice(i, i + 4).map((s, j) => ({
      title: s.title, description: s.description, key: `svc_${i + j}`
    }));
    pSvc(d, svcs, logoImg, cache, Math.floor(i / 4), W, H);
    onProgress(78 + Math.floor(((i + 4) / servicesData.length) * 17));
    await sleep(40);
  }

  d.addPage(); pContact(d, logoImg, W, H); onProgress(98); await sleep(40);

  const blob = d.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'ATENTO5_Brochure.pdf';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  onProgress(100);
}
