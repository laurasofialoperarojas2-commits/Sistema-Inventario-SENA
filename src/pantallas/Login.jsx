import React, { useState } from 'react';
import { ChevronDown, Lock, User, Mail, X } from 'lucide-react';
import logo from '../imagenes/logo.png';

// ===== PANTALLA DE INICIO DE SESIÓN =====
function Login({ usuarios, setUsuarios, onLoginSuccess }) {

  // ---------- ESTADOS DEL FORMULARIO DE INICIO ----------
  const [rol, setRol] = useState('instructor');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false); // lista desplegable de tipo de usuario

  // ---------- ESTADOS DE LAS VENTANAS ----------
  const [ventana, setVentana] = useState(null); // 'recuperar', 'crear' o null
  const [enviado, setEnviado] = useState(false); // muestra el mensaje de éxito

  // Campos de "Recuperar contraseña"
  const [documentoRec, setDocumentoRec] = useState('');
  const [correoRec, setCorreoRec] = useState('');

  // Campos de "Crear cuenta"
  const [nueva, setNueva] = useState({ documento: '', correo: '', dependencia: '', password: '', repetir: '' });

  // ---------- INICIAR SESIÓN ----------
  const iniciarSesion = (e) => {
    e.preventDefault(); // evita que la página se recargue

    const encontrado = usuarios.find(
      (u) => u.correo === correo.trim().toLowerCase() && u.password === password && u.rol === rol
    );

    if (!encontrado) {
      setError('Correo, contraseña o tipo de usuario incorrectos');
      return;
    }
    onLoginSuccess(encontrado); // le avisamos a App.jsx quién entró
  };

  // ---------- CERRAR CUALQUIER VENTANA Y LIMPIAR ----------
  const cerrarVentana = () => {
    setVentana(null);
    setEnviado(false);
    setDocumentoRec('');
    setCorreoRec('');
    setNueva({ documento: '', correo: '', dependencia: '', password: '', repetir: '' });
  };

  // ---------- RECUPERAR CONTRASEÑA ----------
  // Por ahora solo simula el envío del correo
  const recuperar = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(cerrarVentana, 3000); // a los 3 segundos se cierra sola
  };

  // ---------- CREAR CUENTA NUEVA ----------
  const crearCuenta = (e) => {
    e.preventDefault();

    if (nueva.password !== nueva.repetir) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (nueva.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (usuarios.some((u) => u.correo === nueva.correo.toLowerCase())) {
      alert('Ya existe una cuenta con ese correo');
      return;
    }

    // Las cuentas nuevas se crean como instructor
    const cuenta = {
      id: Date.now(),
      nombre: nueva.correo.split('@')[0],
      correo: nueva.correo.toLowerCase(),
      password: nueva.password,
      documento: nueva.documento,
      dependencia: nueva.dependencia,
      rol: 'instructor',
    };
    setUsuarios([...usuarios, cuenta]);
    setEnviado(true);
    setTimeout(cerrarVentana, 3000);
  };

  // Cambia un campo del formulario "Crear cuenta"
  const cambiarNueva = (campo, valor) => setNueva({ ...nueva, [campo]: valor });

  return (
    <div className="min-h-screen bg-sena-fondo flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* ===== LOGO Y TÍTULO ===== */}
        <div className="text-center mb-8">
          <div className="inline-block bg-sena-oscuro p-6 rounded-2xl mb-6">
            <img src={logo} alt="Logo Inventario SENA" className="h-20 w-20 rounded-full object-cover mx-auto" />
          </div>
          <h1 className="titulo text-3xl mb-2">Sistema de Inventario SENA</h1>
        </div>

        {/* ===== FORMULARIO DE INICIO DE SESIÓN ===== */}
        <form onSubmit={iniciarSesion} className="bg-sena-beige rounded-xl shadow-xl p-8">

          {/* ----- Tipo de usuario (lista desplegable) ----- */}
          <div className="mb-6">
            <label className="etiqueta">Tipo de Usuario</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMostrarLista(!mostrarLista)}
                className="w-full bg-white border-2 border-sena-oscuro rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sena-oscuro">
                  <User size={20} className="text-sena-verde" />
                  {rol === 'instructor' ? 'Instructor' : 'Administración'}
                </span>
                <ChevronDown size={20} className={`text-sena-verde transition-transform ${mostrarLista ? 'rotate-180' : ''}`} />
              </button>

              {/* Opciones (solo se ven si la lista está abierta) */}
              {mostrarLista && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-sena-oscuro rounded-lg shadow-lg overflow-hidden z-10">
                  <button type="button" onClick={() => { setRol('instructor'); setMostrarLista(false); }}
                    className="w-full px-4 py-3 text-left hover:bg-sena-fondo flex items-center gap-2 cursor-pointer">
                    <User size={18} className="text-sena-verde" /> Instructor
                  </button>
                  <button type="button" onClick={() => { setRol('administracion'); setMostrarLista(false); }}
                    className="w-full px-4 py-3 text-left hover:bg-sena-fondo flex items-center gap-2 border-t border-gray-200 cursor-pointer">
                    <User size={18} className="text-sena-verde" /> Administración
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ----- Correo ----- */}
          <div className="mb-6">
            <label className="etiqueta">Correo</label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sena-verde" />
              <input type="email" required placeholder="correo@sena.edu.co" className="campo pl-12"
                value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </div>
          </div>

          {/* ----- Contraseña ----- */}
          <div className="mb-6">
            <label className="etiqueta">Contraseña</label>
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-sena-verde" />
              <input type="password" required placeholder="Contraseña" className="campo pl-12"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {/* Mensaje de error (solo aparece si hay error) */}
          {error && <p className="mb-4 text-sm text-red-600 text-center">{error}</p>}

          {/* ----- Botón Iniciar Sesión ----- */}
          <button type="submit" className="btn-verde w-full shadow-lg">Iniciar Sesión</button>

          {/* ----- ¿Olvidaste tu contraseña? ----- */}
          <div className="text-center mt-4">
            <button type="button" onClick={() => setVentana('recuperar')} className="text-sena-verde hover:text-sena-oscuro cursor-pointer">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        {/* ===== BOTÓN CREAR CUENTA NUEVA ===== */}
        <button
          type="button"
          onClick={() => setVentana('crear')}
          className="mt-6 w-full bg-white border-2 border-sena-verde text-sena-verde py-3 rounded-lg hover:bg-sena-verde hover:text-white transition-colors shadow-lg font-titulo font-bold cursor-pointer"
        >
          Crear Cuenta Nueva
        </button>

        {/* Usuarios de prueba (para no olvidarlos) */}
        <p className="mt-4 text-center text-xs text-sena-oscuro/70">
          Prueba: instructor@sena.edu.co / Instructor123 — admin@sena.edu.co / Admin123
        </p>
      </div>

      {/* ===== VENTANA: CREAR CUENTA ===== */}
      {ventana === 'crear' && (
        <VentanaLogin onCerrar={cerrarVentana}>
          {!enviado ? (
            <form onSubmit={crearCuenta} className="border-2 border-sena-verde rounded-lg p-8">
              <h2 className="titulo text-3xl mb-8">Crear cuenta</h2>

              <CampoVentana etiqueta="Ingrese su documento" placeholder="Número de documento"
                valor={nueva.documento} onCambio={(v) => cambiarNueva('documento', v)} />
              <CampoVentana etiqueta="Correo institucional" tipo="email" placeholder="ejemplo@sena.edu.co"
                valor={nueva.correo} onCambio={(v) => cambiarNueva('correo', v)} />
              <CampoVentana etiqueta="Dependencia" placeholder="A que programa pertenece"
                valor={nueva.dependencia} onCambio={(v) => cambiarNueva('dependencia', v)} />
              <CampoVentana etiqueta="Contraseña" tipo="password" placeholder="Ingrese su contraseña"
                valor={nueva.password} onCambio={(v) => cambiarNueva('password', v)} />
              <CampoVentana etiqueta="Repita su contraseña" tipo="password" placeholder="Repita su contraseña"
                valor={nueva.repetir} onCambio={(v) => cambiarNueva('repetir', v)} />

              <p className="mb-8 text-sena-oscuro">Asegúrese de que sea una contraseña segura.</p>

              <div className="flex gap-3">
                <button type="submit" className="btn-verde flex-1 shadow-lg">Crear Cuenta</button>
                <button type="button" onClick={cerrarVentana} className="btn-gris flex-1 shadow-lg">Cancelar</button>
              </div>
            </form>
          ) : (
            <MensajeExito Icono={User} titulo="¡Cuenta Creada!">
              Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión con tus credenciales.
            </MensajeExito>
          )}
        </VentanaLogin>
      )}

      {/* ===== VENTANA: RECUPERAR CONTRASEÑA ===== */}
      {ventana === 'recuperar' && (
        <VentanaLogin onCerrar={cerrarVentana}>
          {!enviado ? (
            <form onSubmit={recuperar} className="border-2 border-sena-verde rounded-lg p-8">
              <h2 className="titulo text-3xl mb-8">Recuperación de contraseña</h2>

              <CampoVentana etiqueta="Documento" placeholder="Ingrese su número de documento"
                valor={documentoRec} onCambio={setDocumentoRec} />
              <CampoVentana etiqueta="Correo Soy Sena" tipo="email" placeholder="ejemplo@soysena.edu.co"
                valor={correoRec} onCambio={setCorreoRec} />

              <p className="mb-8 text-sena-oscuro">
                Al momento que se rellene bien la documentación a su correo se enviará su contraseña actual.
              </p>

              <div className="flex gap-3">
                <button type="submit" className="btn-verde flex-1 shadow-lg">Enviar</button>
                <button type="button" onClick={cerrarVentana} className="btn-gris flex-1 shadow-lg">Cancelar</button>
              </div>
            </form>
          ) : (
            <MensajeExito Icono={Mail} titulo="¡Correo Enviado!">
              Hemos enviado tu contraseña actual a <strong>{correoRec}</strong>. Por favor revisa tu bandeja de entrada.
            </MensajeExito>
          )}
        </VentanaLogin>
      )}
    </div>
  );
}

// ============================================================
// PIEZAS PEQUEÑAS QUE SOLO USA EL LOGIN
// ============================================================

// Ventana emergente del login (cuadro beige con borde verde y una X)
function VentanaLogin({ onCerrar, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-sena-beige rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto border-4 border-sena-oscuro relative">
        <button type="button" onClick={onCerrar} className="absolute top-4 right-4 text-sena-oscuro hover:text-sena-verde cursor-pointer">
          <X size={28} />
        </button>
        <div className="p-10">{children}</div>
      </div>
    </div>
  );
}

// Un campo con su título (se usa en las dos ventanas)
function CampoVentana({ etiqueta, tipo = 'text', placeholder, valor, onCambio }) {
  return (
    <div className="mb-6">
      <label className="etiqueta text-lg mb-3">{etiqueta}</label>
      <input type={tipo} required placeholder={placeholder} value={valor}
        onChange={(e) => onCambio(e.target.value)} className="campo border-sena-verde" />
    </div>
  );
}

// Mensaje verde de "todo salió bien"
function MensajeExito({ Icono, titulo, children }) {
  return (
    <div className="text-center border-2 border-sena-verde rounded-lg p-8">
      <div className="w-20 h-20 bg-sena-verde rounded-full flex items-center justify-center mx-auto mb-4">
        <Icono size={40} className="text-white" />
      </div>
      <h3 className="titulo text-2xl mb-3">{titulo}</h3>
      <p className="text-sena-oscuro">{children}</p>
    </div>
  );
}

export default Login;
