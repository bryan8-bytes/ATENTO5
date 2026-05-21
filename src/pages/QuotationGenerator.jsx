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
  correo: 'Juan.ampuero@atento5.com',
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
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] }
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
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    const updateScale = () => {
      const availableHeight = window.innerHeight - 130;
      const sheetHeight = 1122.5; // 297mm in pixels at 96dpi
      let newScale = availableHeight / sheetHeight;
      
      const availableWidth = window.innerWidth * 0.6 - 40; // 60% width minus padding
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
    <div style={{width: '60%', height: '100vh', overflow: 'hidden', backgroundColor: '#0a0e17', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{textAlign: 'center', marginBottom: '12px', flexShrink: 0}}>
        <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'white', margin: 0}}>VISTA PREVIA</h2>
        <p style={{fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0'}}>Así se verá tu cotización PDF</p>
      </div>
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: 'calc(100vh - 100px)',
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
          <div style={{background: 'white', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', width: '210mm', height: '297mm'}}>
            <div ref={previewRef} style={{background: 'white', color: 'black', width: '210mm', height: '295mm', padding: '8mm 12mm 8mm 12mm', boxSizing: 'border-box', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column'}}>
              
              {/* Header */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <img src={logo} alt="Logo" style={{height: '52px', width: 'auto', objectFit: 'contain'}} />
                  <div>
                    <h1 style={{fontSize: '16px', fontWeight: '800', color: '#111', lineHeight: 1.1, margin: 0}}>{ATENTO5.nombre}</h1>
                    <p style={{fontSize: '9.5px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '2px 0 0 0'}}>SOLUCIONES INTEGRALES</p>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <h2 style={{fontSize: '18px', fontWeight: '800', color: '#D21414', letterSpacing: '0.05em', margin: 0}}>COTIZACION N° {cotizacion.numero || '000'}</h2>
                </div>
              </div>

          <div style={{height: '1px', background: '#cbd5e1', marginBottom: '8px'}} />

          {/* Top Info Grid */}
          <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px', marginBottom: '8px'}}>
            <div>
              <h3 style={{fontSize: '11.5px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0'}}>CLIENTE:</h3>
              <p style={{fontSize: '14px', fontWeight: 'bold', color: '#111', margin: 0}}>{cliente.nombre || (cliente.tipo === 'empresa' ? 'Nombre de Empresa' : 'Nombre del Cliente')}</p>
              {cliente.tipo === 'empresa' && cliente.ruc && <p style={{fontSize: '11px', color: '#4b5563', margin: '1px 0 0 0'}}><span style={{fontWeight: '600'}}>RUC:</span> {cliente.ruc}</p>}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11.5px', color: '#111', justifyContent: 'center'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{fontWeight: 'bold', color: '#4b5563'}}>Fecha:</span> <span>{cotizacion.fecha}</span></div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{fontWeight: 'bold', color: '#4b5563'}}>Vencimiento:</span> <span>{cotizacion.vencimiento}</span></div>
            </div>
          </div>

          {/* Contact and Payment Grid */}
          <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px', marginBottom: '8px', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0'}}>
            <div>
              <h3 style={{fontSize: '11px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0'}}>PERSONA DE CONTACTO:</h3>
              <div style={{fontSize: '11px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '2px'}}>
                <div><span style={{fontWeight: '600'}}>Atención:</span> {cliente.contacto || '-'}</div>
                <div><span style={{fontWeight: '600'}}>Telf:</span> {cliente.telefono || '-'}</div>
                <div><span style={{fontWeight: '600'}}>Correo:</span> {cliente.correo || '-'}</div>
                {cliente.direccion && <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}><span style={{fontWeight: '600'}}>Dirección:</span> {cliente.direccion}</div>}
              </div>
            </div>
            <div>
              <h3 style={{fontSize: '11px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0'}}>DATOS DE PAGO / {banco.nombre || 'BANCO'}:</h3>
              <div style={{fontSize: '10.5px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '2px'}}>
                {banco.cuentaSoles && <div><span style={{fontWeight: '600'}}>Soles:</span> {banco.cuentaSoles}</div>}
                {banco.cciSoles && <div><span style={{fontWeight: '600'}}>CCI:</span> {banco.cciSoles}</div>}
                {banco.cuentaDolares && <div><span style={{fontWeight: '600'}}>Dólares:</span> {banco.cuentaDolares}</div>}
                {banco.cciDolares && <div><span style={{fontWeight: '600'}}>CCI:</span> {banco.cciDolares}</div>}
                {!banco.cuentaSoles && !banco.cuentaDolares && <div>No especificados</div>}
              </div>
            </div>
          </div>

          {/* Table */}
          <div style={{flex: 1, minHeight: '160px', marginBottom: '8px'}}>
            <table style={{width: '100%', fontSize: '11.5px', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#111', color: 'white'}}>
                  <th style={{padding: '5px 8px', textAlign: 'left', width: '25px'}}>N°</th>
                  <th style={{padding: '5px 8px', textAlign: 'left'}}>DESCRIPCION</th>
                  <th style={{padding: '5px 8px', textAlign: 'center', width: '40px'}}>CANT</th>
                  <th style={{padding: '5px 8px', textAlign: 'center', width: '40px'}}>UND</th>
                  <th style={{padding: '5px 8px', textAlign: 'right', width: '80px'}}>P. / UND</th>
                  <th style={{padding: '5px 8px', textAlign: 'right', width: '90px'}}>TOTAL</th>
                </tr>
              </thead>
              <tbody style={{color: '#374151'}}>
                {items.map((item, index) => {
                  const lines = (item.descripcion || '').split('\n');
                  const first = lines[0];
                  const rest = lines.slice(1);
                  return (
                    <tr key={item.id} style={{borderBottom: '1px solid #e2e8f0'}}>
                      <td style={{padding: '5px 8px', fontWeight: 'bold', verticalAlign: 'top'}}>{index + 1}</td>
                      <td style={{padding: '5px 8px', verticalAlign: 'top'}}>
                        <p style={{fontWeight: 'bold', color: '#D21414', fontSize: '11.5px', margin: 0}}>{first || 'Descripción'}</p>
                        {rest.length > 0 && (
                          <ul style={{fontSize: '10px', marginTop: '2px', color: '#4b5563', listStyle: 'none', paddingLeft: 0, margin: 0}}>
                            {rest.map((l, i) => <li key={i} style={{marginBottom: '1px'}}>• {l}</li>)}
                          </ul>
                        )}
                      </td>
                      <td style={{padding: '5px 8px', textAlign: 'center', fontWeight: '500', verticalAlign: 'top'}}>{item.cantidad || '0'}</td>
                      <td style={{padding: '5px 8px', textAlign: 'center', fontWeight: '500', verticalAlign: 'top'}}>{item.unidad || 'UND'}</td>
                      <td style={{padding: '5px 8px', textAlign: 'right', verticalAlign: 'top'}}>{formatCurrency(parseFloat(item.precio))}</td>
                      <td style={{padding: '5px 8px', textAlign: 'right', fontWeight: 'bold', verticalAlign: 'top'}}>{formatCurrency((parseFloat(item.precio) || 0) * (parseFloat(item.cantidad) || 0))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Commercial Conditions Row */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '8px'}}>
            
            {/* Commercial Conditions */}
            <div style={{flex: 1.2}}>
              <h3 style={{fontSize: '11px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0'}}>CONDICIONES COMERCIALES:</h3>
              <div style={{fontSize: '10.5px', color: '#374151', display: 'flex', flexDirection: 'column', gap: '2px'}}>
                <div><span style={{fontWeight: '600'}}>Forma de Pago:</span> {cotizacion.formaPago || '-'}</div>
                <div><span style={{fontWeight: '600'}}>Garantía:</span> {cotizacion.garantia || '-'}</div>
                <div><span style={{fontWeight: '600'}}>Moneda:</span> Soles</div>
                <div><span style={{fontWeight: '600'}}>Validez:</span> {cotizacion.validez || '-'}</div>
              </div>

              {/* Other Details / Stamp Area */}
              <div style={{marginTop: '6px'}}>
                <h3 style={{fontSize: '10.5px', fontWeight: 'bold', color: '#D21414', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0'}}>OTROS DETALLES:</h3>
                <div style={{fontSize: '9.5px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '1px'}}>
                  <div>• Personal con SCTR</div>
                  <div>• Precios incluyen IGV (18%)</div>
                </div>
              </div>
            </div>

            {/* Totals Box & Stamp/Signature Placeholder */}
            <div style={{flex: 0.8, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'}}>
              <div style={{width: '100%', maxWidth: '200px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '11.5px', borderBottom: '1px solid #e2e8f0'}}>
                  <span style={{color: '#4b5563', fontWeight: '600'}}>SUB-TOTAL</span>
                  <span style={{fontWeight: '700'}}>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: '11.5px', borderBottom: '1px solid #e2e8f0'}}>
                  <span style={{color: '#4b5563', fontWeight: '600'}}>IGV (18%)</span>
                  <span style={{fontWeight: '700'}}>{formatCurrency(igv)}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 8px', fontSize: '13px', background: '#111', color: 'white', fontWeight: 'bold', marginTop: '2px'}}>
                  <span>TOTAL</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Stamp / Digital Signature */}
              <div style={{marginTop: '4px', textAlign: 'center', alignSelf: 'center', border: '1px dashed #cbd5e1', padding: '4px 8px', borderRadius: '4px', background: '#fafafa', width: '100%'}}>
                <p style={{fontSize: '8.5px', color: '#6b7280', margin: 0, fontStyle: 'italic'}}>Firmado digitalmente por:</p>
                <p style={{fontSize: '9px', fontWeight: 'bold', color: '#D21414', margin: '2px 0 0 0'}}>ATENTO5 S.G. E.I.R.L.</p>
                <p style={{fontSize: '7.5px', color: '#9ca3af', margin: 0}}>RUC: 20612345678</p>
              </div>
            </div>
          </div>

          {/* Footer Details */}
          <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', fontSize: '10px', color: '#4b5563', borderTop: '1px solid #e2e8f0'}}>
              <span>{ATENTO5.direccion}</span>
              <span style={{fontWeight: 'bold'}}>{ATENTO5.correo} | {ATENTO5.telefono}</span>
            </div>
            
            {/* Red bottom bar */}
            <div style={{background: '#D21414', margin: '0 -12mm -8mm -12mm', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <a href={`https://${ATENTO5.web}`} target="_blank" rel="noopener noreferrer" style={{color: 'white', textDecoration: 'none', fontSize: '11.5px', fontWeight: 'bold', letterSpacing: '1px'}}>{ATENTO5.web}</a>
            </div>
          </div>
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