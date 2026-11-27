
---

# 📄 README Frontend — `README.md`

```markdown
# 🎾 Frontend — Catamarca Pádel

Frontend de Trabajo Práctico Final — Interfaz web de la plataforma para el ecosistema del pádel en Catamarca.

Aplicación web Single Page Application (SPA) desarrollada con **React**, **Vite** y **Tailwind CSS** para explorar complejos de pádel por departamento en Catamarca, consultar torneos con pronóstico meteorológico en tiempo real, contactar profesores certificados y gestionar sedes y competencias según el rol del usuario.

**🌐 Demo en vivo:** https://catamarcapadel.netlify.app/

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

## 📁 Estructura del Proyecto

```text
padel-catamarca-frontend/
├── public/
├── src/
│   ├── assets/          # Imágenes y recursos estáticos
│   ├── components/      # Componentes reutilizables (ClubCard, Navbar, Footer, ProtectedRoute...)
│   ├── constants/       # Departamentos de Catamarca, categorías, etc.
│   ├── context/         # AuthContext, ThemeContext
│   ├── hooks/           # useFetch y hooks personalizados
│   ├── pages/           # Vistas principales y formularios
│   ├── services/        # Instancia de Axios configurada
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── package.json
└── README.md



 Cómo correr el proyecto localmente
Requisitos previos
Node.js >= 18

pnpm (npm i -g pnpm o corepack enable)

El Backend corriendo en http://localhost:3000/api (ver README del backend)

Pasos
Clonar el repositorio:

bash
git clone https://github.com/<licsel75>/padel-catamarca-frontend.git
cd padel-catamarca-frontend
Instalar las dependencias:

bash
pnpm install
Crear el archivo .env a partir del ejemplo:

bash
cp .env.example .env
Completar la variable apuntando al Backend:

env
VITE_API_URL=http://localhost:3000/api
Correr la aplicación en modo desarrollo:

bash
pnpm run dev
La aplicación quedará disponible en http://localhost:5173.

🔐 Variables de Entorno
Variable	Descripción	Ejemplo
VITE_API_URL	URL base de la API del Backend	http://localhost:3000/api
⚠️ Nunca subas el archivo .env al repositorio. Solo el .env.example.

🗺️ Vistas y Funcionalidades Principales
🌍 Vistas Públicas
Inicio / Guía de Clubes (/):

Hero principal con acceso directo al calendario de torneos.

Buscador en tiempo real por nombre o dirección y filtro por los 16 departamentos de Catamarca.

Píldoras de acceso rápido dinámicas: se generan automáticamente según los departamentos que tienen clubes activos en la base de datos, acompañadas por un contador dinámico de resultados.

Priorización de Clubes Sponsors: los complejos auspiciantes (esSponsor: true) se muestran primeros con borde dorado e insignia oficial.

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

Historia del Pádel en Catamarca:

Línea de tiempo de los clubes pioneros, el fenómeno Tapia y la federalización.

Salón de la Fama con campeones por año y categoría.

Distinciones CPDC y archivo abierto colaborativo.

🔒 Vistas Autenticadas y Panel de Gestión
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

Modo Claro/Oscuro: Implementado mediante ThemeContext con persistencia en localStorage y toggle accesible desde el navbar.

🚧 Limitaciones del MVP y Mejoras Futuras
Este proyecto fue desarrollado como un Producto Mínimo Viable (MVP) para validar la arquitectura Fullstack MERN y el flujo de gestión de torneos. Si bien es completamente funcional, se identificaron las siguientes mejoras para una versión de producción real:

Gestión de Imágenes de Clubes (Cloud Storage):

Estado actual: Las imágenes en las tarjetas (ClubCard) se importan desde src/assets (hardcodeadas) como demostración visual.

Mejora futura: Agregar un campo imagen (String) al modelo Club en el Backend. Implementar un formulario con <input type="file" /> en el panel de administración. Al subir la imagen, enviarla mediante FormData al Backend, almacenarla en un servicio Cloud (como Cloudinary o AWS S3) y guardar en MongoDB únicamente la URL pública. Incluir compresión previa de imágenes para optimizar ancho de banda y rendimiento de carga.

Pasarela de Pagos para Inscripciones:

Estado actual: El contacto y la gestión de cupos se realiza vía WhatsApp.

Mejora futura: Integrar Mercado Pago (Checkout Pro) para que los jugadores puedan pagar la inscripción al torneo directamente desde la plataforma, con generación de ticket automático.

Validaciones Avanzadas en el Frontend:

Si bien se usa react-hook-form, a futuro se podría integrar Zod para tipar los esquemas de validación y compartirlos entre el Front y el Back (validación compartida).

Notificaciones Automáticas (Email/WhatsApp):

Implementar un servicio de envío de correos (usando Nodemailer o Resend) para notificar a los jugadores cuando se inscriben a un torneo o cuando cambia la fecha del mismo. Complementar con WhatsApp Cloud API para recordatorios de turnos y torneos.

CRUD Salón de la Fama:

Todo usuario logueado puede aportar información sobre premiaciones, clubes, etc., con flujo de moderación por parte de un administrador.

Reserva de Turnos:

Permitir que los clubes carguen disponibilidad horaria y los jugadores reserven canchas desde la plataforma, con confirmación por WhatsApp/email.

🚀 Deploy en Producción
Frontend (Netlify): https://catamarcapadel.netlify.app/

Backend API (Render): https://padel-catamarca-api.onrender.com

ℹ️ El Backend en Render puede tardar ~50 segundos en despertar si estuvo inactivo (plan gratuito).

🔐 Credenciales de Prueba
Email: admin@padel.com

Contraseña: admin123

⚠️ Estas credenciales corresponden únicamente al entorno de demo. En un despliegue real deben cambiarse antes de publicar.

👤 Autoría
Autor: <SELEMIN SALIM HÉCTOR>

Materia: Trabajo Práctico Final — <DISEÑO WEB FULL STACK>

Institución: <NODO TECNOLÓGICO>

Año: 2026

📄 Licencia
Este proyecto se distribuye con fines académicos. Consultá con el autor antes de reutilizarlo con fines comerciales.