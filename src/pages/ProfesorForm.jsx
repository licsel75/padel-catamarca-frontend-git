import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router';
import api from '../services/api';

// Defino los niveles de entrenamiento afuera del componente como una constante inmutable para evitar recrear el array en cada render
const NIVELES_DISPONIBLES = [
  'Iniciación',
  '7ma',
  '6ta',
  '5ta',
  '4ta',
  '3ra',
  'Damas',
  'Menores'
];

function ProfesorForm() {
  // Inicializo react-hook-form con 'activo: true' por defecto para que, si es un perfil nuevo, ya nazca publicado
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      activo: true
    }
  });

  const navigate = useNavigate();
  
  // Manejo en useState los catálogos externos y las selecciones múltiples (checkboxes y chips)
  const [clubesDisponibles, setClubesDisponibles] = useState([]);
  const [clubesSeleccionados, setClubesSeleccionados] = useState([]);
  const [nivelesSeleccionados, setNivelesSeleccionados] = useState([]);
  
  // Estados para controlar la pantalla de carga inicial y alertas de error del backend
  const [loadingDatos, setLoadingDatos] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  // Uso watch('activo') para suscribirme en tiempo real al checkbox de estado y actualizar el texto explicativo de la UI dinámicamente
  const activoActual = watch('activo');

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoadingDatos(true);
      try {
        // 1. Traigo todos los clubes disponibles para que el profesor marque en cuáles dicta clases
        const resClubes = await api.get('/clubes');
        setClubesDisponibles(resClubes.data);

        // 2. Consulto mi endpoint personalizado '/mi-perfil' que identifica al usuario por su token JWT en el backend
        const resPerfil = await api.get('/profesores/mi-perfil');
        const perfilExistente = resPerfil.data;

        // Si el backend me devuelve un perfil previo, estoy en modo edición: hidrato todo el formulario
        if (perfilExistente) {
          setValue('titulo', perfilExistente.titulo);
          setValue('estudios', perfilExistente.estudios || '');
          setValue('diasHorarios', perfilExistente.diasHorarios);
          setValue('telefono', perfilExistente.telefono);
          setValue('descripcion', perfilExistente.descripcion || '');
          setValue('activo', perfilExistente.activo);

          // Normalizo los clubes por si vienen populados desde MongoDB como objetos completos o solo como IDs
          setClubesSeleccionados(
            perfilExistente.clubes ? perfilExistente.clubes.map((c) => c._id || c) : []
          );
          setNivelesSeleccionados(perfilExistente.niveles || []);
        }
      } catch (err) {
        setErrorApi('No se pudieron cargar los datos del formulario.');
      } finally {
        // Me aseguro de liberar el estado de carga siempre, haya fallado o no
        setLoadingDatos(false);
      }
    };

    cargarDatosIniciales();
  }, [setValue]);

  // Helper inmutable para agregar o quitar un club del array de seleccionados
  const toggleClub = (clubId) => {
    setClubesSeleccionados((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId]
    );
  };

  // Helper inmutable para alternar los botones tipo chip de niveles
  const toggleNivel = (nivel) => {
    setNivelesSeleccionados((prev) =>
      prev.includes(nivel) ? prev.filter((n) => n !== nivel) : [...prev, nivel]
    );
  };

  const onSubmit = async (data) => {
    try {
      setErrorApi(null);

      // Construyo el payload explícito uniendo los campos validados por react-hook-form con mis estados locales
      const payload = {
        titulo: data.titulo,
        estudios: data.estudios,
        clubes: clubesSeleccionados,
        niveles: nivelesSeleccionados,
        diasHorarios: data.diasHorarios,
        telefono: data.telefono,
        descripcion: data.descripcion,
        activo: data.activo
      };

      // Implemento un patrón Upsert: uso siempre POST a '/profesores/mi-perfil' y dejo que el backend cree o actualice según el usuario logueado
      await api.post('/profesores/mi-perfil', payload);
      
      // Redirijo al panel tras guardar exitosamente
      navigate('/admin');
    } catch (err) {
      setErrorApi(err.response?.data?.error || 'Error al guardar tu anuncio profesional.');
    }
  };

  // Early return para no mostrar un formulario vacío mientras resuelven las peticiones iniciales
  if (loadingDatos) {
    return <p className="text-center mt-16 text-gray-500">Cargando perfil profesional... ⏳</p>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Navegación rápida para volver al panel sin perder contexto */}
      <Link to="/admin" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-6">
        ← Volver a Mi Panel
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-black text-primary mb-2">
          🎓 Mi Anuncio de Profesor
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Esta tarjeta se mostrará en la sección pública de Profesores para que los jugadores te contacten por WhatsApp.
        </p>

        {/* Banner condicional de error */}
        {errorApi && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm font-semibold">
            {errorApi}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Título con validación de obligatoriedad y límite de caracteres alineado a la tarjeta pública */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Título del anuncio *
            </label>
            <input
              type="text"
              {...register('titulo', {
                required: 'El título es obligatorio',
                maxLength: { value: 60, message: 'Máximo 60 caracteres' }
              })}
              placeholder="Ej: Clases individuales, grupales y clínicas"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.titulo && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.titulo.message}</p>}
          </div>

          {/* Campo opcional para credenciales deportivas */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Certificaciones / Experiencia (APA, AJPP, Categoría)
            </label>
            <input
              type="text"
              {...register('estudios', {
                maxLength: { value: 250, message: 'Máximo 250 caracteres' }
              })}
              placeholder="Ej: Instructor Certificado APA • Jugador 2da Categoría"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          {/* Disponibilidad horaria */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Días y horarios disponibles *
            </label>
            <input
              type="text"
              {...register('diasHorarios', {
                required: 'Indicá tus días y horarios',
                maxLength: { value: 100, message: 'Máximo 100 caracteres' }
              })}
              placeholder="Ej: Lunes a Viernes de 14:00 a 21:00 hs"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.diasHorarios && (
              <p className="text-red-500 text-xs mt-1 font-semibold">{errors.diasHorarios.message}</p>
            )}
          </div>

          {/* Teléfono formateado para generar enlaces directos a la API de WhatsApp (wa.me) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              WhatsApp de contacto (sin 0 ni 15) *
            </label>
            <input
              type="text"
              {...register('telefono', {
                required: 'El teléfono es obligatorio para el botón de WhatsApp'
              })}
              placeholder="Ej: 3834123456"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.telefono && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.telefono.message}</p>}
          </div>

          {/* Lista con scroll interno (max-h-48) para no alargar demasiado el formulario si hay muchos clubes */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Clubes donde dictás clases
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-surface">
              {clubesDisponibles.map((club) => (
                <label
                  key={club._id}
                  className="flex items-center gap-2 text-sm cursor-pointer bg-white p-2 rounded border border-gray-100 hover:border-secondary"
                >
                  <input
                    type="checkbox"
                    checked={clubesSeleccionados.includes(club._id)}
                    onChange={() => toggleClub(club._id)}
                    className="accent-secondary w-4 h-4"
                  />
                  <span className="truncate font-medium">
                    {club.nombre} <span className="text-xs text-gray-400">({club.departamento || 'Capital'})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Selector múltiple tipo chips para niveles */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Niveles y categorías que entrenás
            </label>
            <div className="flex flex-wrap gap-2">
              {NIVELES_DISPONIBLES.map((nivel) => {
                const seleccionado = nivelesSeleccionados.includes(nivel);
                return (
                  <button
                    key={nivel}
                    type="button" // Evito que el clic dispare el submit del form
                    onClick={() => toggleNivel(nivel)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      seleccionado
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {nivel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Descripción libre con límite de caracteres para mantener estética uniforme en la grilla pública */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Descripción de tu metodología (Máx. 250 caracteres)
            </label>
            <textarea
              rows={3}
              {...register('descripcion', {
                maxLength: { value: 250, message: 'Máximo 250 caracteres' }
              })}
              placeholder="Ej: Entrenamiento técnico-táctico, preparación para torneos y clases para principiantes desde cero."
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          {/* Interruptor de visibilidad: permite al profesor pausar su anuncio sin tener que borrarlo */}
          <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-gray-200">
            <div>
              <p className="text-sm font-bold text-primary">Estado de la publicación</p>
              <p className="text-xs text-gray-500">
                {activoActual
                  ? 'Visible públicamente en la sección Profesores.'
                  : 'Pausada (oculta al público temporalmente).'}
              </p>
            </div>
            <input
              type="checkbox"
              {...register('activo')}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
          </div>

          {/* Botón submit protegido contra doble clic mediante isSubmitting */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary text-primary font-extrabold text-lg py-3 rounded-lg hover:bg-lime-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Anuncio'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfesorForm;