import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router';
import api from '../services/api';

function UserForm() {
  // Obtengo el ID del usuario desde la URL dinámica "/admin/usuarios/editar/:id"
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
  const [loading, setLoading] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        // Consulto los datos actuales del usuario al Backend para precargar el formulario
        const res = await api.get(`/users/${id}`);
        const u = res.data;

        setValue('nombre', u.nombre);
        setValue('email', u.email);
        setValue('rol', u.rol);
        setValue('rolAprobado', u.rolAprobado);
      } catch (err) {
        setErrorApi('No se pudo cargar la información del usuario.');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      setErrorApi(null);

      // Armo el payload. Solo incluyo "password" si el administrador escribió una nueva
      const payload = {
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        rolAprobado: data.rolAprobado
      };

      if (data.password && data.password.trim() !== '') {
        payload.password = data.password.trim();
      }

      await api.put(`/users/${id}`, payload);
      navigate('/admin');
    } catch (err) {
      setErrorApi(err.response?.data?.error || 'Error al actualizar el usuario.');
    }
  };

  if (loading) return <p className="text-center mt-16 text-gray-500">Cargando usuario... ⏳</p>;

  return (
    <div className="max-w-lg mx-auto py-10 px-4">
      <Link to="/admin" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-6">
        ← Volver al Panel de Administración
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-black text-primary mb-2">✏️ Editar Usuario</h1>
        <p className="text-sm text-gray-500 mb-6">
          Modificá datos personales, asigná roles o restablecé la contraseña de la cuenta.
        </p>

        {errorApi && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-6 text-sm font-semibold">
            {errorApi}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre completo *</label>
            <input
              type="text"
              {...register('nombre', {
                required: 'El nombre es obligatorio',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' }
              })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.nombre.message}</p>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              {...register('email', {
                required: 'El email es obligatorio',
                pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
              })}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
          </div>

          {/* ROL DEL USUARIO */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Rol asignado *</label>
            <select
              {...register('rol')}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none bg-white font-semibold"
            >
              <option value="jugador">🎾 Jugador</option>
              <option value="profesor">🎓 Profesor</option>
              <option value="organizador">🏆 Organizador de Torneos</option>
              <option value="dueño_club">🏟️ Dueño de Club</option>
              <option value="admin">🛡️ Administrador</option>
            </select>
          </div>

          {/* ESTADO DE APROBACIÓN DEL ROL */}
          <div className="flex items-center justify-between bg-surface p-3.5 rounded-xl border border-gray-200">
            <div>
              <p className="text-sm font-bold text-primary">Rol aprobado</p>
              <p className="text-xs text-gray-500">
                Habilita al usuario a publicar según su rol asignado.
              </p>
            </div>
            <input
              type="checkbox"
              {...register('rolAprobado')}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
          </div>

          {/* NUEVA CONTRASEÑA OPCIONAL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nueva contraseña (opcional)
            </label>
            <input
              type="password"
              {...register('password', {
                minLength: { value: 6, message: 'Si ingresás una clave nueva, debe tener al menos 6 caracteres' }
              })}
              placeholder="Dejar en blanco para mantener la actual"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-secondary outline-none"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary text-primary font-extrabold text-lg py-3 rounded-lg mt-2 hover:bg-lime-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserForm;