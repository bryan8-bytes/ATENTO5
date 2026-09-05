import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';
import { Download, ChevronLeft } from 'lucide-react';
import logo from '../assets/Logo Atento5.png';
import firmaAtento5 from '../assets/Firma Atento5.png';
import '../components/ui/BusinessSuite.css';

const EditableField = ({ value, onChange, placeholder, style, bold, center }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      if (divRef.current.textContent !== (value || placeholder)) {
        divRef.current.textContent = value || placeholder;
      }
    }
  }, [value, placeholder]);

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        const text = e.currentTarget.textContent;
        onChange(text === placeholder ? '' : text);
      }}
      onFocus={(e) => {
        if (e.currentTarget.textContent === placeholder) {
          e.currentTarget.textContent = '';
        }
      }}
      style={{
        outline: 'none',
        minHeight: '1.2em',
        cursor: 'text',
        fontWeight: bold ? 700 : 400,
        textAlign: center ? 'center' : 'left',
        ...style,
      }}
    />
  );
};

const FieldBox = ({ label, value, onChange, placeholder, multiline }) => (
  <div style={{ marginBottom: '0.6rem' }}>
    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
    <EditableField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        fontSize: '0.85rem',
        padding: '0.5rem 0.6rem',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#e5e7eb',
        minHeight: multiline ? '60px' : 'auto',
        lineHeight: '1.4',
      }}
    />
  </div>
);

const LetterheadGenerator = () => {
  const [data, setData] = useState({
    nombre: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
    ruc: '20612345678',
    telefono: '+51 955 295 390',
    correo: 'Juan.ampuero@atento5.com',
    direccion: 'Asoc. Villa el Rosario, MZ D, Lote 1, Calle 3, Chaclacoyo, Lima, Perú',
    web: 'www.atento5.com',
    fecha: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: '2-digit' }),
    destinatario: '[Nombre del Cliente / Responsable]',
    asunto: 'Carta de Presentación Corporativa',
    cuerpo: 'Por medio de la presente, nos dirigimos a usted para comunicarle que ATENTO5 SERVICIOS GENERALES E.I.R.L. se encuentra a su disposición para brindarle soluciones integrales en los siguientes rubros:',
    bullets: '• Mantenimiento General\n• Construcción y reparación\n• Gasfitería y electricidad\n• Jardinería y limpieza industrial\n• Servicios de infraestructura corporativa',
    experiencia: 'Contamos con una experiencia de más de 10 años en el mercado peruano, garantizando transparencia técnica, optimización de presupuestos y una capacidad de respuesta inmediata ante cualquier requerimiento.',
    cierre: 'Quedamos atentos a su pronta respuesta. No dude en contactarnos por cualquiera de nuestros canales.',
    firma: 'Juan José Ampuero Torres',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const previewRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      const previewEl = document.querySelector('.preview-panel');
      if (!previewEl) return;
      const inner = previewEl.querySelector('.a4-scroll-area') || previewEl;
      const rect = inner.getBoundingClientRect();
      const availableWidth = Math.max(0, rect.width);
      const availableHeight = Math.max(0, rect.height);
      const sheetHeight = 1122.5;
      const sheetWidth = 793.7;
      const heightScale = availableHeight / sheetHeight;
      const widthScale = availableWidth / sheetWidth;
      const newScale = Math.min(heightScale, widthScale, 1.0);
      setScale(newScale > 0.1 ? newScale : 1);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    const ro = new ResizeObserver(updateScale);
    const panel = document.querySelector('.preview-panel');
    if (panel) ro.observe(panel);
    return () => {
      window.removeEventListener('resize', updateScale);
      ro.disconnect();
    };
  }, []);

  const handleExportPDF = () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = '210mm';
    container.style.height = '297mm';
    container.style.overflow = 'hidden';
    container.style.background = 'white';

    const cloned = previewRef.current.cloneNode(true);
    container.appendChild(cloned);
    document.body.appendChild(container);

    setTimeout(() => {
      html2pdf().set({
        margin: 0,
        filename: 'ATENTO5_Hoja_Membretada.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      }).from(cloned).save()
        .then(() => {
          document.body.removeChild(container);
          setIsExporting(false);
        })
        .catch((err) => {
          console.error('Error al exportar PDF:', err);
          if (document.body.contains(container)) document.body.removeChild(container);
          setIsExporting(false);
        });
    }, 100);
  };

  return (
    <div className="business-shell">
      <div className="business-container">
        <nav className="business-nav">
          <Link to="/home" className="business-nav-back">
            <ChevronLeft size={20} />
            <span>Regresar al Inicio</span>
          </Link>
        <span className="business-nav-title">HOJA MEMBRETADA CORPORATIVA</span>
        </nav>

        <div className="business-body-container">
          {/* === EDITOR PANEL (Izquierdo) === */}
          <div className="business-editor-panel">
            <div className="form-section" style={{ marginBottom: '1rem' }}>
              <h3 className="section-title">INFORMACIÓN CORPORATIVA</h3>
              <FieldBox label="Nombre / Empresa" value={data.nombre} onChange={(v) => setData({ ...data, nombre: v })} placeholder="Nombre de la empresa" />
              <FieldBox label="RUC" value={data.ruc} onChange={(v) => setData({ ...data, ruc: v })} placeholder="RUC" />
              <FieldBox label="Teléfono" value={data.telefono} onChange={(v) => setData({ ...data, telefono: v })} placeholder="Teléfono" />
              <FieldBox label="Email" value={data.correo} onChange={(v) => setData({ ...data, correo: v })} placeholder="Email" />
              <FieldBox label="Dirección" value={data.direccion} onChange={(v) => setData({ ...data, direccion: v })} placeholder="Dirección fiscal" />
              <FieldBox label="Web" value={data.web} onChange={(v) => setData({ ...data, web: v })} placeholder="Sitio web" />
            </div>

            <div className="form-section" style={{ marginBottom: '1rem' }}>
              <h3 className="section-title">CONTENIDO DE LA CARTA</h3>
              <FieldBox label="Asunto" value={data.asunto} onChange={(v) => setData({ ...data, asunto: v })} placeholder="Asunto" />
              <FieldBox label="Destinatario" value={data.destinatario} onChange={(v) => setData({ ...data, destinatario: v })} placeholder="[Nombre del Cliente / Responsable]" />
              <FieldBox label="Cuerpo / Introducción" value={data.cuerpo} onChange={(v) => setData({ ...data, cuerpo: v })} placeholder="Cuerpo..." multiline />
              <FieldBox label="Listado ( bullets separados por salto )" value={data.bullets} onChange={(v) => setData({ ...data, bullets: v })} placeholder="• Item 1" multiline />
              <FieldBox label="Experiencia" value={data.experiencia} onChange={(v) => setData({ ...data, experiencia: v })} placeholder="..." multiline />
              <FieldBox label="Cierre" value={data.cierre} onChange={(v) => setData({ ...data, cierre: v })} placeholder="..." multiline />
              <FieldBox label="Firma (nombre)" value={data.firma} onChange={(v) => setData({ ...data, firma: v })} placeholder="Nombre" />
            </div>

            <div style={{ marginTop: '1rem', paddingBottom: '1rem' }}>
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="editor-btn editor-btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Download size={18} />
                <span>{isExporting ? 'GENERANDO PDF...' : 'DESCARGAR PDF'}</span>
              </button>
            </div>
          </div>

          {/* === PREVIEW PANEL (Derecho, A4) === */}
          <div className="preview-panel">
            <div className="a4-scroll-area" style={{
              width: '100%',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden',
              padding: '4px',
              boxSizing: 'border-box'
            }}>
              <div style={{
                transform: 'scale(' + scale + ')',
                transformOrigin: 'top center',
                width: '210mm',
                height: '297mm',
                flexShrink: 0
              }}>
                {/* HOJA A4 CLARA */}
                <div style={{
                  background: 'white',
                  color: '#000',
                  overflow: 'hidden',
                  width: '210mm',
                  height: '297mm',
                  boxSizing: 'border-box',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                  <div ref={previewRef} style={{
                    background: 'white',
                    color: 'black',
                    width: '210mm',
                    height: '297mm',
                    padding: '18mm 16mm 18mm 16mm',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>

                      {/* ===== CABECERA (Header corporativo) ===== */}
                       <div style={{
                         display: 'flex',
                         justifyContent: 'space-between',
                         alignItems: 'center',
                         width: '100%',
                         borderBottom: '2pt solid #3CB4FF',
                         paddingBottom: '10pt',
                         marginBottom: '16pt',
                         boxSizing: 'border-box',
                         flexShrink: 0
                       }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10pt' }}>
                           <img src={logo} alt="Logo ATENTO5" style={{ height: '60pt' }} />
                           <span style={{ fontWeight: 700, fontSize: '12pt', color: '#1a2332' }}>{data.nombre}</span>
                         </div>
                         <div style={{ fontSize: '8pt', color: '#64748b', textAlign: 'right' }}>
                           <div>RUC: {data.ruc}</div>
                           <div>Tlf: {data.telefono}</div>
                         </div>
                       </div>
                    <div style={{ flex: 1, width: '100%' }}>
                      {/* Fecha */}
                      <div style={{ textAlign: 'right', marginBottom: '16pt', fontSize: '9pt', color: '#334155' }}>{data.fecha}</div>

                      {/* Destinatario */}
                      <div style={{ marginBottom: '12pt', fontSize: '11pt', lineHeight: '1.4' }}>
                        <p style={{ margin: 0 }}>A la atención de:</p>
                        <p style={{ margin: '4pt 0 0 0', fontWeight: 600 }}>{data.destinatario}</p>
                      </div>

                      {/* Asunto centrado */}
                      <div style={{ textAlign: 'center', marginBottom: '20pt' }}>
                        <span style={{ fontSize: '15pt', fontWeight: 800, color: '#D21414', letterSpacing: '0.5pt' }}>{data.asunto}</span>
                      </div>

                      {/* Saludo */}
                      <p style={{ margin: '0 0 12pt 0', fontSize: '11pt' }}>Estimado/a [Nombre]:</p>

                      {/* Cuerpo */}
                      <p style={{ margin: '0 0 14pt 0', fontSize: '11pt', lineHeight: '1.5' }}>{data.cuerpo}</p>

                      {/* Bullets */}
                      <div style={{ margin: '0 0 16pt 0', paddingLeft: '14pt' }}>
                        {data.bullets.split('\n').map((line, i) => (
                          <p key={i} style={{ margin: '3pt 0', fontSize: '11pt', lineHeight: '1.3' }}>{line}</p>
                        ))}
                      </div>

                      {/* Experiencia */}
                      <p style={{ margin: '0 0 16pt 0', fontSize: '11pt', lineHeight: '1.5' }}>{data.experiencia}</p>

                      {/* Cierre */}
                      <p style={{ margin: '0 0 24pt 0', fontSize: '11pt', lineHeight: '1.5' }}>{data.cierre}</p>

                      {/* Firma */}
                      <div style={{ marginTop: '48pt', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 12pt 0', fontSize: '11pt' }}>Atentamente,</p>
                        <div style={{ height: '90pt', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6pt' }}>
                          <img src={firmaAtento5} alt="Firma ATENTO5" style={{ width: '200px', height: '90px', objectFit: 'contain' }} />
                        </div>
                         <div contentEditable
                           suppressContentEditableWarning
                           onBlur={(e) => setData({ ...data, firma: e.currentTarget.textContent || data.firma })}
                           style={{
                             display: 'inline-block',
                             fontSize: '11pt',
                             padding: '4pt 0',
                             borderBottom: '1pt solid #ccc',
                             marginBottom: '4pt',
                             outline: 'none',
                             minHeight: '22pt',
                             textAlign: 'center'
                           }}>
                           {data.firma}
                         </div>
                        <p style={{ margin: 0, fontSize: '9pt', color: '#64748b', textAlign: 'center' }}>Gerente General</p>
                      </div>
                    </div>

                    {/* ===== PIE DE PÁGINA (Footer) ===== */}
                    <div style={{
                      flexShrink: 0,
                      borderTop: '2pt solid #D21414',
                      paddingTop: '8pt'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '8pt',
                        color: '#334155',
                        lineHeight: '1.4'
                      }}>
                        <span>{data.nombre} | RUC: {data.ruc} | Tlf: {data.telefono} | Email: {data.correo} | {data.direccion}</span>
                        <span>{data.web}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterheadGenerator;