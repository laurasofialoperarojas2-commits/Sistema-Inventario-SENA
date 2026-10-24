import { NavLink, useNavigate } from 'react-router-dom';
import { User, Users, HelpCircle, BarChart3, LogOut } from 'lucide-react';
import logo from '../imagenes/logo.png';

// ===== ENCABEZADO (barra verde de arriba) =====
// Instructor ve: Instructor, Ayuda y Cerrar Sesión
// Administración ve: Administrativos, Ayuda, Reportes y Cerrar Sesión
function Header({ usuario, onLogout }) {
  const navigate = useNavigate();
  const esAdmin = usuario.rol === 'administracion';

  // Clase de cada botón del menú: el de la pantalla actual queda verde
  const claseEnlace = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded transition-colors ${isActive ? 'bg-sena-verde' : 'hover:bg-sena-verde'}`;

  // Cerrar sesión: volvemos al inicio y borramos el usuario
  const cerrarSesion = () => {
    navigate('/');
    onLogout();
  };

  return (
    <header className="no-imprimir bg-sena-oscuro text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ----- Logo ----- */}
        <img src={logo} alt="Logo Inventario SENA" className="h-20 w-20 rounded-full object-cover" />

        {/* ----- Menú de navegación ----- */}
        <nav className="flex items-center gap-2">
          {/* Solo instructor */}
          {!esAdmin && (
            <NavLink to="/instructor" className={claseEnlace}>
              <User size={20} /> Instructor
            </NavLink>
          )}

          {/* Solo administración */}
          {esAdmin && (
            <NavLink to="/administrativos" className={claseEnlace}>
              <Users size={20} /> Administrativos
            </NavLink>
          )}

          {/* Para los dos */}
          <NavLink to="/ayuda" className={claseEnlace}>
            <HelpCircle size={20} /> Ayuda
          </NavLink>

          {/* Solo administración */}
          {esAdmin && (
            <NavLink to="/reportes" className={claseEnlace}>
              <BarChart3 size={20} /> Reportes
            </NavLink>
          )}

          {/* Cerrar sesión (para los dos) */}
          <button onClick={cerrarSesion} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-700 transition-colors ml-2 cursor-pointer">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
