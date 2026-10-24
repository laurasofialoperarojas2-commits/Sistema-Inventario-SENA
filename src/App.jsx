import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ---------- Encabezado con el menú ----------
import Header from './componentes/Header';

// ---------- Pantallas ----------
import Login from './pantallas/Login';
import Instructor from './pantallas/Instructor';
import Administrativos from './pantallas/Administrativos';
import Ayuda from './pantallas/Ayuda';
import Reportes from './pantallas/Reportes';

// ---------- Datos de prueba ----------
import { usuariosIniciales, contratosIniciales } from './datos/datos';

function App() {

  // ===== SESIÓN =====
  // usuario = null significa que nadie ha iniciado sesión
  const [usuario, setUsuario] = useState(null);
  // Lista de usuarios (crece cuando alguien usa "Crear Cuenta Nueva")
  const [usuarios, setUsuarios] = useState(usuariosIniciales);

  // ===== DATOS COMPARTIDOS ENTRE PANTALLAS =====
  // Están aquí para que instructor y administración vean lo mismo.
  // Ej: el instructor envía una solicitud -> la administración la ve y la acepta
  //     -> el instructor ve el material en "Mis Materiales Asignados".
  const [contratos, setContratos] = useState(contratosIniciales);
  const [solicitudes, setSolicitudes] = useState([]);           // solicitudes de instructores
  const [asignaciones, setAsignaciones] = useState([]);         // materiales que tiene cada instructor
  const [movimientos, setMovimientos] = useState([]);           // historial de salidas y devoluciones
  const [configuraciones, setConfiguraciones] = useState([]);   // historial de cambios en contratos
  const [evidencias, setEvidencias] = useState([]);             // fotos que suben los instructores
  const [solicitudesCompra, setSolicitudesCompra] = useState([]); // compras que pide la administración

  // ===== SI NO HAY SESIÓN, SOLO SE MUESTRA EL LOGIN =====
  if (!usuario) {
    return <Login usuarios={usuarios} setUsuarios={setUsuarios} onLoginSuccess={setUsuario} />;
  }

  const esAdmin = usuario.rol === 'administracion';
  // Pantalla principal de cada rol
  const inicio = esAdmin ? '/administrativos' : '/instructor';

  return (
    <Router>
      <div className="min-h-screen bg-sena-fondo">

        {/* ===== ENCABEZADO CON EL MENÚ ===== */}
        <Header usuario={usuario} onLogout={() => setUsuario(null)} />

        {/* ===== CONTENIDO DE CADA PANTALLA ===== */}
        <main className="max-w-screen-2xl mx-auto px-6 py-8">
          <Routes>
            {/* Panel del instructor (solo instructores) */}
            <Route path="/instructor" element={
              esAdmin ? <Navigate to={inicio} /> : (
                <Instructor
                  usuario={usuario}
                  contratos={contratos} setContratos={setContratos}
                  solicitudes={solicitudes} setSolicitudes={setSolicitudes}
                  asignaciones={asignaciones} setAsignaciones={setAsignaciones}
                  movimientos={movimientos} setMovimientos={setMovimientos}
                  evidencias={evidencias} setEvidencias={setEvidencias}
                />
              )
            } />

            {/* Panel administrativo (solo administración) */}
            <Route path="/administrativos" element={
              !esAdmin ? <Navigate to={inicio} /> : (
                <Administrativos
                  contratos={contratos} setContratos={setContratos}
                  solicitudes={solicitudes} setSolicitudes={setSolicitudes}
                  asignaciones={asignaciones} setAsignaciones={setAsignaciones}
                  movimientos={movimientos} setMovimientos={setMovimientos}
                  configuraciones={configuraciones} setConfiguraciones={setConfiguraciones}
                  evidencias={evidencias}
                  solicitudesCompra={solicitudesCompra} setSolicitudesCompra={setSolicitudesCompra}
                />
              )
            } />

            {/* Reportes (solo administración) */}
            <Route path="/reportes" element={
              !esAdmin ? <Navigate to={inicio} /> : <Reportes solicitudesCompra={solicitudesCompra} />
            } />

            {/* Ayuda (los dos roles) */}
            <Route path="/ayuda" element={<Ayuda />} />

            {/* Cualquier otra ruta lleva a la pantalla principal del rol */}
            <Route path="*" element={<Navigate to={inicio} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
