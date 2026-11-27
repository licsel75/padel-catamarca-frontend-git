import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Defino las categorías fijas de pádel afuera del componente para que no se recreen en cada render
const CATEGORIAS_DISPONIBLES = [
  'M1ra', 'M2da', 'M3ra', 'M4ta', 'M5ta', 'M6ta', 'M7ma', 'MSuma 11',
  'F1ra', 'F2da', 'F3ra', 'F4ta', 'F5ta', 'F6ta', 'F7ma', 'FSuma 11',
  'Mix4ta', 'Mix5ta', 'Mix6ta', 'Mox7ma', 'MixSuma 11',
];

function TorneoForm() {
  // Extraigo el 'id' de la URL: si viene definido, sé que estoy editando; si es undefined, estoy creando
  const { id } = useParams();
  const navigate = useNavigate();
  // Obtengo los datos del usuario logueado desde mi contexto global para controlar permisos y filtrar clubes
  const { user } = useAuth();

  // Manejo estados locales para feedback visual (errores y pantalla de carga)
  const [errorApi, setErrorApi] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Guardo los clubes que vienen del backend y las selecciones múltiples que haga el usuario
  const [clubesDisponibles, setClubesDisponibles] = useState([]);
  const [clubesSeleccionados, setClubesSeleccionados] = useState([]);
  // Inicializo con una categoría por defecto para mejorar la experiencia de usuario
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(['4ta']);

  // Uso react-hook-form para gestionar los inputs de texto/fecha, validaciones y el estado de envío sin re-renders innecesarios
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    // Ejecuto la carga inicial de datos cada vez que cambia el ID o el usuario
    const inicializar = async () => {
      try {
        // 1. Traigo todos los clubes desde mi API
        const resClubes = await api.get('/clubes');

        // Aplico control de acceso en el front: si es admin ve todos los clubes, si no, filtro solo los que le pertenecen
        const listaClubes = user.rol === 'admin'
          ? resClubes.data
          : resClubes.data.filter((c) => (c.usuario?._id || c.usuario) === user.id);

        setClubesDisponibles(listaClubes);

        // Si estoy creando un torneo nuevo y el usuario tiene clubes, le preselecciono el primero para ahorrarle un clic
        if (!id && listaClubes.length > 0) {
          setClubesSeleccionados([listaClubes[0]._id]);
        }

        // 2. Si detecto un ID en la URL, estoy en modo edición: busco el torneo y precargo el formulario
        if (id) {
          const resTorneo = await api.get(`/torneos/${id}`);
          const torneo = resTorneo.data;

          // Uso setValue de react-hook-form para rellenar los campos registrados
          setValue('nombre', torneo.nombre);
          // Formateo las fechas ISO que vienen de la BD (YYYY-MM-DDTHH:mm...) a YYYY-MM-DD para que las entienda el input type="date"
          setValue('fechaInicio', torneo.fechaInicio.split('T')[0]);
          setValue('fechaFin', torneo.fechaFin.split('T')[0]);
          setValue('premio', torneo.premio || '');
          setValue('estado', torneo.estado || 'abierto');

          // Normalizo los clubes: por si vienen populados como objetos desde MongoDB o solo como strings de ID
          if (torneo.clubes) {
            setClubesSeleccionados(torneo.clubes.map((c) => c._id || c));
          }
          // Cargo las categorías que ya tenía guardadas el torneo
          if (torneo.categorias && torneo.categorias.length > 0) {
            setCategoriasSeleccionadas(torneo.categorias);
          }
        }
      } catch (err) {
        setErrorApi('Error al cargar los datos necesarios');
      } finally {
        // Apago el spinner de carga tanto si salió bien como si falló
        setCargando(false);
      }
    };

    inicializar();
  }, [id, setValue, user]);

  // Función helper tipo "interruptor" para agregar o quitar un club del array de seleccionados de forma inmutable
  const toggleClub = (clubId) => {
    setClubesSeleccionados((prev) =>
      prev.includes(clubId) ? prev.filter((item) => item !== clubId) : [...prev, clubId]
    );
  };

  // Misma lógica de selección múltiple para los botones de categorías
  const toggleCategoria = (cat) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  // Esta función se ejecuta solo si pasan las validaciones de react-hook-form
  const onSubmit = async (data) => {
    // Valido manualmente los clubes porque los manejo con un estado propio fuera de register()
    if (clubesSeleccionados.length === 0) {
      setErrorApi('Debés seleccionar al menos un club sede para el torneo.');
      return;
    }

    try {
      setErrorApi(null);

      // Armo el payload final combinando los datos del form, transformando fechas a formato ISO estándar y sumando mis estados locales
      const dataFormateada = {
        ...data,
        fechaInicio: new Date(data.fechaInicio).toISOString(),
        fechaFin: new Date(data.fechaFin).toISOString(),
        categorias: categoriasSeleccionadas,
        clubes: clubesSeleccionados
      };

      // Bifurco la petición HTTP según el modo en el que estoy (PUT para actualizar, POST para crear)
      if (id) {
        await api.put(`/torneos/${id}`, dataFormateada); // actualizar un torneo
        alert('Torneo actualizado ✅');
      } else {
        await api.post('/torneos', dataFormateada); // crear un torneo
        alert('Torneo creado con éxito 🎾');
      }

      // Redirijo al panel principal tras guardar con éxito
      navigate('/admin');
    } catch (err) {
      // Capturo mensajes de error específicos enviados por mi backend o muestro uno genérico
      setErrorApi(err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el torneo');
    }
  };

  // Renderizado temprano (Early Return) mientras espero las peticiones iniciales
  if (cargando) return <p className="text-center mt-10">Cargando datos... ⏳</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        {/* Adapto dinámicamente el título según si estoy creando o editando */}
        <h2 className="text-3xl font-bold text-primary mb-6">
          {id ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
        </h2>

        {/* Renderizado condicional para mostrar alertas de error si existen */}
        {errorApi && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{errorApi}</div>}

        {/* Si el usuario no tiene clubes creados, bloqueo el formulario y le doy un acceso directo para crear uno */}
        {clubesDisponibles.length === 0 ? (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 p-4 rounded-lg mb-4">
            <p className="font-bold mb-2">Todavía no tenés clubes registrados.</p>
            <p className="text-sm mb-3">Para crear un torneo primero necesitás registrar al menos un club sede.</p>
            <button
              type="button"
              onClick={() => navigate('/admin/clubes/crear')}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              + Ir a Crear Club
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Campo Nombre con validación obligatoria */}
            <div>
              <label className="block text-sm font-bold mb-1">Nombre del Torneo *</label>
              <input
                type="text"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            {/* Fechas en layout responsivo (columna en móvil, fila en pantallas sm+) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Fecha Inicio *</label>
                <input
                  type="date"
                  {...register('fechaInicio', { required: 'Requerido' })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Fecha Fin *</label>
                <input
                  type="date"
                  {...register('fechaFin', { required: 'Requerido' })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
            </div>

            {/* Selector visual de clubes mediante tarjetas con checkboxes sincronizados a mi estado */}
            <div>
              <label className="block text-sm font-bold mb-2">Club / Sedes del Torneo *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {clubesDisponibles.map((club) => (
                  <label
                    key={club._id}
                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${clubesSeleccionados.includes(club._id)
                      ? 'border-primary bg-blue-50 font-semibold'
                      : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={clubesSeleccionados.includes(club._id)}
                      onChange={() => toggleClub(club._id)}
                    />
                    <span className="text-sm">{club.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Selector tipo "chips" o píldoras interactivas para elegir múltiples categorías */}
            <div>
              <label className="block text-sm font-bold mb-2">Categorías</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_DISPONIBLES.map((cat) => (
                  <button
                    type="button" // Importante: type="button" evita que al hacer clic se envíe el formulario por accidente
                    key={cat}
                    onClick={() => toggleCategoria(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${categoriasSeleccionadas.includes(cat)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Campo opcional de premio y selector de estado (visible solo en modo edición) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-1">Premio/Fecha límite de inscripción (Máx. 50 caracteres)</label>
                <input
                  type="text"
                  {...register('premio', { maxLength: 50 })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
                  placeholder="Ej: Trofeo + $100.000"
                />
              </div>

              {/* El estado solo tiene sentido modificarlo cuando el torneo ya existe */}
              {id && (
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-bold mb-1">Estado</label>
                  <select
                    {...register('estado')}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white"
                  >
                    <option value="abierto">Abierto</option>
                    <option value="en curso">En curso</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </div>
              )}
            </div>

            {/* Botones de acción: deshabilito el submit mientras isSubmitting es true para evitar envíos duplicados */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-lime-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : (id ? 'Guardar Cambios' : 'Crear Torneo')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TorneoForm;