import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';

function TorneoForm() {
  const { id } = useParams(); // Si hay ID en la URL, es modo edición
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState(null);
  const [cargando, setCargando] = useState(id ? true : false);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  // Efecto para precargar datos si estamos editando
  useEffect(() => {
    if (id) {
      const cargarTorneo = async () => {
        try {
          const res = await api.get(`/torneos/${id}`);
          const torneo = res.data;
          
          // Llenamos los inputs con los datos de la base de datos
          setValue('nombre', torneo.nombre);
          setValue('fechaInicio', torneo.fechaInicio.split('T')[0]); // Formato YYYY-MM-DD
          setValue('fechaFin', torneo.fechaFin.split('T')[0]);
          setValue('premio', torneo.premio || '');
          
          setCargando(false);
        } catch (err) {
          setErrorApi('Error al cargar los datos del torneo');
          setCargando(false);
        }
      };
      cargarTorneo();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      setErrorApi(null);
      
      // Formateamos las fechas y agregamos datos obligatorios para el Backend
      const dataFormateada = {
        ...data,
        fechaInicio: new Date(data.fechaInicio).toISOString(),
        fechaFin: new Date(data.fechaFin).toISOString(),
        
        // ⚠️ IMPORTANTE: Para que el backend acepte el torneo, 
        // necesitamos mandar al menos un club y una categoría.
        // En un futuro, esto vendría de un select en el formulario.
        // Reemplazá "ID_DE_UN_CLUB_REAL" por el ID real de un club de tu base de datos.
        categorias: ["1ra", "2da"], 
        clubes: ["6afda5c3d82f465a9e971a5d"] 
      };

      if (id) {
        await api.put(`/torneos/${id}`, dataFormateada);
        alert('Torneo actualizado ✅');
      } else {
        await api.post('/torneos', dataFormateada);
        alert('Torneo creado con éxito 🎾');
      }
      
      navigate('/admin'); // Volvemos a la tabla principal
    } catch (err) {
      setErrorApi(err.response?.data?.mensaje || 'Error al guardar el torneo');
    }
  };

  if (cargando) return <p className="text-center mt-10">Cargando datos... ⏳</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-6">
          {id ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
        </h2>

        {errorApi && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{errorApi}</div>}

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

          <div className="flex gap-4">
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
            <label className="block text-sm font-bold mb-1">Premio (Máx. 50 caracteres)</label>
            <input
              type="text"
              {...register('premio', { maxLength: 50 })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
              placeholder="Ej: Trofeo + $100.000"
            />
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
      </div>
    </div>
  );
}

export default TorneoForm;