import React, { useState } from 'react';
import { DollarSign, TrendingUp, Search, X, PieChart as IconoTorta, CheckCircle2, XCircle, Filter, Package, FileText } from 'lucide-react';
// Recharts es la librería que dibuja las gráficas
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TituloTarjeta from '../componentes/TituloTarjeta';
import {
  COORDINACIONES, CONTRATOS_LISTA, COLORES,
  itemsCostos, productosEntrega, trazabilidad, inversionMensual, tortaPorContrato,
  formatoPesos,
} from '../datos/datos';

// ===== REPORTES Y ANÁLISIS (solo administración) =====
function Reportes({ solicitudesCompra }) {

  // ---------- FILTROS DEL REPORTE DE COSTOS ----------
  const [buscarItem, setBuscarItem] = useState('');
  const [buscarUnidad, setBuscarUnidad] = useState('');
  const [buscarMayor, setBuscarMayor] = useState('');
  const [filtroContrato, setFiltroContrato] = useState('Todos');
  const [filtroCoord, setFiltroCoord] = useState('Todas');

  // ---------- FILTROS DEL REPORTE DE ENTREGAS ----------
  const [entregaContrato, setEntregaContrato] = useState('Todos');
  const [entregaCoord, setEntregaCoord] = useState('Todas');
  const [entregaEstado, setEntregaEstado] = useState('Todos');

  // ---------- FILTROS DE TRAZABILIDAD ----------
  const [buscarMaterial, setBuscarMaterial] = useState('');
  const [buscarUbicacion, setBuscarUbicacion] = useState('');
  const [buscarInstructor, setBuscarInstructor] = useState('');
  const [buscarDias, setBuscarDias] = useState('');

  // ---------- VENTANA DE GRÁFICAS ----------
  const [verGraficas, setVerGraficas] = useState(false);
  const [contratoTorta, setContratoTorta] = useState('Electrónica');

  // ============================================================
  // CÁLCULOS
  // ============================================================

  // Ítems de costos + las compras que pidió la administración
  const todosLosItems = [
    ...itemsCostos,
    ...solicitudesCompra.map((s) => ({
      id: 'sol-' + s.idSolicitud,
      item: s.nombre,
      coordinacion: 'Sin coordinación',
      costoUnidad: s.costoUnidad,
      costoPorMayor: s.costoPorMayor,
      contrato: s.categoria,
    })),
  ];

  // Reporte de costos con los filtros aplicados
  const itemsFiltrados = todosLosItems.filter((i) =>
    i.item.toLowerCase().includes(buscarItem.toLowerCase()) &&
    i.costoUnidad.toString().includes(buscarUnidad) &&
    i.costoPorMayor.toString().includes(buscarMayor) &&
    (filtroContrato === 'Todos' || i.contrato === filtroContrato) &&
    (filtroCoord === 'Todas' || i.coordinacion === filtroCoord)
  );

  const costoTotal = todosLosItems.reduce((suma, i) => suma + i.costoUnidad, 0);
  const proyeccionAnual = costoTotal * 12;

  // Reporte de entregas con los filtros aplicados
  const entregasFiltradas = productosEntrega.filter((p) =>
    (entregaContrato === 'Todos' || p.contrato === entregaContrato) &&
    (entregaCoord === 'Todas' || p.coordinacion === entregaCoord) &&
    (entregaEstado === 'Todos' || (entregaEstado === 'Entregado') === p.entregado)
  );
  const entregados = productosEntrega.filter((p) => p.entregado).length;
  const pendientes = productosEntrega.length - entregados;

  // Trazabilidad con los buscadores aplicados
  const trazabilidadFiltrada = trazabilidad.filter((t) =>
    t.material.toLowerCase().includes(buscarMaterial.toLowerCase()) &&
    t.ubicacion.toLowerCase().includes(buscarUbicacion.toLowerCase()) &&
    t.instructor.toLowerCase().includes(buscarInstructor.toLowerCase()) &&
    t.dias.toString().includes(buscarDias)
  );

  // Datos de la torta del contrato elegido
  const datosTorta = tortaPorContrato[contratoTorta];
  const totalTorta = datosTorta.reduce((suma, d) => suma + d.value, 0);

  // Color de la etiqueta de cada contrato
  const colorContrato = (contrato) =>
    contrato === 'Electrónica' ? 'bg-sena-oscuro' : contrato === 'Mobiliario' ? 'bg-sena-verde' : 'bg-[#8B4513]';

  // ============================================================
  // LO QUE SE VE EN PANTALLA
  // (zona-imprimir: es lo que sale al presionar "Exportar PDF")
  // ============================================================
  return (
    <div className="space-y-6 zona-imprimir">

      {/* ===== TÍTULO ===== */}
      <div className="tarjeta">
        <h1 className="titulo text-3xl mb-1">Reportes y Análisis</h1>
        <p className="text-sena-verde">
          Información detallada sobre ítems, costos, coordinaciones, trazabilidad y estado de entregas
        </p>
      </div>

      {/* ===== REPORTE DE COSTOS ===== */}
      <div className="tarjeta">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <TituloTarjeta Icono={DollarSign} texto="Reporte de Costos" />
          <div className="no-imprimir flex flex-wrap gap-3">
            <FiltroLista valor={filtroContrato} onCambio={setFiltroContrato} opciones={CONTRATOS_LISTA} etiqueta="Contrato" />
            <FiltroLista valor={filtroCoord} onCambio={setFiltroCoord} opciones={COORDINACIONES} etiqueta="Coordinación" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="tabla text-sm">
            <thead>
              <tr>
                <th>Ítem<Buscador valor={buscarItem} onCambio={setBuscarItem} /></th>
                <th>Contrato</th>
                <th>Costo/Unidad<Buscador valor={buscarUnidad} onCambio={setBuscarUnidad} /></th>
                <th>Costo/Mayor<Buscador valor={buscarMayor} onCambio={setBuscarMayor} /></th>
              </tr>
            </thead>
            <tbody>
              {itemsFiltrados.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-8 text-gray-500">No se encontraron ítems con los filtros aplicados.</td></tr>
              ) : (
                itemsFiltrados.map((i) => (
                  <tr key={i.id} className="hover:!bg-sena-fondo">
                    <td>{i.item}</td>
                    <td><span className={`px-2 py-0.5 rounded text-xs text-white ${colorContrato(i.contrato)}`}>{i.contrato}</span></td>
                    <td className="font-bold text-sena-verde">{formatoPesos(i.costoUnidad)}</td>
                    <td className="font-bold text-sena-verde">{formatoPesos(i.costoPorMayor)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ----- Resumen de inversión ----- */}
        <div className="mt-5 p-4 bg-white rounded-lg border-l-4 border-sena-verde">
          <h3 className="titulo mb-3">Resumen de Inversión</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <CuadroResumen texto="Total ítems mostrados" valor={itemsFiltrados.length} />
            <CuadroResumen texto="Costo total ítems" valor={formatoPesos(costoTotal)} />
            <CuadroResumen texto="Proyección anual 2026" valor={formatoPesos(proyeccionAnual)} />
          </div>
        </div>
      </div>

      {/* ===== ESTADO DE ENTREGAS DE PRODUCTOS ===== */}
      <div className="tarjeta">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <TituloTarjeta Icono={Package} texto="Estado de Entregas de Productos" />
          <div className="flex gap-3">
            <span className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
              <CheckCircle2 size={16} /> {entregados} Entregados
            </span>
            <span className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm">
              <XCircle size={16} /> {pendientes} Pendientes
            </span>
          </div>
        </div>

        {/* ----- Filtros ----- */}
        <div className="no-imprimir flex flex-wrap gap-3 mb-5 p-3 bg-white rounded-lg border border-sena-verde">
          <FiltroLista valor={entregaContrato} onCambio={setEntregaContrato} opciones={CONTRATOS_LISTA} etiqueta="Contrato" />
          <FiltroLista valor={entregaCoord} onCambio={setEntregaCoord} opciones={COORDINACIONES} etiqueta="Coordinación" />
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-sena-verde" />
            {['Todos', 'Entregado', 'Pendiente'].map((estado) => (
              <button
                key={estado}
                onClick={() => setEntregaEstado(estado)}
                className={`px-3 py-1 rounded-full text-xs border font-titulo font-bold cursor-pointer ${
                  entregaEstado === estado ? 'bg-sena-oscuro text-white border-sena-oscuro' : 'bg-white text-sena-oscuro border-sena-verde hover:bg-sena-fondo'
                }`}
              >
                {estado}
              </button>
            ))}
            <span className="titulo text-sm">Estado</span>
          </div>
        </div>

        {/* ----- Tabla ----- */}
        <div className="overflow-x-auto">
          <table className="tabla text-sm">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Contrato</th>
                <th>Coordinación</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Fecha Entrega</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {entregasFiltradas.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">No se encontraron productos con los filtros aplicados.</td></tr>
              ) : (
                entregasFiltradas.map((p) => (
                  <tr key={p.id} className="hover:!bg-sena-fondo">
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td><span className={`px-2 py-0.5 rounded text-xs text-white ${colorContrato(p.contrato)}`}>{p.contrato}</span></td>
                    <td>{p.coordinacion}</td>
                    <td className="text-center font-bold text-sena-verde">{p.cantidad}</td>
                    <td>
                      {p.entregado
                        ? <span className="flex items-center gap-1 text-green-700"><CheckCircle2 size={16} /> Entregado</span>
                        : <span className="flex items-center gap-1 text-red-600"><XCircle size={16} /> Pendiente</span>}
                    </td>
                    <td>{p.fechaEntrega || '—'}</td>
                    <td>{p.instructor || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== TRAZABILIDAD DE MATERIAL ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={TrendingUp} texto="Trazabilidad de Material" />
        <div className="overflow-x-auto">
          <table className="tabla text-sm">
            <thead>
              <tr>
                <th>Material<Buscador valor={buscarMaterial} onCambio={setBuscarMaterial} /></th>
                <th>Ubicación Actual<Buscador valor={buscarUbicacion} onCambio={setBuscarUbicacion} /></th>
                <th>Instructor Asignado<Buscador valor={buscarInstructor} onCambio={setBuscarInstructor} /></th>
                <th>Días en Uso<Buscador valor={buscarDias} onCambio={setBuscarDias} /></th>
              </tr>
            </thead>
            <tbody>
              {trazabilidadFiltrada.map((t) => (
                <tr key={t.id} className="hover:!bg-sena-fondo">
                  <td>{t.material}</td>
                  <td>{t.ubicacion}</td>
                  <td>{t.instructor}</td>
                  <td>
                    {/* Semáforo: rojo 45 días o más, amarillo 25 a 44, verde menos de 25 */}
                    <span className={`px-3 py-1 rounded-full text-xs text-white ${t.dias >= 45 ? 'bg-red-600' : t.dias >= 25 ? 'bg-yellow-500' : 'bg-sena-verde'}`}>
                      {t.dias} días
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <CuadroResumen texto="Total Materiales" valor={243} blanco />
          <CuadroResumen texto="En Uso" valor={187} blanco />
          <CuadroResumen texto="Disponibles" valor={56} blanco />
        </div>
      </div>

      {/* ===== BOTONES: EXPORTAR PDF Y VER GRÁFICAS ===== */}
      <div className="no-imprimir grid sm:grid-cols-2 gap-4">
        {/* Abre la ventana de imprimir del navegador; ahí se elige "Guardar como PDF" */}
        <button onClick={() => window.print()} className="btn-verde py-4 flex items-center justify-center gap-2 shadow">
          <FileText size={20} /> Exportar PDF
        </button>
        <button onClick={() => setVerGraficas(true)} className="btn-verde !bg-sena-oscuro hover:!bg-sena-verde py-4 flex items-center justify-center gap-2 shadow">
          <IconoTorta size={20} /> Ver Gráficas
        </button>
      </div>

      {/* ============================================================
          VENTANA: ANÁLISIS ESTADÍSTICO (GRÁFICAS)
          ============================================================ */}
      {verGraficas && (
        <div className="no-imprimir fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-sena-beige rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto p-8 border-4 border-sena-oscuro">

            {/* ----- Encabezado ----- */}
            <div className="flex justify-between items-center mb-6 border-b-4 border-sena-oscuro pb-4">
              <div className="flex items-center gap-3">
                <IconoTorta size={32} className="text-sena-oscuro" />
                <h2 className="titulo text-3xl">Análisis Estadístico — Inventario</h2>
              </div>
              <button onClick={() => setVerGraficas(false)} className="text-sena-oscuro hover:text-red-700 p-2 cursor-pointer">
                <X size={36} />
              </button>
            </div>

            <div className="space-y-8">

              {/* ----- Gráfica 1: barras de inversión mensual ----- */}
              <div className="bg-white p-6 rounded-xl border-2 border-sena-verde">
                <h3 className="titulo text-xl mb-1 text-center">Inversión Mensual por Contrato — 2026</h3>
                <p className="text-center text-sm mb-4 text-gray-500">(Valores en pesos colombianos)</p>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inversionMensual}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={(v) => `$${v / 1000000}M`} />
                      <Tooltip formatter={(v) => formatoPesos(v)} />
                      <Legend />
                      <Bar dataKey="Electrónica" fill="#014011" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Mobiliario" fill="#025918" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Herramientas" fill="#9FBFAA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ----- Gráfica 2: torta por contrato ----- */}
              <div className="bg-white p-6 rounded-xl border-2 border-sena-verde">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
                  <h3 className="titulo text-xl">Distribución de Ítems por Contrato (%)</h3>
                  {/* Botones para elegir el contrato */}
                  <div className="flex gap-2">
                    {['Electrónica', 'Mobiliario', 'Herramientas'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setContratoTorta(c)}
                        className={`px-4 py-1.5 rounded-full text-sm border-2 font-titulo font-bold cursor-pointer ${
                          contratoTorta === c ? 'bg-sena-oscuro text-white border-sena-oscuro' : 'bg-white text-sena-oscuro border-sena-verde hover:bg-sena-fondo'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* La torta */}
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={datosTorta} dataKey="value"
                          cx="50%" cy="50%" outerRadius={120} innerRadius={50}
                          labelLine={false}
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {datosTorta.map((d, i) => <Cell key={d.name} fill={COLORES[i % COLORES.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => formatoPesos(v)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Lista con el porcentaje de cada parte */}
                  <div>
                    <p className="titulo mb-3">Contrato: <span className="text-sena-verde">{contratoTorta}</span></p>
                    <div className="space-y-2">
                      {datosTorta.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORES[i % COLORES.length] }} />
                          <span className="flex-1 text-sm">{d.name}</span>
                          <span className="text-sm font-bold text-sena-verde">{((d.value / totalTorta) * 100).toFixed(1)}%</span>
                          <span className="text-xs text-gray-500">{formatoPesos(d.value)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-sena-beige rounded-lg border border-sena-verde titulo text-sm">
                      Total contrato: <span className="text-sena-verde">{formatoPesos(totalTorta)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button onClick={() => setVerGraficas(false)} className="btn-verde px-12 py-4 rounded-xl shadow-lg">
                Cerrar Panel de Análisis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PIEZAS PEQUEÑAS QUE SOLO USA ESTA PANTALLA
// ============================================================

// Buscador pequeño con lupa (va debajo del título de una columna)
function Buscador({ valor, onCambio }) {
  return (
    <div className="no-imprimir relative mt-1 font-normal">
      <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-sena-verde" />
      <input type="text" placeholder="Buscar…" value={valor} onChange={(e) => onCambio(e.target.value)} className="buscador text-xs w-32" />
    </div>
  );
}

// Lista desplegable para filtrar (Contrato, Coordinación)
function FiltroLista({ valor, onCambio, opciones, etiqueta }) {
  return (
    <div className="flex items-center gap-2">
      <Filter size={15} className="text-sena-verde" />
      <select value={valor} onChange={(e) => onCambio(e.target.value)}
        className="px-2 py-1.5 border border-sena-verde rounded text-sm bg-white focus:outline-none">
        {opciones.map((o) => <option key={o}>{o}</option>)}
      </select>
      <span className="titulo text-sm">{etiqueta}</span>
    </div>
  );
}

// Cuadrito con un texto pequeño y un número grande
function CuadroResumen({ texto, valor, blanco = false }) {
  return (
    <div className={`p-3 rounded-lg border border-sena-verde text-center ${blanco ? 'bg-white' : 'bg-sena-beige'}`}>
      <p className="text-xs mb-1">{texto}</p>
      <p className="titulo text-2xl !text-sena-verde">{valor}</p>
    </div>
  );
}

export default Reportes;
