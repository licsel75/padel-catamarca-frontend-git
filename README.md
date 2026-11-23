# padel-catamarca-frontend
Frontend de Trabajo Práctico Final — Interfaz web de la plataforma para el ecosistema del pádel en Catamarca.

# 🎾 Frontend - Catamarca Pádel

Aplicación web Single Page Application (SPA) desarrollada con **React**, **Vite** y **Tailwind CSS** para explorar complejos de pádel por departamento en Catamarca, consultar torneos con pronóstico meteorológico en tiempo real, contactar profesores certificados y gestionar sedes y competencias según el rol del usuario.

## 🚀 Tecnologías Utilizadas
- **React & Vite:** Biblioteca de interfaz de usuario y entorno de compilación ultrarrápido.
- **React Router:** Enrutamiento dinámico de vistas públicas, fichas de detalle, rutas protegidas y navegación fluida.
- **Tailwind CSS:** Estilizado responsivo con paleta personalizada (`primary`, `secondary`, `surface`) y soporte para modo claro/oscuro.
- **React Hook Form:** Gestión y validación de formularios (registro, login, alta/edición de clubes, torneos y perfiles de profesores).
- **Axios:** Cliente HTTP con interceptores automáticos para inyección de Token JWT en cada petición al Backend.
- **APIs Externas Integradas:**
  - **Open-Meteo API:** Pronóstico meteorológico extendido (hasta 16 días) integrado en la ficha de cada torneo según la ubicación de su sede.
  - **Google Maps:** Mapas embebidos interactivos y enlaces directos de geolocalización en cada club.

---

## ⚙️ Cómo correr el proyecto localmente

1. Clonar el repositorio.
2. Instalar las dependencias:
   ```bash
   pnpm install


Crear un archivo .env en la raíz del proyecto apuntando a la URL del servidor Backend:

Fragmento de código
VITE_API_URL=http://localhost:3000/api
Correr la aplicación en modo desarrollo:

Bash
pnpm run dev
La aplicación quedará disponible en http://localhost:5173.

🗺️ Vistas y Funcionalidades Principales
🌍 Vistas Públicas
Inicio / Guía de Clubes (/):

Hero principal con acceso directo al calendario de torneos.

Buscador en tiempo real por nombre o dirección y filtro por los 16 departamentos de Catamarca.

Píldoras de acceso rápido dinámicas: Se generan automáticamente según los departamentos que tienen clubes activos en la base de datos, acompañadas por un contador dinámico de resultados.

Priorización de Clubes Sponsors: Los complejos auspiciantes (esSponsor: true) se muestran primeros con borde dorado e insignia oficial.

Detalle de Club (/clubes/:id):

Información completa del complejo (dirección, departamento, servicios, teléfono con contacto directo por WhatsApp).

Mapa interactivo embebido de Google Maps y enlaces a redes sociales (Instagram, Facebook, X y sitio web/reservas).

Listado de torneos programados en esa sede y navegación rápida hacia el club anterior/siguiente.

Franja de auspiciante para clubes sponsors y enlace de contacto por WhatsApp para dueños interesados en destacar su complejo.

Calendario de Torneos (/torneos y /torneos/:id):

Clasificación temporal en pestañas (Próximos, En Curso y Finalizados) con agrupación automática por mes.

Filtros combinados por categoría, departamento y club.

Ficha de detalle con sedes vinculadas, premios, botón para guardar en Mis Favoritos y pronóstico del clima día por día (Open-Meteo).

Directorio de Profesores (/profesores):

Listado de entrenadores certificados (APA / AJPP) con categoría y botón de contacto directo por WhatsApp.

Vistas Autenticadas y Panel de Gestión
Registro e Inicio de Sesión (/register, /login): Flujo completo con selección de rol (jugador, organizador, dueño_club, profesor).

Agenda de Favoritos (/favoritos): Torneos guardados por el jugador para seguimiento rápido.

Panel de Administración / Gestión (/admin):

Gestión CRUD de Clubes (/clubes/nuevo, /clubes/editar/:id), incluyendo el interruptor exclusivo para administradores (⭐ Club Sponsor / Auspiciante Oficial).

Gestión CRUD de Torneos (/torneos/nuevo, /torneos/editar/:id) con soporte para eventos individuales o multisede.

Aprobación de cuentas pendientes y administración de roles (solo admin).

🏗️ Arquitectura y Decisiones Técnicas
Estructura Modular: Organización clara en components/ (tarjetas reutilizables, navbar, footer, rutas protegidas), pages/ (vistas principales y formularios), hooks/ (useFetch), services/ (instancia configurada de Axios), context/ (estado global de autenticación y tema) y constants/ (departamentos de Catamarca).

Custom Hook useFetch: Centraliza el manejo de estados de carga (loading), errores (error) y datos (data) en las consultas públicas.

Sincronización con Backend: El estado de sesión y los permisos de visualización en UI se sincronizan mediante JWT y validación de roles, delegando la seguridad crítica al servidor.