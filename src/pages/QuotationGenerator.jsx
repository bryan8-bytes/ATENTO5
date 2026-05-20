import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';
import { Download, Plus, Trash2, Building2, CreditCard, User, FileText, Palette, ChevronLeft } from 'lucide-react';
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
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const QuotationGenerator = () => {
  const today = new Date();
  const vencimiento = new Date(today);
  vencimiento.setDate(vencimiento.getDate() + 30);

  const [empresa, setEmpresa] = useState({
    nombre: '', ruc: '', direccion: '', telefono: '', correo: '', web: ''
  });

  const [banco, setBanco] = useState({
    nombre: '', cuentaSoles: '', cciSoles: '', cuentaDolares: '', cciDolares: ''
  });

  const [cliente, setCliente] = useState({
    tipo: 'empresa',
    nombre: '', ruc: '', contacto: '', telefono: '', correo: '', direccion: ''
  });

  const [cotizacion, setCotizacion] = useState({
    numero: '',
    fecha: formatDate(today),
    vencimiento: formatDate(vencimiento),
    formaPago: '',
    garantia: '',
    validez: '30 días'
  });

  const [items, setItems] = useState([
    { id: 1, descripcion: '', cantidad: '', unidad: '', precio: '' }
  ]);

  const previewRef = useRef();

  const addItem = () => {
    setItems([...items, { id: Date.now(), descripcion: '', cantidad: '', unidad: '', precio: '' }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleExportPDF = () => {
    const element = previewRef.current;
    html2pdf().set({
      margin: 0,
      filename: 'Cotizacion_' + (cotizacion.numero || '000') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  };

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.precio || 0) * parseFloat(item.cantidad || 0)), 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const formatCurrency = (val) => 'S/ ' + (val || 0).toFixed(2);

  return (
    <div style={{display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden'}}>
      <EditorPanel 
        empresa={empresa} setEmpresa={setEmpresa}
        banco={banco} setBanco={setBanco}
        cliente={cliente} setCliente={setCliente}
        cotizacion={cotizacion} setCotizacion={setCotizacion}
        items={items} setItems={setItems}
        addItem={addItem} removeItem={removeItem}
        handleItemChange={handleItemChange}
        handleExportPDF={handleExportPDF}
      />
      <PreviewPanel 
        previewRef={previewRef}
        empresa={empresa}
        banco={banco}
        cliente={cliente}
        cotizacion={cotizacion}
        items={items}
        subtotal={subtotal}
        igv={igv}
        total={total}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

const EditorPanel = ({empresa, setEmpresa, banco, setBanco, cliente, setCliente, cotizacion, setCotizacion, items, addItem, removeItem, handleItemChange, handleExportPDF}) => {
  return (
    <div style={{width: '40%', height: '100vh', overflowY: 'auto', backgroundColor: '#080c17', borderRight: '2px solid #3CB4FF', padding: '20px'}}>
      <Link to="/home" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#3CB4FF', marginBottom: '16px', textDecoration: 'none', fontSize: '14px', fontWeight: '500'}}>
        <ChevronLeft size={20} />
        <span>Regresar</span>
      </Link>
      <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
        <SectionCard num="1" title="Tu Empresa (Opcional)" icon={<Building2 size={18}/>} color="#3CB4FF">
          <p style={{fontSize: '11px', color: '#9ca3af', marginBottom: '8px'}}>Si deseas, puedes agregar datos de tu empresa para mostrar en los datos de pago del PDF.</p>
          <FieldBox label="Nombre" value={empresa.nombre} onChange={(v) => setEmpresa({...empresa, nombre: v})} placeholder="Mi Empresa" />
          <FieldBox label="RUC" value={empresa.ruc} onChange={(v) => setEmpresa({...empresa, ruc: v})} placeholder="20123456789" />
        </SectionCard>

        <SectionCard num="2" title="DATOS BANCARIOS" icon={<CreditCard size={18}/>} color="#a855f7">
          <FieldBox label="Banco" value={banco.nombre} onChange={(v) => setBanco({...banco, nombre: v})} placeholder="Banco de Crédito" />
          <FieldBox label="Cuenta Soles" value={banco.cuentaSoles} onChange={(v) => setBanco({...banco, cuentaSoles: v})} placeholder="201-12345678901" />
          <FieldBox label="CCI Soles" value={banco.cciSoles} onChange={(v) => setBanco({...banco, cciSoles: v})} placeholder="002-201-12345678" />
          <FieldBox label="Cuenta Dólares" value={banco.cuentaDolares} onChange={(v) => setBanco({...banco, cuentaDolares: v})} placeholder="201-98765432109" />
          <FieldBox label="CCI Dólares" value={banco.cciDolares} onChange={(v) => setBanco({...banco, cciDolares: v})} placeholder="002-201-98765432109" />
        </SectionCard>

        <SectionCard num="3" title="CLIENTE" icon={<User size={18}/>} color="#eab308">
          <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
            <button onClick={() => setCliente({...cliente, tipo: 'empresa'})} style={{flex: 1, padding: '10px', borderRadius: '8px', border: cliente.tipo === 'empresa' ? '2px solid #3CB4FF' : '1px solid rgba(255,255,255,0.1)', background: cliente.tipo === 'empresa' ? 'rgba(60, 180, 255,0.1)' : 'transparent', color: cliente.tipo === 'empresa' ? '#3CB4FF' : '#9ca3af', cursor: 'pointer', fontWeight: '600', fontSize: '13px'}}>Empresa</button>
            <button onClick={() => setCliente({...cliente, tipo: 'persona'})} style={{flex: 1, padding: '10px', borderRadius: '8px', border: cliente.tipo === 'persona' ? '2px solid #D21414' : '1px solid rgba(255,255,255,0.1)', background: cliente.tipo === 'persona' ? 'rgba(210, 20, 20,0.1)' : 'transparent', color: cliente.tipo === 'persona' ? '#D21414' : '#9ca3af', cursor: 'pointer', fontWeight: '600', fontSize: '13px'}}>Persona</button>
          </div>
          {cliente.tipo === 'empresa' ? (
            <>
              <FieldBox label="Razón Social" value={cliente.nombre} onChange={(v) => setCliente({...cliente, nombre: v})} placeholder="Empresa XYZ S.A.C." />
              <FieldBox label="RUC" value={cliente.ruc} onChange={(v) => setCliente({...cliente, ruc: v})} placeholder="20123456789" />
            </>
          ) : (
            <FieldBox label="Nombre Completo" value={cliente.nombre} onChange={(v) => setCliente({...cliente, nombre: v})} placeholder="Juan Pérez García" />
          )}
          <FieldBox label="Persona de Contacto" value={cliente.contacto} onChange={(v) => setCliente({...cliente, contacto: v})} placeholder="Juan Pérez" />
          <FieldBox label="Teléfono" value={cliente.telefono} onChange={(v) => setCliente({...cliente, telefono: v})} placeholder="+51 987 654 321" />
          <FieldBox label="Correo" value={cliente.correo} onChange={(v) => setCliente({...cliente, correo: v})} placeholder="juan@empresa.com" />
          <FieldBox label="Dirección" value={cliente.direccion} onChange={(v) => setCliente({...cliente, direccion: v})} placeholder="Av. Cliente 456" />
        </SectionCard>

        <SectionCard num="4" title="COTIZACIÓN" icon={<FileText size={18}/>} color="#22c55e">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <FieldBox label="N° Cotización" value={cotizacion.numero} onChange={(v) => setCotizacion({...cotizacion, numero: v})} placeholder="COT-001" />
            <FieldBox label="Fecha" value={cotizacion.fecha} onChange={(v) => setCotizacion({...cotizacion, fecha: v})} placeholder="14/04/2026" />
          </div>
          <FieldBox label="Vencimiento" value={cotizacion.vencimiento} onChange={(v) => setCotizacion({...cotizacion, vencimiento: v})} placeholder="14/05/2026" />
          <FieldBox label="Forma de Pago" value={cotizacion.formaPago} onChange={(v) => setCotizacion({...cotizacion, formaPago: v})} placeholder="50% anticipo" />
          <FieldBox label="Garantía" value={cotizacion.garantia} onChange={(v) => setCotizacion({...cotizacion, garantia: v})} placeholder="12 meses" />
          <FieldBox label="Validez" value={cotizacion.validez} onChange={(v) => setCotizacion({...cotizacion, validez: v})} placeholder="30 días" />
        </SectionCard>

        <SectionCard num="5" title="SERVICIOS" icon={<Palette size={18}/>} color="#ec4899">
          {items.map((item, index) => (
            <motion.div key={item.id} initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} style={{background: 'linear-gradient(135deg, #1a2332 0%, #162028 100%)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <span style={{background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', color: 'white', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '6px'}}>Item {index + 1}</span>
                {items.length > 1 && (
                  <button onClick={() => removeItem(item.id)} style={{background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer'}}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div style={{marginBottom: '12px'}}>
                <label style={{display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase'}}>Descripción</label>
                <textarea value={item.descripcion} onChange={(e) => handleItemChange(item.id, 'descripcion', e.target.value)} style={{width: '100%', background: '#0a0e17', border: '1px solid rgba(60, 180, 255, 0.15)', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#fff', outline: 'none', minHeight: '80px', resize: 'vertical'}} placeholder="Describe el servicio..." />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase'}}>Cantidad</label>
                  <input type="text" value={item.cantidad} onChange={(e) => handleItemChange(item.id, 'cantidad', e.target.value)} style={{width: '100%', background: '#0a0e17', border: '1px solid rgba(60, 180, 255, 0.15)', borderRadius: '10px', padding: '10px', fontSize: '13px', color: '#fff', textAlign: 'center', outline: 'none'}} placeholder="1" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase'}}>Unidad</label>
                  <input type="text" value={item.unidad} onChange={(e) => handleItemChange(item.id, 'unidad', e.target.value)} style={{width: '100%', background: '#0a0e17', border: '1px solid rgba(60, 180, 255, 0.15)', borderRadius: '10px', padding: '10px', fontSize: '13px', color: '#fff', textAlign: 'center', outline: 'none'}} placeholder="UND" />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase'}}>Precio</label>
                  <input type="text" value={item.precio} onChange={(e) => handleItemChange(item.id, 'precio', e.target.value)} style={{width: '100%', background: '#0a0e17', border: '1px solid rgba(60, 180, 255, 0.15)', borderRadius: '10px', padding: '10px', fontSize: '13px', color: '#fff', textAlign: 'center', outline: 'none'}} placeholder="0.00" />
                </div>
              </div>
            </motion.div>
          ))}
          <button onClick={addItem} style={{width: '100%', padding: '14px', border: '2px dashed rgba(60, 180, 255, 0.3)', borderRadius: '12px', background: 'transparent', color: '#3CB4FF', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
            <Plus size={18} />
            <span>Agregar Item</span>
          </button>
        </SectionCard>
      </div>

      <button onClick={handleExportPDF} style={{width: '100%', padding: '16px', border: 'none', borderRadius: '14px', background: 'linear-gradient(135deg, #3CB4FF 0%, #8764B2 50%, #D21414 100%)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', boxShadow: '0 4px 15px rgba(60, 180, 255, 0.3)'}}>
        <Download size={22} />
        <span>Descargar PDF</span>
      </button>
    </div>
  );
};

const PreviewPanel = ({previewRef, empresa, banco, cliente, cotizacion, items, subtotal, igv, total, formatCurrency}) => {
  return (
    <div style={{width: '60%', height: '100vh', overflowY: 'auto', backgroundColor: '#0a0e17', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{textAlign: 'center', marginBottom: '16px'}}>
        <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'white'}}>VISTA PREVIA</h2>
        <p style={{fontSize: '12px', color: '#9ca3af'}}>Así se verá tu cotización PDF</p>
      </div>
      <div style={{background: 'white', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', width: '210mm', minHeight: '297mm'}}>
        <div ref={previewRef} style={{background: 'white', color: 'black', width: '210mm', minHeight: '297mm', padding: '15mm', boxSizing: 'border-box'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <img src={logo} alt="Logo" style={{height: '60px', width: 'auto', objectFit: 'contain'}} />
              <div>
                <h1 style={{fontSize: '16px', fontWeight: 'bold', color: '#111', lineHeight: 1.3}}>{ATENTO5.nombre}</h1>
                <p style={{fontSize: '10px', color: '#6b7280', fontWeight: '500'}}>RUC: {ATENTO5.ruc}</p>
              </div>
            </div>
            <div style={{textAlign: 'right'}}>
              <h2 style={{fontSize: '24px', fontWeight: '800', color: '#3CB4FF', letterSpacing: '0.05em'}}>COTIZACIÓN</h2>
              <p style={{fontSize: '12px', color: '#6b7280', fontWeight: '500'}}>{cotizacion.numero || '000'}</p>
            </div>
          </div>

          <div style={{height: '4px', background: 'linear-gradient(to right, #3CB4FF, #D21414)', borderRadius: '9999px', marginBottom: '20px'}} />

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '20px'}}>
            <div style={{background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3CB4FF'}}>
              <h3 style={{fontSize: '10px', fontWeight: 'bold', color: '#3CB4FF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px'}}>{cliente.tipo === 'empresa' ? 'Datos de la Empresa' : 'Datos del Cliente'}</h3>
              <p style={{fontSize: '14px', fontWeight: 'bold', color: '#111'}}>{cliente.nombre || (cliente.tipo === 'empresa' ? 'Nombre de Empresa' : 'Nombre del Cliente')}</p>
              {cliente.tipo === 'empresa' && cliente.ruc && <p style={{fontSize: '11px', color: '#4b5560'}}>RUC: {cliente.ruc}</p>}
              <p style={{fontSize: '11px', color: '#4b5560'}}>Atención: {cliente.contacto || '-'}</p>
              <p style={{fontSize: '11px', color: '#4b5560'}}>Telf: {cliente.telefono || '-'}</p>
              <p style={{fontSize: '11px', color: '#4b5560'}}>Email: {cliente.correo || '-'}</p>
              <p style={{fontSize: '11px', color: '#4b5560'}}>Dirección: {cliente.direccion || '-'}</p>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'}}>
              <div style={{background: '#eff6ff', padding: '8px', borderRadius: '8px'}}>
                <p style={{fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold'}}>Fecha</p>
                <p style={{fontSize: '11px', fontWeight: '600', color: '#111'}}>{cotizacion.fecha}</p>
              </div>
              <div style={{background: '#fff7ed', padding: '8px', borderRadius: '8px'}}>
                <p style={{fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold'}}>Vence</p>
                <p style={{fontSize: '11px', fontWeight: '600', color: '#111'}}>{cotizacion.vencimiento}</p>
              </div>
              <div style={{background: '#f0fdf4', padding: '8px', borderRadius: '8px'}}>
                <p style={{fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold'}}>Moneda</p>
                <p style={{fontSize: '11px', fontWeight: '600', color: '#111'}}>Soles</p>
              </div>
              <div style={{background: '#faf5ff', padding: '8px', borderRadius: '8px'}}>
                <p style={{fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold'}}>Validez</p>
                <p style={{fontSize: '11px', fontWeight: '600', color: '#111'}}>{cotizacion.validez}</p>
              </div>
            </div>
          </div>

          <table style={{width: '100%', fontSize: '11px', borderCollapse: 'collapse', marginBottom: '20px'}}>
            <thead>
              <tr style={{background: 'linear-gradient(to right, #1e293b, #334155)', color: 'white'}}>
                <th style={{padding: '12px', textAlign: 'left', width: '32px', borderTopLeftRadius: '8px'}}>#</th>
                <th style={{padding: '12px', textAlign: 'left'}}>Descripción del Servicio</th>
                <th style={{padding: '12px', textAlign: 'center', width: '56px'}}>Und</th>
                <th style={{padding: '12px', textAlign: 'center', width: '48px'}}>Cant</th>
                <th style={{padding: '12px', textAlign: 'right', width: '80px'}}>P. Unit</th>
                <th style={{padding: '12px', textAlign: 'right', width: '96px', borderTopRightRadius: '8px'}}>Importe</th>
              </tr>
            </thead>
            <tbody style={{color: '#374151'}}>
              {items.map((item, index) => {
                const lines = (item.descripcion || '').split('\n');
                const first = lines[0];
                const rest = lines.slice(1);
                return (
                  <tr key={item.id} style={{borderBottom: '1px solid #e2e8f0'}}>
                    <td style={{padding: '12px', fontWeight: 'bold'}}>{index + 1}</td>
                    <td style={{padding: '12px'}}>
                      <p style={{fontWeight: 'bold', color: '#111'}}>{first || 'Descripción'}</p>
                      {rest.length > 0 && (
                        <ul style={{fontSize: '10px', marginTop: '4px', color: '#6b7280'}}>
                          {rest.map((l, i) => <li key={i}>• {l}</li>)}
                        </ul>
                      )}
                    </td>
                    <td style={{padding: '12px', textAlign: 'center', fontWeight: '500'}}>{item.unidad || '-'}</td>
                    <td style={{padding: '12px', textAlign: 'center', fontWeight: '500'}}>{item.cantidad || '0'}</td>
                    <td style={{padding: '12px', textAlign: 'right'}}>{formatCurrency(item.precio)}</td>
                    <td style={{padding: '12px', textAlign: 'right', fontWeight: 'bold'}}>{formatCurrency((item.precio || 0) * (item.cantidad || 0))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
            <div style={{width: '200px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', borderBottom: '1px solid #e2e8f0'}}>
                <span style={{color: '#4b5560'}}>Subtotal</span>
                <span style={{fontWeight: '600'}}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '12px', borderBottom: '1px solid #e2e8f0'}}>
                <span style={{color: '#4b5560'}}>IGV (18%)</span>
                <span style={{fontWeight: '600'}}>{formatCurrency(igv)}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px 16px', fontSize: '14px', background: 'linear-gradient(to right, #3CB4FF, #D21414)', color: 'white', borderRadius: '8px', fontWeight: 'bold', marginTop: '4px'}}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
            <div style={{background: '#f8fafc', padding: '12px', borderRadius: '8px'}}>
              <h3 style={{fontSize: '10px', fontWeight: 'bold', color: '#374151', textTransform: 'uppercase', marginBottom: '8px'}}>Condiciones Comerciales</h3>
              <p style={{fontSize: '11px'}}><span style={{fontWeight: '600'}}>Forma de Pago:</span> {cotizacion.formaPago || '-'}</p>
              <p style={{fontSize: '11px'}}><span style={{fontWeight: '600'}}>Garantía:</span> {cotizacion.garantia || '-'}</p>
            </div>
            <div style={{background: '#f8fafc', padding: '12px', borderRadius: '8px'}}>
              <h3 style={{fontSize: '10px', fontWeight: 'bold', color: '#374151', textTransform: 'uppercase', marginBottom: '8px'}}>Datos de Pago</h3>
              <p style={{fontSize: '11px', fontWeight: '500'}}>{banco.nombre || 'Banco'}</p>
              <p style={{fontSize: '11px'}}>Soles: {banco.cuentaSoles || '-'}</p>
              <p style={{fontSize: '11px'}}>CCI: {banco.cciSoles || '-'}</p>
            </div>
          </div>

          <div style={{paddingTop: '12px', borderTop: '2px solid #cbd5e1'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#6b7280'}}>
              <div>
                <p>{ATENTO5.direccion}</p>
                <p>Telf: {ATENTO5.telefono} | Email: {ATENTO5.correo}</p>
              </div>
              <div style={{fontWeight: 'bold', color: '#3CB4FF', fontSize: '14px'}}>{ATENTO5.web}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({num, title, icon, color, children}) => (
  <div style={{background: 'linear-gradient(145deg, #0d1525 0%, #091020 100%)', border: '1px solid rgba(60, 180, 255, 0.1)', borderRadius: '16px', overflow: 'hidden', marginBottom: '0'}}>
    <div style={{display: 'flex', alignItems: 'center', padding: '14px 16px', background: 'linear-gradient(90deg, rgba(60, 180, 255, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)', borderBottom: '1px solid rgba(60, 180, 255, 0.15)'}}>
      <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: 'linear-gradient(135deg, #3CB4FF 0%, #8764B2 100%)', borderRadius: '6px', fontSize: '12px', fontWeight: '800', color: '#000', marginRight: '10px'}}>{num}</span>
      <span style={{color: color, marginRight: '8px'}}>{icon}</span>
      <h3 style={{fontSize: '13px', fontWeight: '700', color: '#fff', letterSpacing: '0.8px'}}>{title}</h3>
    </div>
    <div style={{padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0, 0, 0, 0.15)'}}>
      {children}
    </div>
  </div>
);

const FieldBox = ({label, value, onChange, placeholder}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
    <label style={{fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{label}</label>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{width: '100%', background: 'linear-gradient(135deg, #0a0f18 0%, #0d1422 100%)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '12px 14px', fontSize: '14px', color: '#fff', outline: 'none', transition: 'all 0.25s ease'}} />
  </div>
);

export default QuotationGenerator;