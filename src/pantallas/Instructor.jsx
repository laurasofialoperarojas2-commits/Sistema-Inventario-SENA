import React, { useState } from 'react';
import { Package, RotateCcw, ImageIcon, Box, PlusCircle, Search, Upload, Check, FileText, History, X } from 'lucide-react';
import Modal from '../componentes/Modal';
import TituloTarjeta from '../componentes/TituloTarjeta';
import logo from '../imagenes/logo.png';
import { PRESUPUESTO_MAXIMO, formatoPesos, fechaHoy } from '../datos/datos';

// ===== PANEL DEL INSTRUCTOR =====
// Aquí el instructor ve sus materiales, los devuelve, sube evidencias
// y hace nuevas solicitudes de material.
function Instructor({
  usuario, contratos, setContratos,
  solicitudes, setSolicitudes,
  asignaciones, setAsignaciones,
  movimientos, setMovimientos,
  evidencias, setEvidencias,
}) {

  // ---------- VENTANA ABIERTA ----------
  // Puede ser: 'devolucion', 'solicitud', 'formulario', 'evidencia' o null (ninguna)
  const [ventana, setVentana] = useState(null);

  // ---------- BUSCADORES DE LA TABLA ----------
  const [buscarMaterial, setBuscarMaterial] = useState('');
  const [buscarCodigo, setBuscarCodigo] = useState('');

  // ---------- DEVOLUCIÓN ----------
  const [paraDevolver, setParaDevolver] = useState([]); // ids de las asignaciones elegidas

  // ---------- SOLICITUD ----------
  // seleccion guarda { idDelItem: cantidad }. Ej: { 1: 2, 5: 1 }
  const [seleccion, setSeleccion] = useState({});

  // ---------- FORMULARIO SENA ----------
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [formacion, setFormacion] = useState('');
  const [tipoPrograma, setTipoPrograma] = useState('tecnologo');
  const [formatoPDF, setFormatoPDF] = useState(null); // nombre del archivo PDF

  // ---------- EVIDENCIA ----------
  const [imagen, setImagen] = useState(null); // la foto convertida a texto para mostrarla
  const [mensaje, setMensaje] = useState('');

  // ============================================================
  // CÁLCULOS
  // ============================================================

  // Solo lo que le pertenece a este instructor
  const misMateriales = asignaciones.filter((a) => a.instructorId === usuario.id);
  const misMovimientos = movimientos.filter((m) => m.instructorId === usuario.id);
  const misEvidencias = evidencias.filter((e) => e.instructorId === usuario.id);

  // Materiales filtrados con los buscadores
  const materialesFiltrados = misMateriales.filter((m) =>
    m.nombre.toLowerCase().includes(buscarMaterial.toLowerCase()) &&
    m.codigo.toLowerCase().includes(buscarCodigo.toLowerCase())
  );

  // Todos los ítems de todos los contratos (para la solicitud)
  const todosLosItems = contratos.flatMap((c) => c.items);

  // Ids de los ítems seleccionados en la solicitud
  const idsSeleccionados = Object.keys(seleccion).map(Number);

  // Suma en dinero de lo que se ha seleccionado
  const totalSolicitud = idsSeleccionados.reduce((suma, id) => {
    const item = todosLosItems.find((i) => i.id === id);
    return item ? suma + item.valor * seleccion[id] : suma;
  }, 0);

  const totalUnidades = Object.values(seleccion).reduce((a, b) => a + b, 0);
  const presupuestoLleno = totalSolicitud >= PRESUPUESTO_MAXIMO;

  // ============================================================
  // FUNCIONES DE DEVOLUCIÓN
  // ============================================================

  // Marca o desmarca un material para devolver
  const marcarDevolucion = (id) => {
    if (paraDevolver.includes(id)) {
      setParaDevolver(paraDevolver.filter((x) => x !== id));
    } else {
      setParaDevolver([...paraDevolver, id]);
    }
  };

  // Botón "Devolver Materiales"
  const devolverMateriales = () => {
    if (paraDevolver.length === 0) {
      alert('Por favor selecciona al menos un material para devolver');
      return;
    }
    const devueltos = misMateriales.filter((m) => paraDevolver.includes(m.id));

    // 1. Los materiales vuelven a la bodega (se suman a su contrato)
    setContratos(contratos.map((c) => ({
      ...c,
      items: c.items.map((item) => {
        const dev = devueltos.find((d) => d.itemId === item.id);
        return dev ? { ...item, cantidad: item.cantidad + dev.cantidad } : item;
      }),
    })));

    // 2. Se quitan de la lista del instructor
    setAsignaciones(asignaciones.filter((a) => !paraDevolver.includes(a.id)));

    // 3. Se registra en el historial como "Entrada"
    setMovimientos([...movimientos, {
      id: Date.now(),
      tipo: 'Entrada',
      instructorId: usuario.id,
      instructor: usuario.nombre,
      formacion: '—',
      materiales: devueltos.map((d) => ({ nombre: d.nombre, cantidadSolicitada: d.cantidad })),
      fechaSolicitud: '—',
      fecha: fechaHoy(),
      presupuestoTotal: 0,
    }]);

    alert(`Se han devuelto ${devueltos.length} materiales correctamente`);
    setParaDevolver([]);
    setVentana(null);
  };

  // ============================================================
  // FUNCIONES DE SOLICITUD
  // ============================================================

  // Marca o desmarca un ítem en la ventana de solicitud
  const marcarItem = (item) => {
    const nuevaSeleccion = { ...seleccion };
    if (seleccion[item.id]) {
      delete nuevaSeleccion[item.id];
    } else {
      if (totalSolicitud + item.valor > PRESUPUESTO_MAXIMO) {
        alert('⚠️ Su presupuesto ya ha sido completado.\nNo puede agregar más materiales (máximo $3.000.000).');
        return;
      }
      nuevaSeleccion[item.id] = 1; // empieza con cantidad 1
    }
    setSeleccion(nuevaSeleccion);
  };

  // Cambia la cantidad de un ítem seleccionado
  const cambiarCantidad = (item, cantidad) => {
    if (cantidad < 1) return;
    const nuevoTotal = totalSolicitud - item.valor * seleccion[item.id] + item.valor * cantidad;
    if (nuevoTotal > PRESUPUESTO_MAXIMO) {
      alert('⚠️ Su presupuesto ya ha sido completado.\nNo puede agregar más materiales (máximo $3.000.000).');
      return;
    }
    setSeleccion({ ...seleccion, [item.id]: cantidad });
  };

  // Botón "Continuar con Formulario"
  const continuarFormulario = () => setVentana('formulario');

  // Al elegir el PDF del formato SENA
  const elegirPDF = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    if (archivo.type !== 'application/pdf') {
      alert('Solo se aceptan archivos en formato PDF');
      e.target.value = '';
      return;
    }
    setFormatoPDF(archivo.name);
  };

  // Botón "Enviar Solicitud"
  const enviarSolicitud = () => {
    if (!nombre || !apellido || !formacion || !formatoPDF) {
      alert('Por favor completa todos los campos del formulario y adjunta el formato PDF del SENA');
      return;
    }

    const nueva = {
      id: Date.now(),
      instructorId: usuario.id,
      instructor: { nombre, apellido, formacion, tipoPrograma },
      materiales: idsSeleccionados.map((id) => {
        const item = todosLosItems.find((i) => i.id === id);
        return {
          itemId: item.id,
          nombre: item.material,
          codigo: item.codigo,
          cantidadSolicitada: seleccion[id],
          valorUnitario: item.valor,
          valorTotal: item.valor * seleccion[id],
        };
      }),
      presupuestoTotal: totalSolicitud,
      formatoPDF,
      fecha: fechaHoy(),
    };

    setSolicitudes([...solicitudes, nueva]);
    alert('✅ Solicitud enviada correctamente al administrador');

    // Limpiamos todo
    setSeleccion({});
    setApellido('');
    setFormacion('');
    setTipoPrograma('tecnologo');
    setFormatoPDF(null);
    setVentana(null);
  };

  // ============================================================
  // FUNCIONES DE EVIDENCIA
  // ============================================================

  // Lee la foto elegida del computador para poder mostrarla
  const elegirImagen = (e) => {  
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onloadend = () => setImagen(lector.result);
    lector.readAsDataURL(archivo);
  };

  // Botón "Enviar Evidencia"
  const enviarEvidencia = () => {
    if (!imagen || !mensaje) {
      alert('Por favor carga una imagen y escribe un mensaje');
      return;
    }
    setEvidencias([...evidencias, {
      id: Date.now(),
      instructorId: usuario.id,
      instructor: usuario.nombre,
      fecha: fechaHoy(),
      imagen,
      mensaje,
    }]);
    alert('Evidencia enviada correctamente');
    cerrarEvidencia();
  };

  const cerrarEvidencia = () => {
    setImagen(null);
    setMensaje('');
    setVentana(null);
  };

  // ============================================================
  // LO QUE SE VE EN PANTALLA
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ===== TÍTULO ===== */}
      <div className="tarjeta">
        <h1 className="titulo text-3xl mb-2">Panel de Instructor</h1>
        <p className="text-sena-verde">Gestiona tus materiales asignados y solicita nuevos recursos</p>
      </div>

      {/* ===== MIS MATERIALES ASIGNADOS ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={Package} texto="Mis Materiales Asignados" />
        <div className="overflow-x-auto">
          <table className="tabla">
            <thead>
              <tr>
                <th>
                  <div className="flex items-center gap-2">
                    Material
                    <Buscador valor={buscarMaterial} onCambio={setBuscarMaterial} />
                  </div>
                </th>
                <th>
                  <div className="flex items-center gap-2">
                    Código
                    <Buscador valor={buscarCodigo} onCambio={setBuscarCodigo} />
                  </div>
                </th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {materialesFiltrados.length === 0 ? (
                <tr><td colSpan="3" className="text-center py-8 text-gray-500">No tienes materiales asignados actualmente</td></tr>
              ) : (
                materialesFiltrados.map((m) => (
                  <tr key={m.id} className="hover:!bg-sena-fondo">
                    <td>{m.nombre}</td>
                    <td>{m.codigo}</td>
                    <td className="text-center"><span className="pastilla">{m.cantidad}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== DEVOLVER MATERIAL + HISTORIAL ===== */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ----- Devolver Material ----- */}
        <div className="tarjeta">
          <TituloTarjeta Icono={RotateCcw} texto="Devolver Material" tamano="text-xl" />
          <p className="mb-4 text-sena-oscuro">Registra la devolución de materiales asignados</p>
          <button onClick={() => setVentana('devolucion')} className="btn-verde w-full">Iniciar Devolución</button>
        </div>

        {/* ----- Historial de Movimientos ----- */}
        <div className="tarjeta">
          <TituloTarjeta Icono={History} texto="Historial de Movimientos" tamano="text-xl" />
          <p className="mb-4 text-sena-oscuro">Registro de todos los movimientos de materiales</p>
          <div className="max-h-64 overflow-y-auto border-2 border-sena-verde rounded-lg">
            {misMovimientos.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No hay movimientos registrados</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {misMovimientos.map((mov) => (
                  <div key={mov.id} className="p-4 hover:bg-sena-fondo">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 rounded text-xs text-white ${mov.tipo === 'Salida' ? 'bg-red-600' : 'bg-green-600'}`}>
                        {mov.tipo}
                      </span>
                      <span className="text-xs text-gray-600">{mov.fecha}</span>
                    </div>
                    <p className="titulo text-sm mb-1">{mov.instructor}</p>
                    <p className="text-xs text-gray-700">
                      {mov.materiales.map((m) => `${m.nombre} (${m.cantidadSolicitada})`).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== EVIDENCIAS ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={ImageIcon} texto="Evidencias" />
        {misEvidencias.length === 0 ? (
          <p className="text-sena-oscuro">Todavía no has enviado evidencias</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {misEvidencias.map((ev) => (
              <div key={ev.id} className="p-4 bg-white rounded-lg border-2 border-sena-verde flex gap-4">
                <img src={ev.imagen} alt="Evidencia" className="w-20 h-20 object-cover rounded" />
                <div>
                  <h3 className="titulo mb-2">{ev.mensaje}</h3>
                  <p className="text-sm text-sena-oscuro">Fecha: {ev.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setVentana('evidencia')} className="btn-verde w-full mt-4">Cargar Nueva Evidencia</button>
      </div>

      {/* ===== CANTIDAD DE MATERIALES + SOLICITAR MATERIAL ===== */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* ----- Cantidad de Materiales ----- */}
        <div className="tarjeta">
          <TituloTarjeta Icono={Box} texto="Cantidad de Materiales" tamano="text-xl" />
          <div className="text-center">
            <div className="text-5xl mb-2 font-titulo font-bold text-sena-verde">{misMateriales.length}</div>
            <p className="text-sena-oscuro">Materiales asignados actualmente</p>
          </div>
        </div>

        {/* ----- Solicitar Material ----- */}
        <div className="tarjeta">
          <TituloTarjeta Icono={PlusCircle} texto="Solicitar Material" tamano="text-xl" />
          <p className="mb-4 text-sena-oscuro">Solicita nuevos materiales para tus actividades educativas</p>
          {idsSeleccionados.length > 0 && (
            <div className="mb-4 p-4 bg-sena-verde text-white rounded-lg text-center">
              <p className="font-titulo font-bold">Materiales seleccionados: {idsSeleccionados.length}</p>
              <p className="text-sm mt-1">Total de unidades: {totalUnidades}</p>
            </div>
          )}
          <button onClick={() => setVentana('solicitud')} className="btn-verde w-full">Nueva Solicitud</button>
        </div>
      </div>

      {/* ============================================================
          VENTANA: MATERIALES A DEVOLVER
          ============================================================ */}
      {ventana === 'devolucion' && (
        <Modal titulo="Materiales a Devolver" onCerrar={() => setVentana(null)}>
          <h3 className="titulo text-xl mb-4">Mis Materiales</h3>
          <div className="overflow-x-auto">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Código</th>
                  <th>Estado</th>
                  <th>Fecha Asignación</th>
                  <th className="!text-center">Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {misMateriales.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No tienes materiales para devolver</td></tr>
                )}
                {misMateriales.map((m) => (
                  <tr key={m.id}>
                    <td>{m.nombre}</td>
                    <td>{m.codigo}</td>
                    <td><span className="pastilla">Asignado</span></td>
                    <td>{m.fechaAsignacion}</td>
                    <td>
                      <Casilla marcada={paraDevolver.includes(m.id)} onClick={() => marcarDevolucion(m.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex gap-4">
            <button onClick={devolverMateriales} className="btn-verde flex-1">Devolver Materiales</button>
            <button onClick={() => setVentana(null)} className="btn-gris flex-1">Cancelar</button>
          </div>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: SOLICITUD DE MATERIALES (elegir ítems)
          ============================================================ */}
      {ventana === 'solicitud' && (
        <Modal titulo="Solicitud de Materiales" onCerrar={() => setVentana(null)} ancho="max-w-5xl">

          {/* ----- Barra de presupuesto ----- */}
          <div className="mb-5 p-4 bg-white rounded-xl border-2 border-sena-verde shadow-sm">
            <div className="flex justify-between items-center mb-2 font-titulo font-bold">
              <span className="text-sena-oscuro">Presupuesto utilizado</span>
              <span className={presupuestoLleno ? 'text-red-600' : 'text-sena-verde'}>
                {formatoPesos(totalSolicitud)} / {formatoPesos(PRESUPUESTO_MAXIMO)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${presupuestoLleno ? 'bg-red-600' : 'bg-sena-verde'}`}
                style={{ width: `${Math.min((totalSolicitud / PRESUPUESTO_MAXIMO) * 100, 100)}%` }}
              />
            </div>
            {presupuestoLleno && (
              <p className="mt-2 text-red-600 text-sm text-center font-bold">⚠️ Su presupuesto ya ha sido completado</p>
            )}
          </div>

          {/* ----- Tabla de ítems disponibles ----- */}
          <div className="overflow-x-auto">
            <table className="tabla text-sm">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Disponible</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th className="!text-center">Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {todosLosItems.map((item) => {
                  const marcado = !!seleccion[item.id];
                  return (
                    <tr key={item.id} className={marcado ? '!bg-sena-fondo' : ''}>
                      <td>
                        <div>{item.material}</div>
                        <div className="text-xs text-gray-500">{item.codigo} · {item.coordinacion}</div>
                      </td>
                      <td><span className="px-2 py-0.5 bg-sena-verde text-white rounded-full text-xs">{item.cantidad} uds.</span></td>
                      <td>
                        {marcado ? (
                          <input
                            type="number" min="1" max={item.cantidad}
                            value={seleccion[item.id]}
                            onChange={(e) => cambiarCantidad(item, parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border-2 border-sena-verde rounded text-center"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="font-bold text-sena-verde">{formatoPesos(item.valor)}</td>
                      <td>
                        <Casilla
                          marcada={marcado}
                          bloqueada={!marcado && presupuestoLleno}
                          onClick={() => marcarItem(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ----- Resumen de lo seleccionado ----- */}
          {idsSeleccionados.length > 0 && (
            <div className="mt-4 p-4 bg-sena-oscuro text-white rounded-lg flex justify-between font-titulo font-bold">
              <span>{idsSeleccionados.length} ítem(s) seleccionado(s)</span>
              <span>Total: {formatoPesos(totalSolicitud)}</span>
            </div>
          )}

          <div className="mt-5 flex gap-4">
            <button onClick={continuarFormulario} disabled={idsSeleccionados.length === 0} className="btn-verde flex-1">
              Continuar con Formulario
            </button>
            <button onClick={() => setVentana(null)} className="btn-gris flex-1">Cancelar</button>
          </div>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: FORMATO DE SOLICITUD SENA
          ============================================================ */}
      {ventana === 'formulario' && (
        <Modal titulo="Formato de Solicitud SENA" onCerrar={() => setVentana('solicitud')} fondoBlanco>

          {/* ----- Encabezado del formato con el logo ----- */}
          <div className="border-4 border-sena-oscuro rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <img src={logo} alt="Logo" className="h-20 w-20 rounded-full object-cover" />
              <div className="text-right">
                <h3 className="titulo text-2xl mb-1">SERVICIO NACIONAL DE APRENDIZAJE</h3>
                <p className="text-sena-verde">Formato de Solicitud de Materiales</p>
              </div>
            </div>
            <div className="border-t-2 border-sena-verde pt-4 text-right text-sena-oscuro">
              <p className="mb-2"><strong>Fecha:</strong> {new Date().toLocaleDateString('es-CO')}</p>
              <p><strong>No. de Solicitud:</strong> SOL-{Date.now()}</p>
            </div>
          </div>

          {/* ----- Datos del instructor ----- */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="etiqueta">Nombre(s) <span className="text-red-600">*</span></label>
              <input className="campo" placeholder="Ingrese su(s) nombre(s)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div>
              <label className="etiqueta">Apellido(s) <span className="text-red-600">*</span></label>
              <input className="campo" placeholder="Ingrese su(s) apellido(s)" value={apellido} onChange={(e) => setApellido(e.target.value)} />
            </div>
          </div>

          {/* ----- Formación y tipo de programa ----- */}
          <div className="mb-6">
            <label className="etiqueta">Formación que Dicta / Programa <span className="text-red-600">*</span></label>
            <div className="flex gap-3 items-start">
              <input className="campo flex-1" placeholder="Ej: Técnico en Sistemas, Ficha 2758391"
                value={formacion} onChange={(e) => setFormacion(e.target.value)} />
              <div className="flex flex-col gap-2 shrink-0">
                <span className="text-xs font-titulo font-bold text-sena-oscuro">Tipo</span>
                <div className="flex gap-2">
                  <BotonTipo activo={tipoPrograma === 'tecnologo'} onClick={() => setTipoPrograma('tecnologo')}>Tecnólogo</BotonTipo>
                  <BotonTipo activo={tipoPrograma === 'tecnico'} onClick={() => setTipoPrograma('tecnico')}>Técnico</BotonTipo>
                </div>
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
                  {idsSeleccionados.map((id) => {
                    const item = todosLosItems.find((i) => i.id === id);
                    return (
                      <tr key={id} className="border-b border-gray-300">
                        <td className="py-3 px-4">
                          <div>{item.material}</div>
                          <div className="text-xs text-gray-500">{item.codigo}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{seleccion[id]}</td>
                        <td className="py-3 px-4 text-right font-bold text-sena-verde">{formatoPesos(item.valor * seleccion[id])}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-sena-beige font-titulo font-bold text-sena-oscuro">
                  <tr>
                    <td colSpan="2" className="py-3 px-4 text-right">TOTAL PRESUPUESTO:</td>
                    <td className="py-3 px-4 text-right text-lg">{formatoPesos(totalSolicitud)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ----- Adjuntar formato PDF ----- */}
          <div className="mb-6">
            <h3 className="titulo text-xl mb-1">Formato <span className="text-red-600">*</span></h3>
            <p className="text-sm mb-3 text-sena-verde">Adjunta el formato oficial enviado por el SENA debidamente diligenciado (solo PDF)</p>
            <div className="border-4 border-dashed border-sena-verde rounded-lg p-8 text-center bg-sena-beige hover:bg-green-50">
              {formatoPDF ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-3 bg-white border-2 border-sena-verde rounded-lg px-5 py-4">
                    <FileText size={36} className="text-red-600" />
                    <div className="text-left">
                      <p className="titulo">{formatoPDF}</p>
                      <p className="text-xs text-sena-verde">Formato PDF adjuntado correctamente ✓</p>
                    </div>
                  </div>
                  <button onClick={() => setFormatoPDF(null)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 cursor-pointer" title="Eliminar formato">
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <input type="file" accept=".pdf,application/pdf" onChange={elegirPDF} className="hidden" />
                  <Upload size={48} className="mx-auto mb-4 text-sena-verde" />
                  <p className="text-sena-oscuro">Haz clic para adjuntar el formato SENA</p>
                  <p className="text-sm mt-2 px-4 py-2 bg-sena-verde text-white rounded-lg inline-block">Solo se acepta formato PDF</p>
                </label>
              )}
            </div>
          </div>

          {/* ----- Botones ----- */}
          <div className="flex gap-4 pt-4 border-t-2 border-sena-verde">
            <button onClick={enviarSolicitud} className="btn-verde flex-1 flex items-center justify-center gap-2">
              <FileText size={20} /> Enviar Solicitud
            </button>
            <button onClick={() => setVentana('solicitud')} className="btn-gris flex-1">Volver</button>
          </div>
        </Modal>
      )}

      {/* ============================================================
          VENTANA: CARGAR NUEVA EVIDENCIA
          (Solo se sube una foto guardada en el computador.
           La opción de tomar la foto con la cámara queda pendiente.)
          ============================================================ */}
      {ventana === 'evidencia' && (
        <Modal titulo="Cargar Nueva Evidencia" onCerrar={cerrarEvidencia}>
          <div className="grid md:grid-cols-2 gap-6">

            {/* ----- Fotografía ----- */}
            <div>
              <h3 className="titulo text-lg mb-3">Fotografía</h3>
              <div className="border-4 border-dashed border-sena-verde rounded-lg p-8 text-center bg-white hover:bg-gray-50">
                {imagen ? (
                  <div className="relative">
                    <img src={imagen} alt="Evidencia" className="max-w-full h-auto rounded-lg" />
                    <button onClick={() => setImagen(null)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 cursor-pointer">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input type="file" accept="image/*" onChange={elegirImagen} className="hidden" />
                    <Upload size={48} className="mx-auto mb-4 text-sena-verde" />
                    <p className="text-sena-oscuro">Haz clic para subir una imagen</p>
                  </label>
                )}
              </div>
            </div>

            {/* ----- Mensaje ----- */}
            <div>
              <h3 className="titulo text-lg mb-3">Mensaje</h3>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe un mensaje sobre la evidencia..."
                className="w-full h-64 p-4 border-2 border-sena-verde rounded-lg focus:outline-none focus:ring-2 focus:ring-sena-verde resize-none bg-white"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button onClick={enviarEvidencia} className="btn-verde flex-1">Enviar Evidencia</button>
            <button onClick={cerrarEvidencia} className="btn-gris flex-1">Cancelar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// PIEZAS PEQUEÑAS QUE SOLO USA ESTA PANTALLA
// ============================================================

// Buscador con lupa que va en el encabezado de la tabla
function Buscador({ valor, onCambio }) {
  return (
    <div className="relative font-normal">
      <Search size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-sena-verde" />
      <input type="text" placeholder="Buscar..." value={valor} onChange={(e) => onCambio(e.target.value)} className="buscador" />
    </div>
  );
}

// Cuadrito para seleccionar (se pinta verde con un chulito al marcarlo)
function Casilla({ marcada, bloqueada = false, onClick }) {
  let color = 'bg-white border-sena-oscuro';
  if (marcada) color = 'bg-sena-verde border-sena-verde';
  else if (bloqueada) color = 'bg-gray-200 border-gray-300 !cursor-not-allowed';

  return (
    <button onClick={onClick} disabled={bloqueada} className={`casilla ${color}`}>
      {marcada && <Check size={20} className="text-white" />}
    </button>
  );
}

// Botón de "Tecnólogo" / "Técnico"
function BotonTipo({ activo, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border-2 text-sm font-titulo font-bold cursor-pointer ${
        activo ? 'bg-sena-oscuro text-white border-sena-oscuro' : 'bg-white text-sena-oscuro border-sena-verde hover:bg-sena-fondo'
      }`}
    >
      {children}
    </button>
  );
}

export default Instructor;
