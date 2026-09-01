import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';
import { Download, Plus, Trash2, Building2, User, FileText, Palette, ChevronLeft, Check, Calculator } from 'lucide-react';
import logo from '../assets/Logo Atento5.png';

const EditableField = ({ value, onChange, placeholder, style, prefix = '' }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      const expectedText = prefix + (value || placeholder);
      if (divRef.current.textContent !== expectedText) {
        divRef.current.textContent = expectedText;
      }
    }
  }, [value, placeholder, prefix]);

  return (
    <div
      ref={divRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onBlur={(e) => {
        let text = e.currentTarget.textContent;
        if (prefix && text.startsWith(prefix)) {
          text = text.substring(prefix.length);
        }
        if (text === placeholder) {
          onChange('');
        } else {
          onChange(text);
        }
      }}
      onFocus={(e) => {
        let text = e.currentTarget.textContent;
        if (prefix && text.startsWith(prefix)) {
          text = text.substring(prefix.length);
        }
        if (text === placeholder) {
          e.currentTarget.textContent = prefix;
        }
      }}
      style={{ outline: 'none', minHeight: '1.5em', ...style }}
    />
  );
};

const QuotationGenerator = () => {
  // --- Estados Iniciales Basados en "Cotizacion Atento5.pdf" ---
  const [header, setHeader] = useState(() => {
    const getNextQuotationNumber = () => {
      const today = new Date();
      const year = today.getFullYear().toString().slice(-2);
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const datePrefix = `${year}-${month}-${day}`;
      
      const lastData = JSON.parse(localStorage.getItem('quotationCounter') || '{}');
      let nextNumber = 1;
      if (lastData.datePrefix === datePrefix && lastData.number) {
        nextNumber = lastData.number + 1;
      }
      return `${datePrefix}-${nextNumber.toString().padStart(3, '0')}`;
    };
    return {
      titulo: 'PRESUPUESTO DE SERVICIO DE TRANSPORTE DE CARGA',
      codigo: 'TYLROV-014-01',
      revision: '02',
      numero: getNextQuotationNumber() // Se generará automáticamente
    };
  });

  const [cliente, setCliente] = useState({
    senores: 'Señores:',
    nombre: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
    atencion: 'Corina Añorga'
  });

  const [intro, setIntro] = useState({
    saludo: 'Estimados Señores:',
    descripcion: 'De acuerdo con su solicitud presentamos nuestra propuesta económica según detalle de ruta:'
  });

  const [items, setItems] = useState([
    { id: 1, tipoUnidad: 'Remolcador / Plataforma hasta 32 TM', ruta: 'Lurin a Trujillo', descripcion: 'Estructuras', total: '3,600.00' },
    { id: 2, tipoUnidad: 'Remolcador / Plataforma hasta 32 TM', ruta: 'Lurin a Chepen', descripcion: 'Estructuras', total: '4,400.00' }
  ]);

  const [condiciones, setCondiciones] = useState([
    'No Incluye I.G.V.',
    'Tiempo libre de carga y descarga 8 horas.',
    'Permiso para ingreso a todos los almacenes. (no puertos)',
    'Unidades equipadas con todo lo esencial para la carga.',
    'Sistema GPS 24/7.',
    'Todos los seguros y requisitos para personal.'
  ]);

  const [cierre, setCierre] = useState({
    formaPago: 'contado',
    despedidaTexto: 'Sin más por el momento quedamos atentos a cualquier consulta que estime conveniente.',
    atentamente: 'Atentamente,',
    firmaEmpresa: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
    firmaNombre: 'Juan Ampuero',
    firmaCargo: 'Gerente General',
    mostrarSello: true,
    firmaImagen: '', // base64 string for signature image
    firmaZoom: 1,    // default zoom
    firmaX: 0,       // default X translation
    firmaY: 0,       // default Y translation
    firmaAncho: 55,  // default width in mm
    firmaAlto: 35    // default height in mm
  });

  const [emisor, setEmisor] = useState({
    nombre: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
    ruc: '20612345678',
    direccion: 'Dirección Fiscal: Asoc. Villa el Rosario, MZ D, Lote 1, Calle 3, Chaclacayo, Lima - Lima',
    base: 'Base Chimbote: Av. NN 11960 Urb. Los Álamos Nuevo Chimbote - Santa'
  });

  const handleSignatureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type === 'application/pdf') {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        const pdfjsWorker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const pdf = await loadingTask;
        const page = await pdf.getPage(1);
        const scale = 5.0; // Ultra high resolution rendering for signature import
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
        const imageData = canvas.toDataURL('image/png');
        setCierre(prev => ({
          ...prev,
          firmaImagen: imageData,
          firmaZoom: 1,
          firmaX: 0,
          firmaY: 0
        }));
      } catch (error) {
        console.error('Error reading PDF:', error);
        alert('No se pudo leer el PDF. Por favor, intente con otro archivo.');
      }
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCierre(prev => ({
          ...prev,
          firmaImagen: reader.result,
          firmaZoom: 1,
          firmaX: 0,
          firmaY: 0
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [showCalculations, setShowCalculations] = useState(true);
  const [descuento, setDescuento] = useState('0.00');

  const previewRef = useRef();

  // --- Manejo de Items de la Tabla ---
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), tipoUnidad: '', ruta: '', descripcion: '', total: '' }
    ]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // --- Manejo de Condiciones/Viñetas ---
  const addCondicion = () => {
    setCondiciones([...condiciones, 'Nueva condición o término']);
  };

  const removeCondicion = (index) => {
    setCondiciones(condiciones.filter((_, i) => i !== index));
  };

  const handleCondicionChange = (index, value) => {
    const updated = [...condiciones];
    updated[index] = value;
    setCondiciones(updated);
  };

  // --- Cálculos Automáticos de Totales ---
  const parseAmount = (val) => {
    if (!val) return 0;
    // Remueve símbolos de moneda, comas y espacios, y parsea a float
    const clean = val.toString().replace(/[^\d.]/g, '');
    return parseFloat(clean) || 0;
  };

  const subtotal = items.reduce((acc, item) => acc + parseAmount(item.total), 0);
  const descuentoValue = parseAmount(descuento);
  const subtotalConDescuento = subtotal - descuentoValue;
  const igv = subtotalConDescuento * 0.18;
  const total = subtotalConDescuento + igv;

  const formatCurrency = (val) => 'S/ ' + (val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // --- Exportación a PDF (Pixel-perfect A4) ---
  const handleExportPDF = () => {
    // Actualizar el contador en localStorage ANTES de descargar
    // Extraer el número del formato 'YY-MM-DD-NNN'
    const parts = header.numero ? header.numero.split('-') : [];
    if (parts.length === 4) {
      const datePrefix = `${parts[0]}-${parts[1]}-${parts[2]}`;
      const numberFromHeader = parseInt(parts[3], 10);
      if (numberFromHeader > 0) {
        localStorage.setItem('quotationCounter', JSON.stringify({ datePrefix: datePrefix, number: numberFromHeader }));
        
        // Actualizar el número de cotización para el siguiente
        const nextNumber = numberFromHeader + 1;
        const nextQuotationNumber = `${datePrefix}-${nextNumber.toString().padStart(3, '0')}`;
        setHeader({...header, numero: nextQuotationNumber});
      }
    }

    setIsExporting(true);

    setTimeout(() => {
      const originalElement = previewRef.current;
      if (!originalElement) return;

      // Clonar el nodo del preview para renderizar en segundo plano
      const clonedElement = originalElement.cloneNode(true);

      // Crear un contenedor fuera de pantalla (off-screen) sin escala transformadora
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '210mm';
      container.style.height = '297mm';
      container.style.overflow = 'hidden';
      container.style.background = 'white';

      container.appendChild(clonedElement);
      document.body.appendChild(container);

      html2pdf().set({
        margin: 0,
        filename: 'Cotizacion_' + (header.numero || '000') + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      }).from(clonedElement).save()
      .then(() => {
        // Limpiar el contenedor del DOM y restaurar estado
        document.body.removeChild(container);
        setIsExporting(false);
      })
      .catch((err) => {
        console.error('Error al exportar PDF:', err);
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        setIsExporting(false);
      });
    }, 100);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Outfit', sans-serif", backgroundColor: '#050B14' }}>
      <div style={{
        width: '95vw',
        height: '90vh',
        borderRadius: '24px',
        border: '4px solid #3CB4FF',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 40px rgba(60, 180, 255, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: '#1e293b',
        backgroundImage: 'linear-gradient(rgba(60, 180, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(60, 180, 255, 0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px', borderBottom: '1px solid rgba(60, 180, 255, 0.35)', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>
          <Link to="/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3CB4FF', textDecoration: 'none', fontSize: '14px', fontWeight: '700', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#3CB4FF'}>
            <ChevronLeft size={20} />
            <span>Regresar al Inicio</span>
          </Link>
          <div style={{ marginLeft: 'auto', fontSize: '18px', fontWeight: '900', color: 'white', letterSpacing: '1px' }}>GENERADOR DE COTIZACIÓN</div>
        </nav>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <PreviewPanel 
            previewRef={previewRef}
            header={header}
            cliente={cliente}
            intro={intro}
            items={items}
            condiciones={condiciones}
            cierre={cierre}
            emisor={emisor}
            subtotal={subtotal}
            descuentoValue={descuentoValue}
            igv={igv}
            total={total}
            formatCurrency={formatCurrency}
            showCalculations={showCalculations}
            handleSignatureUpload={handleSignatureUpload}
            isExporting={isExporting}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PANEL DE EDICIÓN (Izquierda)
// ==========================================
// ==========================================
// VISTA PREVIA (Derecha)
// ==========================================
const PreviewPanel = ({
  previewRef,
  header,
  cliente,
  intro,
  items,
  condiciones,
  cierre,
  emisor,
  subtotal,
  descuentoValue,
  igv,
  total,
  formatCurrency,
  showCalculations,
  handleSignatureUpload,
  isExporting
}) => {
  const [scale, setScale] = useState(0.65);
  const [hoverSignature, setHoverSignature] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      const availableHeight = window.innerHeight - 130;
      const sheetHeight = 1122.5; // 297mm in pixels at 96dpi
      let newScale = availableHeight / sheetHeight;
      
      const availableWidth = window.innerWidth * 0.6 - 48; // 60% width minus padding
      const sheetWidth = 793.7; // 210mm in pixels at 96dpi
      const widthScale = availableWidth / sheetWidth;
      
      newScale = Math.min(newScale, widthScale, 1.0);
      setScale(newScale);
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#0a0e17', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', marginBottom: '12px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '1px' }}>VISTA PREVIA DEL PRESUPUESTO</h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Se ajusta automáticamente a una sola página A4</p>
      </div>

      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 'calc(100% - 110px)',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '210mm',
          height: '297mm',
          flexShrink: 0,
          marginBottom: `-${1122.5 * (1 - scale)}px`
        }}>
          {/* Hoja A4 de la Cotización */}
          <div style={{ background: 'white', overflow: 'hidden', width: '210mm', height: '297mm', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Contenedor del PDF */}
            <div ref={previewRef} style={{ background: 'white', color: 'black', width: '210mm', height: '297mm', padding: '9mm 12mm 9mm 12mm', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
              
              {/* CABECERA INDUSTRIAL (3 Columnas con Bordes Modernos y Destacados) */}
              <div style={{ display: 'flex', width: '100%', height: '34mm', border: '2px solid #1e293b', borderRadius: '8px', overflow: 'hidden', boxSizing: 'border-box', marginBottom: '8mm', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                {/* Columna Izquierda: Logo */}
                <div style={{
                  width: '35%',
                  borderRight: '2px solid #1e293b',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 10px',
                  boxSizing: 'border-box',
                  position: 'relative'
                }}>
                  {/* Barra lateral de acento degradado */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, #3CB4FF, #D21414)' }} />
                  <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ 
                      maxWidth: '90%',
                      maxHeight: '90%',
                      objectFit: 'contain', 
                      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))',
                      display: 'block'
                    }} 
                  />
                </div>
                {/* Columna Central: Título */}
                <div style={{ width: '40%', borderRight: '2px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', textAlign: 'center', boxSizing: 'border-box' }}>
                  <h1 style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', margin: 0, lineHeight: '1.4', textTransform: 'uppercase', letterSpacing: '0.2px', fontFamily: "'Arial', sans-serif" }}>
                    {header.titulo || 'PRESUPUESTO DE SERVICIO DE TRANSPORTE'}
                  </h1>
                </div>
                {/* Columna Derecha: Código/Revisión/Número */}
                <div style={{ width: '25%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#f8fafc' }}>
                  <div style={{ flex: 1, display: 'flex', borderBottom: '2px solid #1e293b', boxSizing: 'border-box' }}>
                    <div style={{ width: '45%', borderRight: '2px solid #1e293b', fontSize: '8.5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', paddingLeft: '6px', color: '#475569' }}>CÓDIGO:</div>
                    <div style={{ width: '55%', fontSize: '9px', display: 'flex', alignItems: 'center', paddingLeft: '6px', fontWeight: '800', color: '#0f172a' }}>{header.codigo}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', borderBottom: '2px solid #1e293b', boxSizing: 'border-box' }}>
                    <div style={{ width: '45%', borderRight: '2px solid #1e293b', fontSize: '8.5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', paddingLeft: '6px', color: '#475569' }}>REVISIÓN:</div>
                    <div style={{ width: '55%', fontSize: '9px', display: 'flex', alignItems: 'center', paddingLeft: '6px', fontWeight: '800', color: '#0f172a' }}>{header.revision}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', boxSizing: 'border-box' }}>
                    <div style={{ width: '45%', borderRight: '2px solid #1e293b', fontSize: '8.5px', fontWeight: 'bold', display: 'flex', alignItems: 'center', paddingLeft: '6px', color: '#475569' }}>COTIZACIÓN:</div>
                    <div style={{ width: '55%', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', paddingLeft: '6px', color: '#D21414' }}>{header.numero}</div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN SEÑORES / CLIENTE - EDITABLE */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '6mm', fontSize: '11.5px', lineHeight: '1.3', flexShrink: 0 }}>
                <EditableField
                  value={cliente.senores}
                  onChange={(val) => setCliente({...cliente, senores: val})}
                  placeholder="Señores:"
                  style={{ fontWeight: 'bold', color: '#000', padding: '2px 0' }}
                />
                <EditableField
                  value={cliente.nombre}
                  onChange={(val) => setCliente({...cliente, nombre: val})}
                  placeholder="Nombre de la empresa"
                  style={{ fontWeight: 'bold', color: '#000', fontSize: '12px', textTransform: 'uppercase', padding: '2px 0' }}
                />
                <EditableField
                  value={cliente.atencion}
                  onChange={(val) => setCliente({...cliente, atencion: val})}
                  placeholder=""
                  prefix="Atencion: "
                  style={{ color: '#111', padding: '2px 0' }}
                />
              </div>

              {/* TEXTO INTRODUCTORIO */}
              <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '5mm', lineHeight: '1.4', color: '#111', flexShrink: 0 }}>
                {intro.saludo && <span style={{ fontWeight: 'bold', color: '#000' }}>{intro.saludo}</span>}
                {intro.descripcion && <span>{intro.descripcion}</span>}
              </div>

              {/* TABLA DE DETALLE DE RUTA / SERVICIOS */}
              <div style={{ flex: 1, minHeight: '110px', marginBottom: '6mm', overflow: 'hidden', flexShrink: 0 }}>
                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', border: '1px solid #000', boxSizing: 'border-box' }}>
                  <thead>
                    <tr style={{ background: '#3577b2', color: 'white', borderBottom: '1px solid #000' }}>
                      <th style={{ padding: '7px 5px', textAlign: 'center', borderRight: '1px solid #000', width: '8%', fontWeight: 'bold' }}>Ítem</th>
                      <th style={{ padding: '7px 7px', textAlign: 'left', borderRight: '1px solid #000', width: '38%', fontWeight: 'bold' }}>Tipo de Unidad</th>
                      <th style={{ padding: '7px 7px', textAlign: 'left', borderRight: '1px solid #000', width: '25%', fontWeight: 'bold' }}>Ruta</th>
                      <th style={{ padding: '7px 7px', textAlign: 'left', borderRight: '1px solid #000', width: '17%', fontWeight: 'bold' }}>Descripción Contenido</th>
                      <th style={{ padding: '7px 7px', textAlign: 'center', width: '12%', fontWeight: 'bold' }}>Total por Unidad</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: '#000' }}>
                    {items.map((item, index) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #000' }}>
                        <td style={{ padding: '7px 5px', textAlign: 'center', borderRight: '1px solid #000', fontWeight: 'normal', verticalAlign: 'middle' }}>{index + 1}</td>
                        <td style={{ padding: '7px 7px', textAlign: 'left', borderRight: '1px solid #000', verticalAlign: 'middle' }}>{item.tipoUnidad || '-'}</td>
                        <td style={{ padding: '7px 7px', textAlign: 'left', borderRight: '1px solid #000', verticalAlign: 'middle' }}>{item.ruta || '-'}</td>
                        <td style={{ padding: '7px 7px', textAlign: 'left', borderRight: '1px solid #000', verticalAlign: 'middle' }}>{item.descripcion || '-'}</td>
                        <td style={{ padding: '7px 7px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          {item.total ? (
                            (() => {
                              let clean = item.total.toString().trim();
                              if (!clean.startsWith('S/')) {
                                clean = 'S/ ' + clean;
                              }
                              if (!clean.toLowerCase().includes('+ igv') && !clean.toLowerCase().includes('+igv')) {
                                clean = clean + ' + IGV';
                              }
                              return clean;
                            })()
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TÉRMINOS Y CÁLCULOS (Lado a Lado para Máxima Visualización y Distribución) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8mm', marginBottom: '6mm', flexShrink: 0 }}>
                {/* Columna Izquierda: Condiciones / Viñetas */}
                <div style={{ width: showCalculations ? '58%' : '100%', display: 'flex', flexDirection: 'column', gap: '3mm' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {condiciones.map((cond, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '10px', color: '#000', lineHeight: '1.3' }}>
                        <span style={{ fontSize: '9px', marginTop: '1px', flexShrink: 0 }}>•</span>
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                  {cierre.formaPago && (
                    <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#000' }}>
                      <span>Forma de Pago: {cierre.formaPago}</span>
                    </div>
                  )}
                </div>

                {/* Columna Derecha: Cuadro de Cálculos Automáticos Estilo Premium */}
                {showCalculations && (
                  <div style={{ width: '38%', display: 'flex', flexDirection: 'column', border: '1.5px solid #1e293b', borderRadius: '6px', overflow: 'hidden', fontSize: '11px', boxSizing: 'border-box', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid #cbd5e1', background: '#f8fafc' }}>
                      <span style={{ fontWeight: '600', color: '#475569' }}>SUBTOTAL</span>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>{formatCurrency(subtotal)}</span>
                    </div>
                    {descuentoValue > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid #cbd5e1', background: '#f8fafc', color: '#D21414' }}>
                        <span style={{ fontWeight: '600' }}>DESCUENTO</span>
                        <span style={{ fontWeight: '700' }}>- {formatCurrency(descuentoValue)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', borderBottom: '1px solid #cbd5e1', background: '#f8fafc' }}>
                      <span style={{ fontWeight: '600', color: '#475569' }}>I.G.V. (18%)</span>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>{formatCurrency(igv)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#3577b2', color: '#fff' }}>
                      <span style={{ fontWeight: 'bold' }}>TOTAL GENERAL</span>
                      <span style={{ fontWeight: 'bold' }}>{formatCurrency(total)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DESPEDIDA */}
              {cierre.despedidaTexto && (
                <div style={{ fontSize: '11px', color: '#000', lineHeight: '1.4', marginBottom: '6mm', flexShrink: 0 }}>
                  <span>{cierre.despedidaTexto}</span>
                </div>
              )}

              {/* ATENTAMENTE Y FIRMA */}
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '11px', color: '#000', marginBottom: '2.5mm', flexShrink: 0, position: 'relative', alignItems: 'center', textAlign: 'center' }}>
                <span style={{ marginBottom: '2.5mm' }}>{cierre.atentamente}</span>
                <div style={{ 
                  width: `${cierre.firmaAncho || 45}mm`,
                  height: `${cierre.firmaAlto || 45}mm`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  boxSizing: 'border-box', 
                  position: 'relative',
                  border: isExporting ? 'none' : '1.5px dashed #3CB4FF',
                  borderRadius: '6px',
                  background: isExporting ? 'transparent' : 'rgba(60, 180, 255, 0.02)',
                  transition: 'border 0.2s ease',
                  padding: '2px'
                }}>
                  {cierre.firmaImagen ? (
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        overflow: 'visible',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}
                    >
                      <img
                        src={cierre.firmaImagen}
                        alt="Firma Digital"
                        style={{
                          position: 'absolute',
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: 'auto',
                          height: 'auto',
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${cierre.firmaX || 0}px), calc(-50% + ${cierre.firmaY || 0}px)) scale(${cierre.firmaZoom || 1})`,
                          transformOrigin: 'center center',
                          display: 'block',
                          imageRendering: 'auto'
                        }}
                      />
                    </div>
                  ) : cierre.mostrarSello ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <div style={{ fontSize: '7px', color: '#3577b2', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>Firmado Digitalmente por</div>
                      <div style={{ fontSize: '8px', color: '#D21414', fontWeight: '900', margin: '1px 0', textTransform: 'uppercase' }}>{cierre.firmaEmpresa}</div>
                      <div style={{ fontSize: '7.5px', color: '#000', fontWeight: 'bold' }}>Representante: {cierre.firmaNombre}</div>
                      <div style={{ fontSize: '6.5px', color: '#555', fontStyle: 'italic' }}>Autenticidad Garantizada</div>
                    </div>
                  ) : (
                    <div style={{ width: '100%', borderBottom: '1px solid #333', marginBottom: '2px' }} />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '2.5mm', zIndex: 11, alignItems: 'center', textAlign: 'center', width: '100%' }}>
                  <span style={{ fontWeight: 'bold', color: '#000', fontSize: '11px' }}>{cierre.firmaNombre}</span>
                  <span style={{ fontSize: '10px', color: '#444' }}>{cierre.firmaCargo}</span>
                  <span style={{ fontSize: '9px', color: '#666', fontWeight: 'bold' }}>{cierre.firmaEmpresa}</span>
                </div>
              </div>

              {/* PIE DE PÁGINA (DATOS FISCALES DEL EMISOR) */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                {/* Línea horizontal en rojo oscuro/guinda */}
                <div style={{ borderTop: '2.5px solid #a61f1f', width: '100%', marginBottom: '4px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontSize: '9px', color: '#222', lineHeight: '1.4', fontWeight: '500' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '9.5px', color: '#000' }}>{emisor.nombre}</span>
                  <span>RUC: {emisor.ruc}</span>
                  <span>{emisor.direccion}</span>
                  <span>{emisor.base}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TARJETA DE SECCIÓN DEL EDITOR
// ==========================================
const SectionCard = ({ num, title, icon, color, children }) => (
  <div style={{ background: 'linear-gradient(145deg, #09101d 0%, #060b13 100%)', border: '1px solid rgba(60, 180, 255, 0.12)', borderRadius: '16px', overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'linear-gradient(90deg, rgba(60, 180, 255, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)', borderBottom: '1px solid rgba(60, 180, 255, 0.15)' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: 'linear-gradient(135deg, #3CB4FF, #D21414)', borderRadius: '6px', fontSize: '12px', fontWeight: '900', color: '#fff', marginRight: '10px' }}>{num}</span>
      <span style={{ color: color, marginRight: '8px', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '0.8px', margin: 0 }}>{title}</h3>
    </div>
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(0, 0, 0, 0.15)' }}>
      {children}
    </div>
  </div>
);

// ==========================================
// CAMPO DE TEXTO DEL EDITOR
// ==========================================
const FieldBox = ({ label, value, onChange, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      style={{ width: '100%', background: 'linear-gradient(135deg, #0a0e17 0%, #0c121e 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '12px 14px', fontSize: '13.5px', color: '#fff', outline: 'none', transition: 'all 0.25s ease', boxSizing: 'border-box' }}
      onFocus={(e) => { e.target.style.borderColor = '#3CB4FF'; e.target.style.boxShadow = '0 0 10px rgba(60, 180, 255, 0.2)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

export default QuotationGenerator;