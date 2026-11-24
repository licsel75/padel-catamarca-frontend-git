import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIAS_DISPONIBLES = ['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma', 'Suma 11', 'Damas'];

function TorneoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [errorApi, setErrorApi] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [clubesDisponibles, setClubesDisponibles] = useState([]);
  const [clubesSeleccionados, setClubesSeleccionados] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(['4ta']);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const inicializar = async () => {
      try {
        // 1. Cargar clubes desde el backend
        const resClubes = await api.get('/clubes');
        const listaClubes = user.rol === 'admin'
          ? resClubes.data
          : resClubes.data.filter((c) => (c.usuario?._id || c.usuario) === user.id);

        setClubesDisponibles(listaClubes);

        // Si crea un torneo nuevo y tiene al menos 1 club, preseleccionamos el primero
        if (!id && listaClubes.length > 0) {
          setClubesSeleccionados([listaClubes[0]._id]);
        }

        // 2. Si es edición, cargar datos del torneo
        if (id) {
          const resTorneo = await api.get(`/torneos/${id}`);
          const torneo = resTorneo.data;
          setValue('nombre', torneo.nombre);
          setValue('fechaInicio', torneo.fechaInicio.split('T')[0]);
          setValue('fechaFin', torneo.fechaFin.split('T')[0]);
          setValue('premio', torneo.premio || '');
          setValue('estado', torneo.estado || 'abierto');

          if (torneo.clubes) {
            setClubesSeleccionados(torneo.clubes.map((c) => c._id || c));
          }
          if (torneo.categorias && torneo.categorias.length > 0) {
            setCategoriasSeleccionadas(torneo.categorias);
          }
        }
      } catch (err) {
        setErrorApi('Error al cargar los datos necesarios');
      } finally {
        setCargando(false);
      }
    };

    inicializar();
  }, [id, setValue, user]);

  const toggleClub = (clubId) => {
    setClubesSeleccionados((prev) =>
      prev.includes(clubId) ? prev.filter((item) => item !== clubId) : [...prev, clubId]
    );
  };

  const toggleCategoria = (cat) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const onSubmit = async (data) => {
    if (clubesSeleccionados.length === 0) {
      setErrorApi('Debés seleccionar al menos un club sede para el torneo.');
      return;
    }

    try {
      setErrorApi(null);

      const dataFormateada = {
        ...data,
        fechaInicio: new Date(data.fechaInicio).toISOString(),
        fechaFin: new Date(data.fechaFin).toISOString(),
        categorias: categoriasSeleccionadas,
        clubes: clubesSeleccionados
      };

      if (id) {
        await api.put(`/torneos/${id}`, dataFormateada);
        alert('Torneo actualizado ✅');
      } else {
        await api.post('/torneos', dataFormateada);
        alert('Torneo creado con éxito 🎾');
      }

      navigate('/admin');
    } catch (err) {
      setErrorApi(err.response?.data?.error || err.response?.data?.mensaje || 'Error al guardar el torneo');
    }
  };

  if (cargando) return <p className="text-center mt-10">Cargando datos... ⏳</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-6">
          {id ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
        </h2>

        {errorApi && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{errorApi}</div>}

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
            <div>
              <label className="block text-sm font-bold mb-1">Nombre del Torneo *</label>
              <input
                type="text"
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

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

            <div>
              <label className="block text-sm font-bold mb-2">Categorías</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_DISPONIBLES.map((cat) => (
                  <button
                    type="button"
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