import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import api from '../services/api';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState(null);
  const [cargando, setCargando] = useState(Boolean(id));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      rol: 'jugador',
      rolAprobado: true
    }
  });

  useEffect(() => {
    if (id) {
      const cargarUsuario = async () => {
        try {
          const res = await api.get(`/users/${id}`);
          const u = res.data;
          setValue('nombre', u.nombre);
          setValue('email', u.email);
          setValue('rol', u.rol);
          setValue('rolAprobado', Boolean(u.rolAprobado));
        } catch (err) {
          setErrorApi('Error al cargar los datos del usuario');
        } finally {
          setCargando(false);
        }
      };
      cargarUsuario();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      setErrorApi(null);

      const payload = {
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        rol: data.rol,
        rolAprobado: Boolean(data.rolAprobado),
        ...(data.password?.trim() ? { password: data.password.trim() } : {})
      };

      if (id) {
        await api.put(`/users/${id}`, payload);
        alert('Usuario actualizado con éxito ✅');
      } else {
        await api.post('/users', payload);
        alert('Usuario creado con éxito 👤');
      }

      navigate('/admin?tab=usuarios');
    } catch (err) {
      setErrorApi(err.response?.data?.error || 'Error al guardar el usuario');
    }
  };

  if (cargando) return <p className="text-center mt-10">Cargando usuario... ⏳</p>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {id
            ? 'Modificá el rol, estado de aprobación o restablecé la contraseña.'
            : 'Registrá una cuenta nueva directamente sin cerrar tu sesión de administrador.'}
        </p>

        {errorApi && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
            {errorApi}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Nombre completo *</label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Correo electrónico *</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              {...register('email', { required: 'El email es obligatorio' })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              {id ? 'Nueva Contraseña (dejar vacío para mantener la actual)' : 'Contraseña *'}
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              {...register('password', {
                required: id ? false : 'La contraseña es obligatoria',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Rol en la plataforma *</label>
            <select
              {...register('rol')}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white"
            >
              <option value="jugador">Jugador</option>
              <option value="organizador">Organizador de Torneos</option>
              <option value="dueño_club">Dueño / Administrador de Club</option>
              <option value="profesor">Profesor de Pádel</option>
              <option value="admin">Administrador Global</option>
            </select>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-lg bg-surface border border-gray-200 cursor-pointer mt-1">
            <input
              type="checkbox"
              {...register('rolAprobado')}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <div>
              <span className="block text-sm font-bold text-primary">Cuenta aprobada para publicar</span>
              <span className="block text-xs text-gray-500">
                Habilita inmediatamente los permisos de organizador, dueño de club o profesor.
              </span>
            </div>
          </label>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin?tab=usuarios')}
              className="w-1/3 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-lime-500 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Guardando...' : id ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuarioForm;