import React, { useState } from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, Book } from 'lucide-react';
import TituloTarjeta from '../componentes/TituloTarjeta';
import { preguntasAyuda } from '../datos/datos';

// ===== CENTRO DE AYUDA (instructor y administración) =====
function Ayuda() {

  // Campos del formulario "Envíanos un Mensaje"
  const [asunto, setAsunto] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Botón "Enviar Mensaje" (por ahora solo muestra un aviso)
  const enviarMensaje = (e) => {
    e.preventDefault();
    alert('¡Mensaje enviado! Soporte te responderá en 24-48 horas.');
    setAsunto('');
    setMensaje('');
  };

  // Recursos adicionales (tarjetas blancas)
  const recursos = [
    { titulo: 'Manual de Usuario', texto: 'Guía completa del sistema de inventario' },
    { titulo: 'Tutoriales en Video', texto: 'Videos paso a paso de cada funcionalidad' },
    { titulo: 'Preguntas Frecuentes', texto: 'Respuestas a las preguntas más comunes' },
    { titulo: 'Base de Conocimientos', texto: 'Artículos y documentación técnica' },
  ];

  return (
    <div className="space-y-6">

      {/* ===== TÍTULO ===== */}
      <div className="tarjeta">
        <h1 className="titulo text-3xl mb-2">Centro de Ayuda</h1>
        <p className="text-sena-verde">Encuentra respuestas y soporte técnico</p>
      </div>

      {/* ===== SOPORTE TÉCNICO (preguntas) ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={HelpCircle} texto="Soporte Técnico" />
        <div className="space-y-4">
          {preguntasAyuda.map((p) => (
            <div key={p.id} className="p-4 bg-white rounded-lg border-l-4 border-sena-verde">
              <h3 className="titulo mb-2">{p.pregunta}</h3>
              <p className="text-sena-verde">{p.respuesta}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CONTACTO Y SOPORTE ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={MessageCircle} texto="Contacto y Soporte" />
        <div className="grid md:grid-cols-3 gap-6">

          {/* ----- Teléfono ----- */}
          <TarjetaContacto Icono={Phone} titulo="Teléfono">
            <p className="text-sena-verde">+57 (1) 234-5678</p>
            <p className="text-sm mt-1 text-sena-oscuro">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
          </TarjetaContacto>

          {/* ----- Correo ----- */}
          <TarjetaContacto Icono={Mail} titulo="Correo Electrónico">
            <p className="text-sena-verde">soporte@sena.edu.co</p>
            <p className="text-sm mt-1 text-sena-oscuro">Respuesta en 24-48 horas</p>
          </TarjetaContacto>

          {/* ----- Chat en vivo ----- */}
          <TarjetaContacto Icono={MessageCircle} titulo="Chat en Vivo">
            <button
              onClick={() => alert('El chat en vivo estará disponible próximamente.')}
              className="mt-2 px-6 py-2 bg-sena-verde text-white rounded-lg hover:bg-sena-oscuro cursor-pointer"
            >
              Iniciar Chat
            </button>
          </TarjetaContacto>
        </div>
      </div>

      {/* ===== RECURSOS ADICIONALES ===== */}
      <div className="tarjeta">
        <TituloTarjeta Icono={Book} texto="Recursos Adicionales" />
        <div className="grid md:grid-cols-2 gap-4">
          {recursos.map((r) => (
            <div key={r.titulo} className="p-4 bg-white rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="titulo mb-2">{r.titulo}</h3>
              <p className="text-sena-verde">{r.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FORMULARIO DE CONTACTO ===== */}
      <div className="tarjeta">
        <h2 className="titulo text-2xl mb-4">Envíanos un Mensaje</h2>
        <form onSubmit={enviarMensaje} className="space-y-4">
          <div>
            <label className="etiqueta">Asunto</label>
            <input required type="text" placeholder="¿En qué podemos ayudarte?" className="campo"
              value={asunto} onChange={(e) => setAsunto(e.target.value)} />
          </div>
          <div>
            <label className="etiqueta">Mensaje</label>
            <textarea required rows="5" placeholder="Describe tu consulta o problema..." className="campo"
              value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
          </div>
          <button type="submit" className="btn-verde w-full">Enviar Mensaje</button>
        </form>
      </div>
    </div>
  );
}

// Tarjeta blanca con un círculo verde y un ícono (Teléfono, Correo, Chat)
function TarjetaContacto({ Icono, titulo, children }) {
  return (
    <div className="p-6 bg-white rounded-lg text-center">
      <div className="w-16 h-16 bg-sena-verde rounded-full flex items-center justify-center mx-auto mb-4">
        <Icono size={28} className="text-white" />
      </div>
      <h3 className="titulo mb-2">{titulo}</h3>
      {children}
    </div>
  );
}

export default Ayuda;
