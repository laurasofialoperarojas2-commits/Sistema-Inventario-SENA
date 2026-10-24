# Sistema de Inventario SENA

Aplicativo web para manejar el inventario de materiales del SENA.
Hecho con **React + Vite + Tailwind CSS**, siguiendo el diseño del Figma.

## Cómo correrlo

```
npm install
npm run dev
```

## Usuarios de prueba

| Tipo de usuario | Correo | Contraseña |
|---|---|---|
| Instructor | instructor@sena.edu.co | Instructor123 |
| Instructor | instructor2@sena.edu.co | Instructor123 |
| Administración | admin@sena.edu.co | Admin123 |

También se puede crear una cuenta nueva (queda como instructor).

## Carpetas

```
src/
├── App.jsx            -> Rutas y datos compartidos entre pantallas
├── main.jsx           -> Punto de entrada
├── index.css          -> Colores del Figma y clases propias (tarjeta, btn-verde, campo, tabla...)
├── imagenes/          -> Logo
├── datos/datos.js     -> Datos de prueba y funciones de ayuda
├── componentes/
│   ├── Header.jsx         -> Barra verde con el menú (cambia según el rol)
│   ├── Modal.jsx          -> Ventana emergente reutilizable
│   └── TituloTarjeta.jsx  -> Ícono + título de cada tarjeta
└── pantallas/
    ├── Login.jsx          -> Inicio de sesión, crear cuenta, recuperar contraseña
    ├── Instructor.jsx     -> Panel del instructor
    ├── Administrativos.jsx-> Panel de administración
    ├── Reportes.jsx       -> Reportes y gráficas (solo administración)
    └── Ayuda.jsx          -> Centro de ayuda (los dos roles)
```

## Menú según el rol

- **Instructor:** Instructor · Ayuda · Cerrar Sesión
- **Administración:** Administrativos · Ayuda · Reportes · Cerrar Sesión

## Pendiente

- Tomar la foto de la evidencia con la cámara (por ahora se sube una imagen guardada en el computador).
- Conectar con un backend: al recargar la página los datos vuelven a los de prueba.
- "Exportar PDF" usa la ventana de imprimir del navegador (elegir "Guardar como PDF") y
  "Exportar Excel" descarga un archivo .csv que abre en Excel.
