import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';
import { Download, Plus, Trash2, Save, Building2, FileText, User, Package, ChevronLeft } from 'lucide-react';
import logo from '../assets/Logo Atento5.png';

const ATENTO5 = {
  nombre: 'ATENTO5 SERVICIOS GENERALES E.I.R.L.',
  ruc: '20612345678',
  direccion: 'Asoc. Villa el Rosario, MZ D, Lote 1, Calle 3, Chaclacayo, Lima, Perú',
  telefono: '+51 955 295 390',
  correo: 'Juan.ampuero@atento5.com',
  web: 'www.atento5.com'
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const PurchaseOrder = () => {
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    const updateScale = () => {
      const availableHeight = window.innerHeight - 220; // Adjusted for padding, header and title margins
      const sheetHeight = 1122.5; // 297mm in pixels at 96dpi
      let newScale = availableHeight / sheetHeight;
      
      const availableWidth = window.innerWidth * 0.60 - 40; // 60% width minus padding
      const sheetWidth = 793.7; // 210mm in pixels at 96dpi
      const widthScale = availableWidth / sheetWidth;
      
      newScale = Math.min(newScale, widthScale, 1.0);
      setScale(newScale);
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const [documento, setDocumento] = useState({
    numero: '',
    fecha: getTodayDate(),
    validezHasta: getFutureDate(7),
    moneda: 'SOLES',
    formaPago: '50% anticipo',
    tipoCambio: '3.75',
    elaboradoPor: 'Juan José Ampuero Torres',
    cargo: 'Gerente General'
  });

  const [proveedor, setProveedor] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const [condiciones, setCondiciones] = useState({
    observaciones: ''
  });

  const [items, setItems] = useState([
    { id: 1, descripcion: '', cantidad: 1, unidad: 'UND', precioUnitario: 0 }
  ]);

  const [firmas, setFirmas] = useState({
    responsable: 'Juan José Ampuero Torres',
    proveedor: '',
    fechaFirma: getTodayDate()
  });

  const previewRef = useRef();

  const agregarItem = () => {
    setItems([...items, { id: Date.now(), descripcion: '', cantidad: 1, unidad: 'UND', precioUnitario: 0 }]);
  };

  const eliminarItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const actualizarItem = (id, campo, valor) => {
    setItems(items.map(item => item.id === id ? { ...item, [campo]: valor } : item));
  };

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0)), 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const formatCurrency = (val) => 'S/ ' + (val || 0).toFixed(2);

  const guardarOrden = () => {
    const ordenCompra = {
      documentoInfo: documento,
      supplier: proveedor,
      items: items,
      totals: { subtotal, igv, total },
      observations: condiciones.observaciones,
      signatures: firmas
    };
    console.log('Orden de compra guardada:', ordenCompra);
    alert('Orden de Compra guardada correctamente');
  };

  const exportarPDF = () => {
    const element = previewRef.current;
    html2pdf().set({
      margin: 0,
      filename: 'OrdenCompra_' + (documento.numero || '000') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    }).from(element).save();
  };

  const inputStyle = {
    width: '100%',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{ height: '100vh', background: '#0f172a', color: 'white', padding: '24px', overflow: 'hidden', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3CB4FF', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            <ChevronLeft size={20} />
            <span>Volver</span>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #3CB4FF, #D21414)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orden de Compra</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={exportarPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #3CB4FF, #8764B2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <Download size={18} />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        <div style={{ width: '40%', flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
            <div style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(60, 180, 255, 0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3CB4FF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} /> Datos del Documento
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>N° Orden de Compra</label>
                  <input type="text" placeholder="OC-001" value={documento.numero} onChange={(e) => setDocumento({...documento, numero: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Fecha de Emisión</label>
                  <input type="date" value={documento.fecha} onChange={(e) => setDocumento({...documento, fecha: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Validad Hasta</label>
                  <input type="date" value={documento.validezHasta} onChange={(e) => setDocumento({...documento, validezHasta: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Moneda</label>
                  <select value={documento.moneda} onChange={(e) => setDocumento({...documento, moneda: e.target.value})} style={inputStyle}>
                    <option value="SOLES">SOLES (S/.)</option>
                    <option value="DOLARES">DÓLARES (US$)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Forma de Pago</label>
                  <input type="text" placeholder="50% anticipo" value={documento.formaPago} onChange={(e) => setDocumento({...documento, formaPago: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tipo de Cambio</label>
                  <input type="text" placeholder="3.75" value={documento.tipoCambio} onChange={(e) => setDocumento({...documento, tipoCambio: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Elaborado por</label>
                  <input type="text" placeholder="Juan José Ampuero Torres" value={documento.elaboradoPor} onChange={(e) => setDocumento({...documento, elaboradoPor: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Cargo</label>
                  <input type="text" placeholder="Gerente General" value={documento.cargo} onChange={(e) => setDocumento({...documento, cargo: e.target.value})} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#a855f7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} /> Datos del Proveedor
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Nombre / Razón Social</label>
                  <input type="text" placeholder="Empresa proveedora" value={proveedor.nombre} onChange={(e) => setProveedor({...proveedor, nombre: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>RUC / DNI</label>
                  <input type="text" placeholder="20123456789" value={proveedor.ruc} onChange={(e) => setProveedor({...proveedor, ruc: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input type="text" placeholder="+51 999 999 999" value={proveedor.telefono} onChange={(e) => setProveedor({...proveedor, telefono: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Dirección</label>
                  <input type="text" placeholder="Dirección del proveedor" value={proveedor.direccion} onChange={(e) => setProveedor({...proveedor, direccion: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Correo Electrónico</label>
                  <input type="email" placeholder="proveedor@email.com" value={proveedor.email} onChange={(e) => setProveedor({...proveedor, email: e.target.value})} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ec4899', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} /> Productos / Servicios
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.map((item, index) => (
                  <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: '#3CB4FF', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: '#000' }}>{index + 1}</span>
                    <input type="text" placeholder="Descripción del producto" value={item.descripcion} onChange={(e) => actualizarItem(item.id, 'descripcion', e.target.value)} style={{ flex: 1, ...inputStyle }} />
                    <input type="number" placeholder="Cant" value={item.cantidad} onChange={(e) => actualizarItem(item.id, 'cantidad', e.target.value)} style={{ width: '60px', textAlign: 'center', ...inputStyle }} />
                    <input type="text" placeholder="Und" value={item.unidad} onChange={(e) => actualizarItem(item.id, 'unidad', e.target.value)} style={{ width: '60px', textAlign: 'center', ...inputStyle }} />
                    <input type="number" placeholder="P.U." value={item.precioUnitario} onChange={(e) => actualizarItem(item.id, 'precioUnitario', e.target.value)} style={{ width: '80px', textAlign: 'right', ...inputStyle }} />
                    <span style={{ width: '80px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#334155', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>{(item.cantidad * item.precioUnitario).toFixed(2)}</span>
                    <button onClick={() => eliminarItem(item.id)} disabled={items.length === 1} style={{ padding: '10px', background: items.length === 1 ? '#4b5563' : '#dc2626', border: 'none', borderRadius: '8px', cursor: items.length === 1 ? 'not-allowed' : 'pointer', color: '#fff' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={agregarItem} style={{ width: '100%', padding: '14px', border: '2px dashed #3CB4FF', borderRadius: '12px', background: 'transparent', color: '#3CB4FF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Plus size={18} />
                  <span>Agregar Item</span>
                </button>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f97316', marginBottom: '16px' }}>Condiciones / Observaciones</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Forma de Pago</label>
                  <input type="text" placeholder="50% anticipo" value={condiciones.formaPago} onChange={(e) => setCondiciones({...condiciones, formaPago: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tiempo de Entrega</label>
                  <input type="text" placeholder="7 días útiles" value={condiciones.tiempoEntrega} onChange={(e) => setCondiciones({...condiciones, tiempoEntrega: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Garantía</label>
                  <input type="text" placeholder="12 meses" value={condiciones.garantia} onChange={(e) => setCondiciones({...condiciones, garantia: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Validez</label>
                  <input type="text" placeholder="30 días" value={condiciones.validez} onChange={(e) => setCondiciones({...condiciones, validez: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Observaciones</label>
                  <textarea placeholder="Observaciones adicionales" value={condiciones.observaciones} onChange={(e) => setCondiciones({...condiciones, observaciones: e.target.value})} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} /> Firmas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Responsable ATENTO5</label>
                  <input type="text" placeholder="Nombre del responsable" value={firmas.responsable} onChange={(e) => setFirmas({...firmas, responsable: e.target.value})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Proveedor</label>
                  <input type="text" placeholder="Nombre del proveedor" value={firmas.proveedor} onChange={(e) => setFirmas({...firmas, proveedor: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Fecha de Firma</label>
                  <input type="date" value={firmas.fechaFirma} onChange={(e) => setFirmas({...firmas, fechaFirma: e.target.value})} style={inputStyle} />
                </div>
            </div>
          </div>
        </div>
          <div style={{ width: '60%', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px', flexShrink: 0 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0 }}>VISTA PREVIA</h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>Así se verá tu orden de compra PDF</p>
            </div>
            <div className="custom-scrollbar" style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              height: 'calc(100vh - 200px)',
              overflowY: 'auto',
              paddingBottom: '20px',
              boxSizing: 'border-box'
            }}>
              <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                width: '210mm',
                height: '297mm',
                flexShrink: 0,
                marginBottom: `-${1122.5 * (1 - scale)}px`
              }}>
                <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', width: '210mm', height: '297mm' }}>
                  <div style={{ background: 'white', color: '#000', width: '210mm', height: '295mm', padding: '8mm 12mm 6mm 12mm', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} ref={previewRef}>
                {/* CABECERA - 3 columnas estilo cotización */}
                <div style={{ display: 'flex', width: '100%', height: '34mm', border: '2px solid #1e293b', borderRadius: '8px', overflow: 'hidden', boxSizing: 'border-box', marginBottom: '8px', flexShrink: 0, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  {/* Columna Izquierda: Logo - ocupa la mitad del ancho */}
                  <div style={{ width: '50%', borderRight: '2px solid #1e293b', background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', boxSizing: 'border-box', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: 'linear-gradient(180deg, #3CB4FF, #D21414)' }} />
                    <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.18))' }} />
                  </div>
                  {/* Columna Central: Título + empresa */}
                  <div style={{ width: '28%', borderRight: '2px solid #1e293b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 6px', textAlign: 'center', boxSizing: 'border-box', gap: '4px' }}>
                    <h1 style={{ fontSize: '13px', fontWeight: '900', color: '#0f172a', margin: 0, lineHeight: '1.3', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Arial', sans-serif" }}>ORDEN DE COMPRA</h1>
                    <div style={{ width: '80%', height: '2.5px', background: 'linear-gradient(90deg, #3CB4FF, #D21414)', borderRadius: '2px' }} />
                    <p style={{ fontSize: '9px', fontWeight: '700', color: '#475569', margin: 0, textTransform: 'uppercase', letterSpacing: '0.2px' }}>{ATENTO5.nombre}</p>
                    <p style={{ fontSize: '8.5px', color: '#64748b', margin: 0, fontWeight: '600' }}>RUC: {ATENTO5.ruc}</p>
                  </div>
                  {/* Columna Derecha: N° Orden / Fecha / Vence */}
                  <div style={{ width: '22%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', background: '#f8fafc' }}>
                    <div style={{ flex: 1, display: 'flex', borderBottom: '2px solid #1e293b', boxSizing: 'border-box' }}>
                      <div style={{ width: '45%', borderRight: '2px solid #1e293b', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', paddingLeft: '5px', color: '#475569' }}>N° ORDEN:</div>
                      <div style={{ width: '55%', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', paddingLeft: '5px', color: '#D21414' }}>{documento.numero || '—'}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', borderBottom: '2px solid #1e293b', boxSizing: 'border-box' }}>
                      <div style={{ width: '45%', borderRight: '2px solid #1e293b', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', paddingLeft: '5px', color: '#475569' }}>EMISIÓN:</div>
                      <div style={{ width: '55%', fontSize: '9px', display: 'flex', alignItems: 'center', paddingLeft: '5px', fontWeight: '800', color: '#0f172a' }}>{formatDate(documento.fecha)}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', boxSizing: 'border-box' }}>
                      <div style={{ width: '45%', borderRight: '2px solid #1e293b', fontSize: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', paddingLeft: '5px', color: '#475569' }}>VENCE:</div>
                      <div style={{ width: '55%', fontSize: '9px', display: 'flex', alignItems: 'center', paddingLeft: '5px', fontWeight: '800', color: '#0f172a' }}>{formatDate(documento.validezHasta)}</div>
                    </div>
                  </div>
                </div>



                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '10px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', borderLeft: '4px solid #3CB4FF', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#3CB4FF', textTransform: 'uppercase', margin: '0 0 5px 0', letterSpacing: '0.3px' }}>Emisor (Comprador)</h3>
                    <p style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#111', margin: '0 0 3px 0' }}>{ATENTO5.nombre}</p>
                    <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>RUC: {ATENTO5.ruc}</p>
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0' }}>{ATENTO5.direccion}</p>
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0' }}>Tel: {ATENTO5.telefono} | {ATENTO5.correo}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', borderLeft: '4px solid #D21414', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', margin: '0 0 5px 0', letterSpacing: '0.3px' }}>Proveedor (Vendedor)</h3>
                    <p style={{ fontSize: '13.5px', fontWeight: 'bold', color: '#111', margin: '0 0 3px 0' }}>{proveedor.nombre || 'Nombre del Proveedor'}</p>
                    {proveedor.ruc && <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>RUC: {proveedor.ruc}</p>}
                    <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0' }}>Tel: {proveedor.telefono || '-'}</p>
                    {proveedor.email && <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0' }}>Email: {proveedor.email}</p>}
                  </div>
                </div>

                <div style={{ flex: 1, minHeight: '150px', marginBottom: '8px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                  <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(to right, #1e293b, #334155)', color: 'white' }}>
                        <th style={{ padding: '9px 10px', textAlign: 'left', width: '30px', fontSize: '12px', fontWeight: 'bold' }}>Ítem</th>
                        <th style={{ padding: '9px 10px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold' }}>Descripción / Detalle</th>
                        <th style={{ padding: '9px 10px', textAlign: 'center', width: '60px', fontSize: '12px', fontWeight: 'bold' }}>U. Medida</th>
                        <th style={{ padding: '9px 10px', textAlign: 'center', width: '45px', fontSize: '12px', fontWeight: 'bold' }}>Cant.</th>
                        <th style={{ padding: '9px 10px', textAlign: 'right', width: '80px', fontSize: '12px', fontWeight: 'bold' }}>P. Unit.</th>
                        <th style={{ padding: '9px 10px', textAlign: 'right', width: '85px', fontSize: '12px', fontWeight: 'bold' }}>Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', color: '#334155', background: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                          <td style={{ padding: '8px 10px', fontWeight: 'bold', verticalAlign: 'top', fontSize: '13px', textAlign: 'center' }}>{index + 1}</td>
                          <td style={{ padding: '8px 10px', verticalAlign: 'top' }}>
                            <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '13px', margin: 0 }}>{item.descripcion.split('\n')[0] || 'Descripción'}</p>
                            {item.descripcion.split('\n').slice(1).length > 0 && (
                              <ul style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', paddingLeft: '0', listStyle: 'none', margin: 0 }}>
                                {item.descripcion.split('\n').slice(1).map((l, i) => <li key={i}>• {l}</li>)}
                              </ul>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', verticalAlign: 'top', fontSize: '13px' }}>{item.unidad || '-'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', verticalAlign: 'top', fontSize: '13px' }}>{item.cantidad || 0}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', verticalAlign: 'top', fontSize: '13px' }}>{formatCurrency(parseFloat(item.precioUnitario))}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'top', fontSize: '13px' }}>{formatCurrency((parseFloat(item.precioUnitario) || 0) * (parseFloat(item.cantidad) || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                  <div style={{ width: '260px', border: '1.5px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc' }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: '600' }}>{formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 14px', fontSize: '13px', borderBottom: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc' }}>
                      <span>IGV (18%)</span>
                      <span style={{ fontWeight: '600' }}>{formatCurrency(igv)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 14px', fontSize: '15px', background: 'linear-gradient(to right, #1e3a5f, #3577b2)', color: 'white', fontWeight: 'bold' }}>
                      <span>TOTAL NETO</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '10px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', margin: '0 0 5px 0', letterSpacing: '0.3px' }}>Condiciones y Términos Comerciales</p>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: '3px 0' }}><span style={{ fontWeight: '600' }}>Lugar de Entrega:</span> {condiciones.lugarEntrega || ATENTO5.direccion}</p>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: '3px 0' }}><span style={{ fontWeight: '600' }}>Forma de Pago:</span> {documento.formaPago}</p>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: '3px 0' }}><span style={{ fontWeight: '600' }}>Elaborado por:</span> {documento.elaboradoPor} ({documento.cargo})</p>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', margin: '0 0 5px 0', letterSpacing: '0.3px' }}>Dirección de Entrega</p>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0 }}>{ATENTO5.direccion}</p>
                  </div>
                </div>

                {condiciones.observaciones && (
                  <div style={{ background: '#fefce8', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fde047', marginBottom: '8px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Observaciones</p>
                    <p style={{ fontSize: '12px', color: '#713f12', margin: 0 }}>{condiciones.observaciones}</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginTop: 'auto', paddingTop: '10px', borderTop: '2.5px solid #1e293b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '32px', borderBottom: '1.5px solid #64748b', marginBottom: '7px' }}></div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 2px 0' }}>{firmas.responsable}</p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Responsable ATENTO5</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '32px', borderBottom: '1.5px solid #64748b', marginBottom: '7px' }}></div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 2px 0' }}>{firmas.proveedor || 'Proveedor'}</p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Representante Proveedor</p>
                  </div>
                </div>

                <div style={{ marginTop: '6px', paddingTop: '4px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '10px', color: '#64748b' }}>
                  <p style={{ margin: 0 }}>{ATENTO5.direccion} | Tel: {ATENTO5.telefono} | Email: {ATENTO5.correo}</p>
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

export default PurchaseOrder;