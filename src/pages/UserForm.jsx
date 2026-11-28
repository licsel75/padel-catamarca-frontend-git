import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import api from '../services/api';

function UsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'jugador',
    rolAprobado: true
  });

  const [loading, setLoading] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!esEdicion) return;

    const cargarUsuario = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        const u = res.data;
        setFormData({
          nombre: u.nombre || '',
          email: u.email || '',
          password: '', // Se deja vacío; solo se envía si el admin quiere cambiarla
          rol: u.rol || 'jugador',
          rolAprobado: Boolean(u.rolAprobado)
        });
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar el usuario.');
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);

    try {
      const payload = { ...formData };
      // Si estamos editando y no se escribió nueva contraseña, la quitamos para no pisar la actual
      if (esEdicion && !payload.password.trim()) {
        delete payload.password;
      }

      if (esEdicion) {
        await api.put(`/users/${id}`, payload);
      } else {
        await api.post('/users', payload);
      }

      navigate('/admin?tab=usuarios');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar los datos del usuario.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p className="text-center mt-16 text-gray-500">Cargando usuario... ⏳</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/admin?tab=usuarios"
          className="text-sm font-bold text-primary hover:underline"
        >
          ← Volver a Usuarios
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <h1 className="text-2xl font-black text-primary mb-2">
          {esEdicion ? '✏️ Editar Usuario' : '➕ Crear Nuevo Usuario'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Administrá los datos de acceso, rol y permisos dentro de la plataforma.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-primary mb-1">Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-1">
              {esEdicion ? 'Nueva contraseña (dejar en blanco para mantener la actual)' : 'Contraseña'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!esEdicion}
              placeholder={esEdicion ? '••••••••' : 'Mínimo 6 caracteres'}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-secondary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-1">Rol en la plataforma</label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary focus:ring-2 focus:ring-secondary outline-none bg-white"
            >
              <option value="jugador">Jugador</option>
              <option value="profesor">Profesor</option>
              <option value="dueño_club">Dueño de Club</option>
              <option value="organizador">Organizador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-surface border border-gray-200 cursor-pointer">
            <input
              type="checkbox"
              name="rolAprobado"
              checked={formData.rolAprobado}
              onChange={handleChange}
              className="w-4 h-4 accent-primary cursor-pointer"
            />
            <div>
              <span className="block text-sm font-bold text-primary">Cuenta / Rol aprobado</span>
              <span className="block text-xs text-gray-500">
                Habilita al usuario para publicar clubes, torneos o su anuncio de profesor.
              </span>
            </div>
          </label>

          {/* ATAJO SI EL USUARIO ES PROFESOR */}
          {esEdicion && formData.rol === 'profesor' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-amber-900">🎓 Perfil de Profesor</p>
                <p className="text-xs text-amber-800">
                  Podés gestionar su anuncio y destacarlo desde la pestaña Profesores del panel.
                </p>
              </div>
              <Link
                to="/admin?tab=profesores"
                className="bg-amber-400 text-primary font-bold text-xs px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors shrink-0"
              >
                Ir a Profesores →
              </Link>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Link
              to="/admin?tab=usuarios"
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={guardando}
              className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm cursor-pointer disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;