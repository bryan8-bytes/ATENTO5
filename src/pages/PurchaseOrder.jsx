import React, { useState, useRef } from 'react';
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
  correo: 'contacto@atento5.com',
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
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '40px 24px', overflow: 'auto' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3CB4FF', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            <ChevronLeft size={20} />
            <span>Volver</span>
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #3CB4FF, #D21414)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Orden de Compra</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={guardarOrden} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #D21414, #9a0d0d)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <Save size={18} />
              <span>Guardar</span>
            </button>
            <button onClick={exportarPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #3CB4FF, #8764B2)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
              <Download size={18} />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ width: '45%', flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '100vh', overflowY: 'auto' }}>
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
          <div style={{ width: '55%', flex: '1', display: 'flex', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', width: '210mm', minHeight: '297mm' }}>
              <div style={{ background: 'white', color: '#000', width: '210mm', minHeight: '297mm', padding: '15mm', boxSizing: 'border-box', position: 'relative' }} ref={previewRef}>
                <div style={{ background: 'linear-gradient(135deg, #3CB4FF, #D21414)', color: 'white', padding: '20px', borderRadius: '0', margin: '-15mm -15mm 20px -15mm' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={logo} alt="Logo" style={{ height: '55px', width: 'auto', objectFit: 'contain' }} />
                      <div>
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', lineHeight: 1.3 }}>{ATENTO5.nombre}</h1>
                        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.9)' }}>RUC: {ATENTO5.ruc}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', letterSpacing: '0.05em' }}>ORDEN DE COMPRA</h2>
                      <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>N° {documento.numero || '000'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #64748b', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', marginBottom: '10px' }}>Datos del Documento</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '13px', color: '#1e293b' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Fecha de Emisión</p>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{formatDate(documento.fecha)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Fecha de Vencimiento</p>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{formatDate(documento.vencimiento)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Moneda</p>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{documento.moneda === 'PEN' ? 'Soles (S/.)' : 'Dólares (US$)'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>Tipo de Cambio</p>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{documento.tipoCambio || '-'}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #3CB4FF' }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#3CB4FF', textTransform: 'uppercase', marginBottom: '8px' }}>Emisor (Comprador)</h3>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#111' }}>{ATENTO5.nombre}</p>
                    <p style={{ fontSize: '11px', color: '#475569' }}>RUC: {ATENTO5.ruc}</p>
                    <p style={{ fontSize: '11px', color: '#475569' }}>Dirección: {ATENTO5.direccion}</p>
                    <p style={{ fontSize: '11px', color: '#475569' }}>Telf: {ATENTO5.telefono} | Correo: {ATENTO5.correo}</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #D21414' }}>
                    <h3 style={{ fontSize: '10px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', marginBottom: '8px' }}>Proveedor (Vendedor)</h3>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#111' }}>{proveedor.nombre || 'Nombre del Proveedor'}</p>
                    {proveedor.ruc && <p style={{ fontSize: '11px', color: '#475569' }}>RUC: {proveedor.ruc}</p>}
                    <p style={{ fontSize: '11px', color: '#475569' }}>Atención: {proveedor.contacto || '-'}</p>
                    <p style={{ fontSize: '11px', color: '#475569' }}>Telf: {proveedor.telefono || '-'}</p>
                    <p style={{ fontSize: '11px', color: '#475569' }}>Email: {proveedor.correo || '-'}</p>
                  </div>
                </div>

                <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: '16px' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #1e293b, #334155)', color: 'white' }}>
                      <th style={{ padding: '10px', textAlign: 'left', width: '30px', borderTopLeftRadius: '6px' }}>Item</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Descripción / Detalle</th>
                      <th style={{ padding: '10px', textAlign: 'center', width: '60px' }}>U. Medida</th>
                      <th style={{ padding: '10px', textAlign: 'center', width: '50px' }}>Cant.</th>
                      <th style={{ padding: '10px', textAlign: 'right', width: '80px' }}>P. Unit</th>
                      <th style={{ padding: '10px', textAlign: 'right', width: '90px', borderTopRightRadius: '6px' }}>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{index + 1}</td>
                        <td style={{ padding: '10px' }}>
                          <p style={{ fontWeight: 'bold', color: '#0f172a' }}>{item.descripcion.split('\n')[0] || 'Descripción'}</p>
                          {item.descripcion.split('\n').slice(1).length > 0 && (
                            <ul style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', paddingLeft: '0', listStyle: 'none' }}>
                              {item.descripcion.split('\n').slice(1).map((l, i) => <li key={i}>• {l}</li>)}
                            </ul>
                          )}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{item.unidad || '-'}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{item.cantidad || 0}</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(item.precio)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency((item.precio || 0) * (item.cantidad || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                  <div style={{ width: '220px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: '600' }}>{formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                      <span>IGV (18%)</span>
                      <span style={{ fontWeight: '600' }}>{formatCurrency(igv)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', fontSize: '13px', background: 'linear-gradient(to right, #3CB4FF, #D21414)', color: 'white', borderRadius: '6px', fontWeight: 'bold', marginTop: '4px' }}>
                      <span>Total Neto</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', marginBottom: '6px' }}>Condiciones y Términos Comerciales</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}><span style={{ fontWeight: '600' }}>Lugar de Entrega:</span> {condiciones.lugarEntrega}</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}><span style={{ fontWeight: '600' }}>Forma de Pago:</span> {documento.formaPago}</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}><span style={{ fontWeight: '600' }}>Tipo de Cambio:</span> {documento.tipoCambio}</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}><span style={{ fontWeight: '600' }}>Elaborado por:</span> {documento.elaboradoPor}</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}><span style={{ fontWeight: '600' }}>Cargo:</span> {documento.cargo}</p>
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', marginBottom: '6px' }}>Dirección de Entrega</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}>{ATENTO5.direccion}</p>
                  </div>
                </div>

                {condiciones.observaciones && (
                  <div style={{ background: '#fefce8', padding: '12px', borderRadius: '8px', border: '1px solid #fde047', marginBottom: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#854d0e', textTransform: 'uppercase', marginBottom: '4px' }}>Observaciones</p>
                    <p style={{ fontSize: '13px', color: '#713f12' }}>{condiciones.observaciones}</p>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '32px', paddingTop: '16px', borderTop: '2px solid #cbd5e1' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '60px', borderBottom: '2px solid #64748b', marginBottom: '8px' }}></div>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{firmas.responsable}</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Responsable ATENTO5</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '60px', borderBottom: '2px solid #64748b', marginBottom: '8px' }}></div>
                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{firmas.proveedor || 'Proveedor'}</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Representante Proveedor</p>
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '10px', color: '#64748b' }}>
                  <p>{ATENTO5.direccion} | Tel: {ATENTO5.telefono} | Email: {ATENTO5.correo}</p>
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