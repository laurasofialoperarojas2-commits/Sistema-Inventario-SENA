// ===== TÍTULO DE UNA TARJETA =====
// Ícono verde + título. Ej: [📦] Mis Materiales Asignados
//  - Icono: el ícono de lucide-react que se quiere mostrar
//  - tamano: tamaño del texto (text-2xl o text-xl)
function TituloTarjeta({ Icono, texto, tamano = 'text-2xl' }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <Icono size={24} className="text-sena-verde" />
      <h2 className={`titulo ${tamano}`}>{texto}</h2>
    </div>
  );
}

export default TituloTarjeta;
