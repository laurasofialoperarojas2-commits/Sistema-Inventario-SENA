import React, { useState } from 'react';
import { Database, History, FileCheck, PlusCircle, Eye, Search, FileText, Download, FileSpreadsheet, Edit, Printer, Check } from 'lucide-react';
import Modal from '../componentes/Modal';
import TituloTarjeta from '../componentes/TituloTarjeta';
import logo from '../imagenes/logo.png';
import { productosExternos, formatoPesos, fechaHoy, descargarExcel } from '../datos/datos';

// ===== PANEL ADMINISTRATIVO =====
// Aquí la administración revisa el historial, los contratos, las evidencias,
// pide compras y acepta las solicitudes de los instructores.
function Administrativos({
  contratos, setContratos,
  solicitudes, setSolicitudes,
  asignaciones, setAsignaciones,
  movimientos, setMovimientos,
  configuraciones, setConfiguraciones,
  evidencias,
  solicitudesCompra, setSolicitudesCompra,
}) {

  // ---------- VENTANA ABIERTA ----------
  // Puede ser: 'compra', 'detalle', 'evidencia', 'contrato', 'editar' o null
  const [ventana, setVentana] = useState(null);

  // Lo que se está viendo o editando en cada ventana
  const [solicitudVista, setSolicitudVista] = useState(null);
  const [evidenciaVista, setEvidenciaVista] = useState(null);
  const [contratoVisto, setContratoVisto] = useState(null);   // id del contrato
  const [itemEditando, setItemEditando] = useState(null);     // copia del ítem que se edita

  // ---------- PESTAÑA DEL HISTORIAL ----------
  const [pestana, setPestana] = useState('materiales'); // 'materiales' o 'configuraciones'

  // ---------- BUSCADORES ----------
  const [buscarSolicitud, setBuscarSolicitud] = useState('');
  const [buscarProducto, setBuscarProducto] = useState('');
  const [cantidadesCompra, setCantidadesCompra] = useState({}); // { idProducto: cantidad }

  // ============================================================
  // CÁLCULOS
  // ============================================================

  // Valor total de un contrato (cantidad x valor de cada ítem)
  const totalContrato = (contrato) =>
    contrato.items.reduce((suma, item) => suma + item.cantidad * item.valor, 0);

  // Solicitudes que coinciden con el buscador
  const solicitudesFiltradas = solicitudes.filter((s) => {
    const texto = `${s.instructor.nombre} ${s.instructor.apellido} ${s.instructor.formacion}`.toLowerCase();
    return texto.includes(buscarSolicitud.toLowerCase());
  });

  // Productos de compra que coinciden con el buscador
  const productosFiltrados = productosExternos.filter((p) =>
    p.nombre.toLowerCase().includes(buscarProducto.toLowerCase()) ||
    p.codigo.toLowerCase().includes(buscarProducto.toLowerCase())
  );

  const contratoActual = contratos.find((c) => c.id === contratoVisto);

  // ============================================================
  // SOLICITUDES DE LOS INSTRUCTORES
  // ============================================================

  // Botón "Ver": abre la vista previa de la solicitud
  const verSolicitud = (solicitud) => {
    setSolicitudVista(solicitud);
    setVentana('detalle');
  };

  // Botón "PDF": abre la vista previa y abre la ventana de imprimir
  // (desde ahí se elige "Guardar como PDF")
  const exportarPDF = (solicitud) => {
    verSolicitud(solicitud);
    setTimeout(() => window.print(), 300);
  };

  // Botón "Exportar Excel"
  const exportarExcel = (s) => {
    descargarExcel(`Solicitud_${s.instructor.apellido}_${s.id}`, [
      ['SERVICIO NACIONAL DE APRENDIZAJE - SENA'],
      ['Fecha', s.fecha],
      ['No. de Solicitud', `SOL-${s.id}`],
      ['Instructor', `${s.instructor.nombre} ${s.instructor.apellido}`],
      ['Formación', s.instructor.formacion],
      [],
      ['Material', 'Código', 'Cantidad', 'Valor Total'],
      ...s.materiales.map((m) => [m.nombre, m.codigo, m.cantidadSolicitada, m.valorTotal]),
      ['', '', 'TOTAL', s.presupuestoTotal],
    ]);
  };

  // Botón "Aceptar": entrega los materiales al instructor
  const aceptarSolicitud = (s) => {
    // 1. Revisar que haya cantidad suficiente en los contratos
    for (const m of s.materiales) {
      const item = contratos.flatMap((c) => c.items).find((i) => i.id === m.itemId);
      if (!item || item.cantidad < m.cantidadSolicitada) {
        alert(`No hay cantidad suficiente de "${m.nombre}" en el inventario.`);
        return;
      }
    }

    // 2. Descontar las cantidades de los contratos
    setContratos(contratos.map((c) => ({
      ...c,
      items: c.items.map((item) => {
        const pedido = s.materiales.find((m) => m.itemId === item.id);
        return pedido ? { ...item, cantidad: item.cantidad - pedido.cantidadSolicitada } : item;
      }),
    })));

    // 3. Registrar el movimiento en el historial como "Salida"
    const nombreCompleto = `${s.instructor.nombre} ${s.instructor.apellido}`;
    setMovimientos([...movimientos, {
      id: Date.now(),
      tipo: 'Salida',
      instructorId: s.instructorId,
      instructor: nombreCompleto,
      formacion: s.instructor.formacion,
      materiales: s.materiales,
      fechaSolicitud: s.fecha,
      fecha: fechaHoy(),
      presupuestoTotal: s.presupuestoTotal,
    }]);

    // 4. Asignar los materiales al instructor
    const nuevas = s.materiales.map((m, i) => ({
      id: Date.now() + i,
      instructorId: s.instructorId,
      itemId: m.itemId,
      nombre: m.nombre,
      codigo: m.codigo,
      cantidad: m.cantidadSolicitada,
      fechaAsignacion: fechaHoy(),
    }));
    setAsignaciones([...asignaciones, ...nuevas]);

    // 5. Quitar la solicitud de la lista
    setSolicitudes(solicitudes.filter((x) => x.id !== s.id));
    alert(`Solicitud aceptada exitosamente. Los materiales han sido asignados a ${nombreCompleto}.`);
  };

  // ============================================================
  // CONTRATOS
  // ============================================================

  // Clic en la tarjeta de un contrato
  const abrirContrato = (id) => {
    setContratoVisto(id);
    setVentana('contrato');
  };

  // Botón del lápiz: abre el formulario para editar el ítem
  const editarItem = (item) => {
    setItemEditando({ ...item });
    setVentana('editar');
  };

  // Botón "Guardar Cambios"
  const guardarItem = () => {
    const original = contratoActual.items.find((i) => i.id === itemEditando.id);

    // Anotar qué cambió para el historial de configuraciones
    const cambios = [];
    if (original.codigo !== itemEditando.codigo) cambios.push(`Código: ${original.codigo} → ${itemEditando.codigo}`);
    if (original.cantidad !== itemEditando.cantidad) cambios.push(`Cantidad: ${original.cantidad} → ${itemEditando.cantidad}`);
    if (original.material !== itemEditando.material) cambios.push(`Material: ${original.material} → ${itemEditando.material}`);
    if (original.coordinacion !== itemEditando.coordinacion) cambios.push(`Coordinación: ${original.coordinacion} → ${itemEditando.coordinacion}`);
    if (original.valor !== itemEditando.valor) cambios.push(`Valor: ${formatoPesos(original.valor)} → ${formatoPesos(itemEditando.valor)}`);

    if (cambios.length > 0) {
      setConfiguraciones([...configuraciones, {
        id: Date.now(),
        fecha: fechaHoy(),
        hora: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
        contrato: contratoActual.nombre,
        itemNombre: itemEditando.material,
        cambios,
      }]);
    }

    // Guardar el ítem en su contrato
    setContratos(contratos.map((c) =>
      c.id === contratoVisto
        ? { ...c, items: c.items.map((i) => (i.id === itemEditando.id ? itemEditando : i)) }
        : c
    ));
    setVentana('contrato');
  };

  // Botón "Eliminar"
  const eliminarItem = () => {
    if (!confirm('¿Estás seguro de eliminar este ítem?')) return;
    setContratos(contratos.map((c) =>
      c.id === contratoVisto ? { ...c, items: c.items.filter((i) => i.id !== itemEditando.id) } : c
    ));
    setVentana('contrato');
  };

  // ============================================================
  // SOLICITUD DE COMPRA
  // ============================================================

  // Botón "Solicitar" de un producto
  const solicitarCompra = (producto) => {
    setSolicitudesCompra([...solicitudesCompra, {
      ...producto,
      cantidad: cantidadesCompra[producto.id] || 1,
      fechaSolicitud: fechaHoy(),
      idSolicitud: Date.now(),
    }]);
    alert(`Solicitud de compra para ${producto.nombre} enviada exitosamente.`);
    setVentana(null);
  };

  // ============================================================
  // LO QUE SE VE EN PANTALLA
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ===== TÍTULO ===== */}
      <div className="tarjeta">
        <h1 className="titulo text-3xl mb-2">Panel Administrativo</h1>
        <p className="text-sena-verde">Gestión completa del inventario y asignaciones</p>
      </div>

      {/* ===== HISTORIAL DE MOVIMIENTOS ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={History} texto="Historial de Movimientos" />

        {/* ----- Pestañas ----- */}
        <div className="flex gap-2 mb-6 border-b-2 border-sena-verde">
          <BotonPestana activa={pestana === 'materiales'} onClick={() => setPestana('materiales')}>Movimientos de Materiales</BotonPestana>
          <BotonPestana activa={pestana === 'configuraciones'} onClick={() => setPestana('configuraciones')}>Configuraciones Inventario</BotonPestana>
        </div>

        {/* ----- Pestaña: Movimientos de Materiales ----- */}
        {pestana === 'materiales' && (
          <div className="overflow-x-auto border-2 border-sena-verde rounded-lg">
            {movimientos.length === 0 ? (
              <p className="p-8 text-center text-gray-500 bg-white">No hay movimientos de materiales registrados</p>
            ) : (
              <table className="tabla tabla-verde">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Instructor</th>
                    <th>Formación</th>
                    <th>Materiales</th>
                    <th className="!text-center">Fecha Solicitud</th>
                    <th className="!text-center">Fecha Aceptación</th>
                    <th className="!text-right">Presupuesto</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((mov) => (
                    <tr key={mov.id}>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs text-white ${mov.tipo === 'Salida' ? 'bg-red-600' : 'bg-green-600'}`}>{mov.tipo}</span>
                      </td>
                      <td>{mov.instructor}</td>
                      <td>{mov.formacion}</td>
                      <td>
                        {mov.materiales.map((m, i) => (
                          <div key={i} className="text-sm">• {m.nombre} ({m.cantidadSolicitada} unid.)</div>
                        ))}
                      </td>
                      <td className="text-center">{mov.fechaSolicitud}</td>
                      <td className="text-center"><span className="px-2 py-1 bg-green-600 text-white rounded text-sm">{mov.fecha}</span></td>
                      <td className="text-right font-bold text-sena-verde">{formatoPesos(mov.presupuestoTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ----- Pestaña: Configuraciones Inventario ----- */}
        {pestana === 'configuraciones' && (
          <div className="overflow-x-auto border-2 border-sena-verde rounded-lg">
            {configuraciones.length === 0 ? (
              <p className="p-8 text-center text-gray-500 bg-white">No hay cambios de configuración registrados</p>
            ) : (
              <table className="tabla tabla-verde">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Contrato</th>
                    <th>Item</th>
                    <th>Cambios Realizados</th>
                  </tr>
                </thead>
                <tbody>
                  {/* slice().reverse() muestra primero el cambio más reciente */}
                  {configuraciones.slice().reverse().map((conf) => (
                    <tr key={conf.id}>
                      <td>
                        <div>{conf.fecha}</div>
                        <div className="text-xs text-gray-600">{conf.hora}</div>
                      </td>
                      <td><span className="px-2 py-1 bg-sena-verde text-white rounded text-sm">{conf.contrato}</span></td>
                      <td className="font-bold">{conf.itemNombre}</td>
                      <td>{conf.cambios.map((c, i) => <div key={i} className="text-sm mb-1">• {c}</div>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ===== DETALLES DE INVENTARIO - CONTRATOS ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={Database} texto="Detalles de Inventario - Contratos" />
        <div className="grid md:grid-cols-3 gap-4">
          {contratos.map((c) => (
            <button
              key={c.id}
              onClick={() => abrirContrato(c.id)}
              className="p-6 bg-white rounded-lg border-2 border-sena-verde hover:bg-sena-fondo transition-colors cursor-pointer text-left"
            >
              <h3 className="titulo text-xl mb-3">{c.nombre}</h3>
              <div className="space-y-2 text-sena-verde">
                <p><strong>Items:</strong> {c.items.length}</p>
                <p><strong>Presupuesto:</strong> {formatoPesos(totalContrato(c))}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== EVIDENCIAS DOCUMENTALES ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={FileCheck} texto="Evidencias Documentales" />
        {evidencias.length === 0 ? (
          <p className="text-sena-oscuro">No hay evidencias enviadas por los instructores</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Fecha</th>
                  <th className="!text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {evidencias.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.instructor}</td>
                    <td>{ev.fecha}</td>
                    <td>
                      <button
                        onClick={() => { setEvidenciaVista(ev); setVentana('evidencia'); }}
                        className="px-4 py-2 bg-sena-verde text-white rounded hover:bg-sena-oscuro flex items-center gap-2 mx-auto cursor-pointer"
                      >
                        <Eye size={18} /> Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== SOLICITAR NUEVO MATERIAL (COMPRA) ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={PlusCircle} texto="Solicitar Nuevo Material" />
        <p className="mb-4 text-sena-oscuro">Solicita la adquisición de nuevos materiales para el inventario</p>
        <button onClick={() => setVentana('compra')} className="btn-verde w-full">Nueva Solicitud de Compra</button>
      </div>

      {/* ===== SOLICITUDES DE MATERIALES DE INSTRUCTORES ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={FileText} texto="Solicitudes de Materiales de Instructores" />

        {/* ----- Buscador ----- */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-sena-verde" />
          <input
            type="text"
            value={buscarSolicitud}
            onChange={(e) => setBuscarSolicitud(e.target.value)}
            placeholder="Buscar por nombre, apellido o formación..."
            className="w-full pl-10 pr-3 py-2 border-2 border-sena-verde rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sena-verde"
          />
        </div>

        {/* ----- Tabla de solicitudes ----- */}
        {solicitudesFiltradas.length === 0 ? (
          <p className="text-center py-8 text-sena-oscuro">No hay solicitudes de materiales registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Formación / Ficha</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th className="!text-center">Presupuesto</th>
                  <th className="!text-center">Formato</th>
                  <th className="!text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesFiltradas.map((s) => (
                  <tr key={s.id}>
                    <td>{s.instructor.nombre} {s.instructor.apellido}</td>
                    <td>{s.instructor.formacion}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-white text-xs ${s.instructor.tipoPrograma === 'tecnologo' ? 'bg-sena-oscuro' : 'bg-sena-verde'}`}>
                        {s.instructor.tipoPrograma === 'tecnologo' ? 'Tecnólogo' : 'Técnico'}
                      </span>
                    </td>
                    <td>{s.fecha}</td>
                    <td className="text-center"><span className="pastilla">{formatoPesos(s.presupuestoTotal)}</span></td>
                    <td className="text-center text-green-700 text-xs">✓ PDF</td>
                    <td>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <button onClick={() => verSolicitud(s)} className="px-3 py-2 bg-sena-verde text-white rounded hover:bg-sena-oscuro flex items-center gap-1 cursor-pointer">
                          <Eye size={16} /> Ver
                        </button>
                        <button onClick={() => exportarPDF(s)} className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-1 cursor-pointer">
                          <Download size={16} /> PDF
                        </button>
                        <button onClick={() => aceptarSolicitud(s)} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 cursor-pointer">
                          <Check size={16} /> Aceptar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================
          VENTANA: NUEVA SOLICITUD DE COMPRA
          ============================================================ */}
      {ventana === 'compra' && (
        <Modal titulo="Nueva Solicitud de Compra" onCerrar={() => setVentana(null)} ancho="max-w-5xl">
          {/* ----- Buscador ----- */}
          <div className="relative mb-6">
            <Search size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-sena-verde" />
            <input
              type="text"
              placeholder="Buscar producto por nombre o código..."
              value={buscarProducto}
              onChange={(e) => setBuscarProducto(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-sena-verde rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sena-oscuro"
            />
          </div>

          {/* ----- Lista de productos ----- */}
          <div className="overflow-x-auto border-2 border-sena-verde rounded-lg">
            <table className="tabla tabla-verde">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th className="!text-right">Costo Unidad</th>
                  <th className="!text-right">Por Mayor</th>
                  <th className="!text-center">Cantidad</th>
                  <th className="!text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td className="text-sm">{p.codigo}</td>
                    <td className="text-right">{formatoPesos(p.costoUnidad)}</td>
                    <td className="text-right">{formatoPesos(p.costoPorMayor)}</td>
                    <td className="text-center">
                      <input
                        type="number" min="1"
                        value={cantidadesCompra[p.id] || 1}
                        onChange={(e) => setCantidadesCompra({ ...cantidadesCompra, [p.id]: parseInt(e.target.value) || 1 })}
                        className="w-20 border-2 border-sena-verde rounded px-2 py-1 text-center"
                      />
                    </td>
                    <td className="text-center">
                      <button onClick={() => solicitarCompra(p)} className="bg-sena-verde text-white px-3 py-1 rounded hover:bg-sena-oscuro text-sm font-titulo font-bold cursor-pointer">
                        Solicitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: VISTA PREVIA DE UNA SOLICITUD
          ============================================================ */}
      {ventana === 'detalle' && solicitudVista && (
        <Modal titulo="Vista Previa - Solicitud de Material" onCerrar={() => setVentana(null)} fondoBlanco>

          {/* ----- Encabezado con el logo ----- */}
          <div className="border-4 border-sena-oscuro rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <img src={logo} alt="Logo" className="h-20 w-20 rounded-full object-cover" />
              <div className="text-right">
                <h3 className="titulo text-2xl mb-1">SERVICIO NACIONAL DE APRENDIZAJE</h3>
                <p className="text-sena-verde">Formato de Solicitud de Materiales</p>
              </div>
            </div>
            <div className="border-t-2 border-sena-verde pt-4 text-right text-sena-oscuro">
              <p className="mb-2"><strong>Fecha:</strong> {solicitudVista.fecha}</p>
              <p><strong>No. de Solicitud:</strong> SOL-{solicitudVista.id}</p>
            </div>
          </div>

          {/* ----- Datos del instructor ----- */}
          <div className="mb-6 p-6 bg-sena-beige rounded-lg text-sena-oscuro">
            <h3 className="titulo text-xl mb-4">Datos del Instructor</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="mb-2"><strong>Nombre(s):</strong> {solicitudVista.instructor.nombre}</p>
                <p><strong>Apellido(s):</strong> {solicitudVista.instructor.apellido}</p>
              </div>
              <div>
                <p><strong>Formación / Programa:</strong> {solicitudVista.instructor.formacion}</p>
                <p className="mt-1">
                  <strong>Tipo de Programa:</strong>{' '}
                  <span className="px-2 py-0.5 rounded text-white text-sm bg-sena-verde">
                    {solicitudVista.instructor.tipoPrograma === 'tecnologo' ? 'Tecnólogo' : 'Técnico'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* ----- Materiales solicitados ----- */}
          <div className="mb-6">
            <h3 className="titulo text-xl mb-3">Material Solicitado</h3>
            <div className="border-2 border-sena-verde rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-sena-verde text-white font-titulo">
                  <tr>
                    <th className="text-left py-3 px-4">Material</th>
                    <th className="text-center py-3 px-4">Cantidad</th>
                    <th className="text-right py-3 px-4">Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudVista.materiales.map((m, i) => (
                    <tr key={i} className="border-b border-gray-300">
                      <td className="py-3 px-4">
                        <div>{m.nombre}</div>
                        <div className="text-xs text-gray-500">{m.codigo}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">{m.cantidadSolicitada}</td>
                      <td className="py-3 px-4 text-right font-bold text-sena-verde">{formatoPesos(m.valorTotal)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-sena-beige font-titulo font-bold text-sena-oscuro">
                  <tr>
                    <td colSpan="2" className="py-3 px-4 text-right">TOTAL PRESUPUESTO:</td>
                    <td className="py-3 px-4 text-right">{formatoPesos(solicitudVista.presupuestoTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ----- Formato adjunto ----- */}
          <div className="mb-6">
            <h3 className="titulo text-xl mb-3">Formato Adjunto</h3>
            <div className="border-2 border-sena-verde rounded-lg p-5 bg-sena-beige flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg"><FileText size={28} className="text-red-600" /></div>
              <div>
                <p className="titulo">{solicitudVista.formatoPDF}</p>
                <p className="text-xs text-sena-verde">Formato SENA adjuntado por el instructor ✓</p>
              </div>
            </div>
          </div>

          {/* ----- Botones ----- */}
          <div className="no-imprimir flex gap-4 pt-4 border-t-2 border-sena-verde">
            <button onClick={() => window.print()} className="btn-rojo flex-1 flex items-center justify-center gap-2">
              <Download size={20} /> Exportar PDF
            </button>
            <button onClick={() => exportarExcel(solicitudVista)} className="btn-verde !bg-green-600 hover:!bg-green-700 flex-1 flex items-center justify-center gap-2">
              <FileSpreadsheet size={20} /> Exportar Excel
            </button>
            <button onClick={() => window.print()} className="btn-verde !bg-blue-600 hover:!bg-blue-700 flex-1 flex items-center justify-center gap-2">
              <Printer size={20} /> Imprimir
            </button>
            <button onClick={() => setVentana(null)} className="btn-gris flex-1">Cerrar</button>
          </div>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: VER EVIDENCIA
          ============================================================ */}
      {ventana === 'evidencia' && evidenciaVista && (
        <Modal titulo={`Evidencia de ${evidenciaVista.instructor}`} onCerrar={() => setVentana(null)}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* ----- Fotografía ----- */}
            <div>
              <h3 className="titulo text-lg mb-3">Fotografía</h3>
              <div className="border-2 border-sena-verde rounded-lg overflow-hidden">
                <img src={evidenciaVista.imagen} alt="Evidencia" className="w-full h-auto" />
              </div>
            </div>
            {/* ----- Mensaje ----- */}
            <div>
              <h3 className="titulo text-lg mb-3">Mensaje</h3>
              <div className="p-4 bg-white border-2 border-sena-verde rounded-lg min-h-[200px] text-sena-oscuro whitespace-pre-wrap">
                {evidenciaVista.mensaje}
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-gray-300 text-sm text-sena-verde">
                <strong>Fecha de envío:</strong> {evidenciaVista.fecha}
              </div>
            </div>
          </div>
          <button onClick={() => setVentana(null)} className="btn-verde w-full mt-6">Cerrar</button>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: ÍTEMS DE UN CONTRATO
          ============================================================ */}
      {ventana === 'contrato' && contratoActual && (
        <Modal titulo={`Contrato: ${contratoActual.nombre}`} onCerrar={() => setVentana(null)} ancho="max-w-6xl">
          <div className="overflow-x-auto border-2 border-sena-verde rounded-lg">
            <table className="tabla tabla-verde">
              <thead>
                <tr>
                  <th>Código</th>
                  <th className="!text-center">Cantidad</th>
                  <th>Material</th>
                  <th>Coordinación</th>
                  <th className="!text-right">Valor</th>
                  <th className="!text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {contratoActual.items.map((item) => (
                  <tr key={item.id}>
                    <td className="text-sm">{item.codigo}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td>{item.material}</td>
                    <td>{item.coordinacion}</td>
                    <td className="text-right">{formatoPesos(item.valor)}</td>
                    <td className="text-center">
                      <button onClick={() => editarItem(item)} className="bg-sena-verde text-white p-2 rounded hover:bg-sena-oscuro cursor-pointer" title="Editar">
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-4 bg-sena-oscuro rounded-lg text-right text-xl text-white font-titulo font-bold">
            Valor Total (Presupuesto): <span className="text-sena-beige">{formatoPesos(totalContrato(contratoActual))}</span>
          </div>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: EDITAR ÍTEM
          ============================================================ */}
      {ventana === 'editar' && itemEditando && (
        <Modal titulo="Editar Item" onCerrar={() => setVentana('contrato')} ancho="max-w-2xl">
          <div className="space-y-4">
            <CampoEditar etiqueta="Código" valor={itemEditando.codigo}
              onCambio={(v) => setItemEditando({ ...itemEditando, codigo: v })} />
            <CampoEditar etiqueta="Cantidad" tipo="number" valor={itemEditando.cantidad}
              onCambio={(v) => setItemEditando({ ...itemEditando, cantidad: parseInt(v) || 0 })} />
            <CampoEditar etiqueta="Material" valor={itemEditando.material}
              onCambio={(v) => setItemEditando({ ...itemEditando, material: v })} />
            <CampoEditar etiqueta="Coordinación" valor={itemEditando.coordinacion}
              onCambio={(v) => setItemEditando({ ...itemEditando, coordinacion: v })} />
            <CampoEditar etiqueta="Valor (Precio Unitario)" tipo="number" valor={itemEditando.valor}
              onCambio={(v) => setItemEditando({ ...itemEditando, valor: parseFloat(v) || 0 })} />

            <div className="flex gap-3 pt-4">
              <button onClick={guardarItem} className="btn-verde flex-1">Guardar Cambios</button>
              <button onClick={eliminarItem} className="btn-rojo flex-1">Eliminar</button>
              <button onClick={() => setVentana('contrato')} className="btn-gris flex-1">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// PIEZAS PEQUEÑAS QUE SOLO USA ESTA PANTALLA
// ============================================================

// Botón de las pestañas del historial
function BotonPestana({ activa, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-titulo font-bold transition-colors cursor-pointer ${
        activa ? 'bg-sena-verde text-white' : 'bg-white text-sena-oscuro hover:bg-sena-fondo'
      }`}
    >
      {children}
    </button>
  );
}

// Un campo del formulario "Editar Item"
function CampoEditar({ etiqueta, tipo = 'text', valor, onCambio }) {
  return (
    <div>
      <label className="etiqueta">{etiqueta}</label>
      <input type={tipo} value={valor} onChange={(e) => onCambio(e.target.value)} className="campo border-sena-verde" />
    </div>
  );
}

export default Administrativos;
