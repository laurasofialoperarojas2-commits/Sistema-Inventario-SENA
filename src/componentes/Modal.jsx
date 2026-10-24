import { X } from 'lucide-react';

// ===== VENTANA EMERGENTE (MODAL) =====
// Fondo oscuro + cuadro beige con barra verde arriba y una X para cerrar.
//  - titulo: texto de la barra verde
//  - onCerrar: función que se ejecuta al presionar la X
//  - ancho: tamaño máximo del cuadro (por defecto max-w-4xl)
//  - fondoBlanco: si es true el cuadro es blanco en vez de beige
function Modal({ titulo, onCerrar, ancho = 'max-w-4xl', fondoBlanco = false, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className={`zona-imprimir ${fondoBlanco ? 'bg-white' : 'bg-sena-beige'} rounded-xl shadow-2xl ${ancho} w-full max-h-[90vh] overflow-y-auto`}>

        {/* Barra verde con el título y la X */}
        <div className="sticky top-0 z-10 bg-sena-oscuro text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-2xl font-titulo font-bold">{titulo}</h2>
          <button onClick={onCerrar} className="no-imprimir cursor-pointer hover:text-gray-300">
            <X size={28} />
          </button>
        </div>

        {/* Contenido de la ventana */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
