// ============================================================
// DATOS DE PRUEBA
// Como todavía no hay backend, aquí está la información con la
// que arranca el aplicativo. Son los mismos datos del Figma.
// ============================================================

// Tope de dinero de una solicitud de instructor
export const PRESUPUESTO_MAXIMO = 3000000;

// ---------- USUARIOS ----------
// rol puede ser 'instructor' o 'administracion'
export const usuariosIniciales = [
  { id: 1, nombre: 'Carlos Rodríguez', correo: 'instructor@sena.edu.co', password: 'Instructor123', rol: 'instructor' },
  { id: 2, nombre: 'María González', correo: 'instructor2@sena.edu.co', password: 'Instructor123', rol: 'instructor' },
  { id: 3, nombre: 'Administración', correo: 'admin@sena.edu.co', password: 'Admin123', rol: 'administracion' },
];

// ---------- CONTRATOS Y SUS ÍTEMS ----------
export const contratosIniciales = [
  {
    id: 'electronica',
    nombre: 'Electrónica',
    items: [
      { id: 1, codigo: 'ELEC-001', cantidad: 10, material: 'Laptop HP EliteBook', coordinacion: 'Articulación Media', valor: 2500000 },
      { id: 2, codigo: 'ELEC-002', cantidad: 15, material: 'Monitor LG 24"', coordinacion: 'Servicios', valor: 600000 },
      { id: 3, codigo: 'ELEC-003', cantidad: 8, material: 'Proyector Benq', coordinacion: 'Agropecuaria', valor: 800000 },
    ],
  },
  {
    id: 'mobiliario',
    nombre: 'Mobiliario',
    items: [
      { id: 4, codigo: 'MOB-001', cantidad: 25, material: 'Silla Ergonómica', coordinacion: 'Articulación Media', valor: 350000 },
      { id: 5, codigo: 'MOB-002', cantidad: 20, material: 'Escritorio Oficina', coordinacion: 'Servicios', valor: 450000 },
      { id: 6, codigo: 'MOB-003', cantidad: 12, material: 'Estantería Metálica', coordinacion: 'Agropecuaria', valor: 280000 },
    ],
  },
  {
    id: 'herramientas',
    nombre: 'Herramientas',
    items: [
      { id: 7, codigo: 'HER-001', cantidad: 30, material: 'Kit de Destornilladores', coordinacion: 'Articulación Media', valor: 120000 },
      { id: 8, codigo: 'HER-002', cantidad: 18, material: 'Taladro Percutor Bosch', coordinacion: 'Servicios', valor: 280000 },
      { id: 9, codigo: 'HER-003', cantidad: 22, material: 'Multímetro Digital', coordinacion: 'Agropecuaria', valor: 150000 },
    ],
  },
];

// ---------- PRODUCTOS PARA SOLICITUD DE COMPRA (administrativo) ----------
export const productosExternos = [
  { id: 1, nombre: 'Laptop HP EliteBook', codigo: 'LAP-HP-001', costoUnidad: 2500000, costoPorMayor: 2300000, categoria: 'Electrónica' },
  { id: 2, nombre: 'Monitor LG 24"', codigo: 'MON-LG-024', costoUnidad: 600000, costoPorMayor: 550000, categoria: 'Electrónica' },
  { id: 3, nombre: 'Silla Ergonómica', codigo: 'MOB-SIL-005', costoUnidad: 350000, costoPorMayor: 310000, categoria: 'Mobiliario' },
  { id: 4, nombre: 'Escritorio Oficina', codigo: 'MOB-ESC-012', costoUnidad: 450000, costoPorMayor: 400000, categoria: 'Mobiliario' },
  { id: 5, nombre: 'Kit de Destornilladores', codigo: 'HER-KIT-001', costoUnidad: 120000, costoPorMayor: 100000, categoria: 'Herramientas' },
  { id: 6, nombre: 'Taladro Percutor Bosch', codigo: 'HER-TAL-045', costoUnidad: 280000, costoPorMayor: 250000, categoria: 'Herramientas' },
];

// ---------- PREGUNTAS DE LA SECCIÓN AYUDA ----------
export const preguntasAyuda = [
  { id: 1, pregunta: '¿Cómo solicito un nuevo material?', respuesta: 'Dirígete a la sección correspondiente y completa el formulario de solicitud.' },
  { id: 2, pregunta: '¿Cómo devuelvo un material asignado?', respuesta: 'Ve a "Devolver Material" en tu panel y sigue los pasos indicados.' },
  { id: 3, pregunta: '¿Dónde veo mis materiales asignados?', respuesta: 'En la sección "Mis Materiales Asignados" encontrarás toda la información.' },
];

// ============================================================
// DATOS DE LA PANTALLA DE REPORTES
// ============================================================

export const COORDINACIONES = ['Todas', 'Tecnología', 'Diseño', 'Industria', 'Construcción', 'Administración'];
export const CONTRATOS_LISTA = ['Todos', 'Electrónica', 'Mobiliario', 'Herramientas'];

// Colores de las gráficas
export const COLORES = ['#014011', '#025918', '#9FBFAA', '#8B4513', '#2F4F4F'];

// Ítems del reporte de costos
export const itemsCostos = [
  { id: 'b-1', item: 'Laptop Dell XPS 15', coordinacion: 'Tecnología', costoUnidad: 4500000, costoPorMayor: 4200000, contrato: 'Electrónica' },
  { id: 'b-2', item: 'Proyector Epson X49', coordinacion: 'Diseño', costoUnidad: 1800000, costoPorMayor: 1650000, contrato: 'Electrónica' },
  { id: 'b-3', item: 'Tablet Samsung A8', coordinacion: 'Administración', costoUnidad: 980000, costoPorMayor: 890000, contrato: 'Electrónica' },
  { id: 'b-4', item: 'Escritorio Ejecutivo', coordinacion: 'Administración', costoUnidad: 650000, costoPorMayor: 580000, contrato: 'Mobiliario' },
  { id: 'b-5', item: 'Silla Ergonómica', coordinacion: 'Tecnología', costoUnidad: 420000, costoPorMayor: 380000, contrato: 'Mobiliario' },
  { id: 'b-6', item: 'Estantería Metálica', coordinacion: 'Industria', costoUnidad: 310000, costoPorMayor: 270000, contrato: 'Mobiliario' },
  { id: 'b-7', item: 'Taladro Industrial Bosch', coordinacion: 'Construcción', costoUnidad: 550000, costoPorMayor: 500000, contrato: 'Herramientas' },
  { id: 'b-8', item: 'Sierra Circular Makita', coordinacion: 'Construcción', costoUnidad: 780000, costoPorMayor: 710000, contrato: 'Herramientas' },
  { id: 'b-9', item: 'Multímetro Digital', coordinacion: 'Industria', costoUnidad: 180000, costoPorMayor: 155000, contrato: 'Herramientas' },
];

// Productos del reporte de entregas
export const productosEntrega = [
  { id: 1, nombre: 'Laptop Dell XPS 15', codigo: 'ELC-001', contrato: 'Electrónica', coordinacion: 'Tecnología', cantidad: 20, entregado: true, fechaEntrega: '2026-01-15', instructor: 'Carlos Rodríguez' },
  { id: 2, nombre: 'Proyector Epson X49', codigo: 'ELC-002', contrato: 'Electrónica', coordinacion: 'Diseño', cantidad: 8, entregado: true, fechaEntrega: '2026-01-20', instructor: 'María González' },
  { id: 3, nombre: 'Tablet Samsung A8', codigo: 'ELC-003', contrato: 'Electrónica', coordinacion: 'Administración', cantidad: 15, entregado: false },
  { id: 4, nombre: 'Switch TP-Link 24p', codigo: 'ELC-004', contrato: 'Electrónica', coordinacion: 'Tecnología', cantidad: 6, entregado: false },
  { id: 5, nombre: 'Escritorio Ejecutivo', codigo: 'MOB-001', contrato: 'Mobiliario', coordinacion: 'Administración', cantidad: 12, entregado: true, fechaEntrega: '2026-02-03', instructor: 'Juan Pérez' },
  { id: 6, nombre: 'Silla Ergonómica', codigo: 'MOB-002', contrato: 'Mobiliario', coordinacion: 'Tecnología', cantidad: 30, entregado: true, fechaEntrega: '2026-02-10', instructor: 'Ana Torres' },
  { id: 7, nombre: 'Estantería Metálica', codigo: 'MOB-003', contrato: 'Mobiliario', coordinacion: 'Industria', cantidad: 10, entregado: false },
  { id: 8, nombre: 'Archivador 4 cajones', codigo: 'MOB-004', contrato: 'Mobiliario', coordinacion: 'Administración', cantidad: 8, entregado: false },
  { id: 9, nombre: 'Taladro Industrial Bosch', codigo: 'HER-001', contrato: 'Herramientas', coordinacion: 'Construcción', cantidad: 10, entregado: true, fechaEntrega: '2026-01-28', instructor: 'Luis Martínez' },
  { id: 10, nombre: 'Sierra Circular Makita', codigo: 'HER-002', contrato: 'Herramientas', coordinacion: 'Construcción', cantidad: 5, entregado: true, fechaEntrega: '2026-02-05', instructor: 'Luis Martínez' },
  { id: 11, nombre: 'Multímetro Digital', codigo: 'HER-003', contrato: 'Herramientas', coordinacion: 'Industria', cantidad: 20, entregado: false },
  { id: 12, nombre: 'Soldadora MIG Lincoln', codigo: 'HER-004', contrato: 'Herramientas', coordinacion: 'Industria', cantidad: 4, entregado: false },
];

// Trazabilidad: dónde está cada material y cuántos días lleva en uso
export const trazabilidad = [
  { id: 1, material: 'Laptop Dell XPS', ubicacion: 'Ambiente 201', instructor: 'Carlos Rodríguez', dias: 45 },
  { id: 2, material: 'Proyector Epson', ubicacion: 'Ambiente 305', instructor: 'María González', dias: 30 },
  { id: 3, material: 'Taladro Industrial', ubicacion: 'Taller Mecánico', instructor: 'Juan Pérez', dias: 15 },
  { id: 4, material: 'Sierra Circular', ubicacion: 'Taller Madera', instructor: 'Luis Martínez', dias: 22 },
  { id: 5, material: 'Silla Ergonómica', ubicacion: 'Aula 105', instructor: 'Ana Torres', dias: 60 },
];

// Gráfica de barras: inversión de cada mes por contrato
export const inversionMensual = [
  { mes: 'Ene', Electrónica: 18500000, Mobiliario: 9200000, Herramientas: 5100000 },
  { mes: 'Feb', Electrónica: 14200000, Mobiliario: 11500000, Herramientas: 4200000 },
  { mes: 'Mar', Electrónica: 22100000, Mobiliario: 8700000, Herramientas: 6800000 },
  { mes: 'Abr', Electrónica: 16800000, Mobiliario: 13200000, Herramientas: 3900000 },
  { mes: 'May', Electrónica: 19400000, Mobiliario: 10100000, Herramientas: 7200000 },
  { mes: 'Jun', Electrónica: 25600000, Mobiliario: 12800000, Herramientas: 5500000 },
  { mes: 'Jul', Electrónica: 21300000, Mobiliario: 9600000, Herramientas: 4700000 },
  { mes: 'Ago', Electrónica: 17900000, Mobiliario: 14300000, Herramientas: 6100000 },
  { mes: 'Sep', Electrónica: 23800000, Mobiliario: 11700000, Herramientas: 5800000 },
  { mes: 'Oct', Electrónica: 20100000, Mobiliario: 10900000, Herramientas: 7600000 },
  { mes: 'Nov', Electrónica: 28400000, Mobiliario: 15200000, Herramientas: 8300000 },
  { mes: 'Dic', Electrónica: 31200000, Mobiliario: 17800000, Herramientas: 9400000 },
];

// Gráfica de torta: en qué se reparte el dinero de cada contrato
export const tortaPorContrato = {
  Electrónica: [
    { name: 'Laptops', value: 90000000 },
    { name: 'Proyectores', value: 17136000 },
    { name: 'Tablets', value: 17493000 },
    { name: 'Redes', value: 8500000 },
    { name: 'Periféricos', value: 5200000 },
  ],
  Mobiliario: [
    { name: 'Escritorios', value: 9282000 },
    { name: 'Sillas', value: 14994000 },
    { name: 'Estanterías', value: 3689000 },
    { name: 'Archivadores', value: 4200000 },
    { name: 'Otros', value: 2100000 },
  ],
  Herramientas: [
    { name: 'Perforación', value: 6545000 },
    { name: 'Corte', value: 4641000 },
    { name: 'Medición', value: 4284000 },
    { name: 'Soldadura', value: 7200000 },
    { name: 'Otros', value: 1800000 },
  ],
};

// ============================================================
// FUNCIONES DE AYUDA
// ============================================================

// Convierte un número a pesos. Ej: 950000 -> "$950.000"
export function formatoPesos(valor) {
  return '$' + Number(valor).toLocaleString('es-CO');
}

// Fecha de hoy en formato 2026-10-13
export function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

// Descarga una tabla como archivo que se abre en Excel (formato CSV).
// "filas" es una lista de listas: la primera fila son los títulos.
export function descargarExcel(nombreArchivo, filas) {
  const texto = filas.map((fila) => fila.map((celda) => `"${celda}"`).join(';')).join('\n');
  // "﻿" sirve para que Excel muestre bien las tildes
  const archivo = new Blob(['﻿' + texto], { type: 'text/csv;charset=utf-8' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(archivo);
  enlace.download = nombreArchivo + '.csv';
  enlace.click();
  
}
