import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const esAdmin = user?.rol === 'admin';
  const esGestor = ['admin', 'organizador', 'dueño_club'].includes(user?.rol);

  // Pestaña inicial según rol
  const [tab, setTab] = useState(esGestor ? 'clubes' : 'favoritos');

  const [clubes, setClubes] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Todos cargan sus favoritos
      const resFav = await api.get('/favoritos');
      setFavoritos(resFav.data);

      // 2. Gestores (admin, organizador, dueño_club) cargan clubes y torneos
      if (esGestor) {
        const [resClubes, resTorneos] = await Promise.all([
          api.get('/clubes'),
          api.get('/torneos')
        ]);

        if (esAdmin) {
          setClubes(resClubes.data);
          setTorneos(resTorneos.data);
        } else {
          // Organizador / dueño_club solo ve los suyos
          setClubes(resClubes.data.filter((c) => (c.usuario?._id || c.usuario) === user.id));
          setTorneos(resTorneos.data.filter((t) => (t.usuario?._id || t.usuario) === user.id));
        }
      }

      // 3. Solo admin carga usuarios
      if (esAdmin) {
        const resUsers = await api.get('/users');
        setUsuarios(resUsers.data);
      }
    } catch (err) {
      setError('Error al cargar los datos del panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  // --- ACCIONES CLUBES ---
  const handleDeleteClub = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este club?')) return;
    try {
      await api.delete(`/clubes/${id}`);
      setClubes((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar el club');
    }
  };

  // --- ACCIONES TORNEOS ---
  const handleDeleteTorneo = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este torneo?')) return;
    try {
      await api.delete(`/torneos/${id}`);
      setTorneos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar el torneo');
    }
  };

  // --- ACCIONES USUARIOS (SOLO ADMIN) ---
  const handleAprobarUsuario = async (id) => {
    try {
      await api.put(`/users/${id}/aprobar`);
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, rolAprobado: true } : u))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Error al aprobar usuario');
    }
  };

  const handleToggleBloqueo = async (id) => {
    try {
      const res = await api.put(`/users/${id}/bloquear`);
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, bloqueado: res.data.user.bloqueado } : u))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Error al bloquear/desbloquear usuario');
    }
  };

  // --- ACCIONES FAVORITOS ---
  const handleQuitarFavorito = async (torneoId) => {
    try {
      await api.post(`/favoritos/toggle/${torneoId}`);
      setFavoritos((prev) => prev.filter((f) => (f.torneo?._id || f._id) !== torneoId));
    } catch (err) {
      alert('Error al quitar de favoritos');
    }
  };

  const limiteClubesAlcanzado = !esAdmin && clubes.length >= 5;

  if (loading) return <p className="text-center mt-10">Cargando panel... ⏳</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {esAdmin ? 'Panel de Administración Global' : 'Mi Panel'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sesión iniciada como <span className="font-bold uppercase text-primary">{user?.rol}</span>
          </p>
        </div>

        {/* BOTONES DE CREACIÓN RÁPIDA */}
        {esGestor && (
          <div className="flex flex-wrap gap-3">
            {limiteClubesAlcanzado ? (
              <span
                title="Alcanzaste el límite de 5 clubes"
                className="bg-gray-200 text-gray-500 font-bold px-5 py-3 rounded-lg cursor-not-allowed text-sm"
              >
                Límite de Clubes (5/5)
              </span>
            ) : (
              <Link
                to="/admin/clubes/crear"
                className="bg-primary text-white font-bold px-5 py-3 rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                + Crear Club {!esAdmin && `(${clubes.length}/5)`}
              </Link>
            )}

            <Link
              to="/admin/crear"
              className="bg-secondary text-primary font-bold px-5 py-3 rounded-lg hover:bg-lime-500 transition-colors text-sm"
            >
              + Crear Torneo
            </Link>
          </div>
        )}
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6 pb-2">
        {esGestor && (
          <>
            <button
              onClick={() => setTab('clubes')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                tab === 'clubes' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {esAdmin ? `Clubes (${clubes.length})` : `Mis Clubes (${clubes.length}/5)`}
            </button>

            <button
              onClick={() => setTab('torneos')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                tab === 'torneos' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {esAdmin ? `Torneos (${torneos.length})` : `Mis Torneos (${torneos.length})`}
            </button>
          </>
        )}

        {esAdmin && (
          <button
            onClick={() => setTab('usuarios')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              tab === 'usuarios' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Usuarios ({usuarios.length})
          </button>
        )}

        <button
          onClick={() => setTab('favoritos')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
            tab === 'favoritos' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          Mis Favoritos ({favoritos.length})
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* ==================== TAB 1: CLUBES ==================== */}
      {tab === 'clubes' && esGestor && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4">Club</th>
                <th className="p-4">Dirección</th>
                <th className="p-4">Teléfono</th>
                {esAdmin && <th className="p-4">Dueño / Org.</th>}
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clubes.map((club) => (
                <tr key={club._id} className="border-b border-gray-100 hover:bg-surface">
                  <td className="p-4 font-semibold">{club.nombre}</td>
                  <td className="p-4 text-sm text-gray-600">{club.direccion}</td>
                  <td className="p-4 text-sm text-gray-600">{club.telefono}</td>
                  {esAdmin && (
                    <td className="p-4 text-xs text-gray-500">{club.usuario?.nombre || 'N/A'}</td>
                  )}
                  <td className="p-4 flex justify-center gap-3">
                    <Link
                      to={`/admin/clubes/editar/${club._id}`}
                      className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteClub(club._id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clubes.length === 0 && (
            <p className="text-center p-10 text-gray-500">No hay clubes cargados todavía.</p>
          )}
        </div>
      )}

      {/* ==================== TAB 2: TORNEOS ==================== */}
      {tab === 'torneos' && esGestor && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4">Torneo</th>
                <th className="p-4">Fecha Inicio</th>
                <th className="p-4">Estado</th>
                {esAdmin && <th className="p-4">Organizador</th>}
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {torneos.map((torneo) => (
                <tr key={torneo._id} className="border-b border-gray-100 hover:bg-surface">
                  <td className="p-4 font-semibold">{torneo.nombre}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(torneo.fechaInicio).toLocaleDateString('es-AR')}
                  </td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
                      {torneo.estado}
                    </span>
                  </td>
                  {esAdmin && (
                    <td className="p-4 text-xs text-gray-500">{torneo.usuario?.nombre || 'N/A'}</td>
                  )}
                  <td className="p-4 flex justify-center gap-3">
                    <Link
                      to={`/admin/editar/${torneo._id}`}
                      className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteTorneo(torneo._id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {torneos.length === 0 && (
            <p className="text-center p-10 text-gray-500">No hay torneos creados todavía.</p>
          )}
        </div>
      )}

      {/* ==================== TAB 3: USUARIOS (SOLO ADMIN) ==================== */}
      {tab === 'usuarios' && esAdmin && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4">Nombre</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-surface">
                  <td className="p-4 font-semibold">{u.nombre}</td>
                  <td className="p-4 text-sm text-gray-600">{u.email}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded uppercase">
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-4 flex flex-col gap-1">
                    {u.bloqueado ? (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded w-fit">
                        BLOQUEADO
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded w-fit">
                        ACTIVO
                      </span>
                    )}

                    {!u.rolAprobado && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded w-fit">
                        PENDIENTE APROBACIÓN
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {!u.rolAprobado && (
                        <button
                          onClick={() => handleAprobarUsuario(u._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700"
                        >
                          Aprobar Rol
                        </button>
                      )}

                      {u._id !== user.id && (
                        <button
                          onClick={() => handleToggleBloqueo(u._id)}
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            u.bloqueado
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                        >
                          {u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==================== TAB 4: FAVORITOS (TODOS LOS ROLES) ==================== */}
      {tab === 'favoritos' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-4">Torneo Guardado</th>
                <th className="p-4">Fecha Inicio</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {favoritos.map((fav) => {
                // Soporta tanto si el backend devuelve { _id, torneo: {...} } como si devuelve el torneo directo
                const t = fav.torneo || fav;
                return (
                  <tr key={fav._id} className="border-b border-gray-100 hover:bg-surface">
                    <td className="p-4 font-semibold">{t.nombre}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {t.fechaInicio ? new Date(t.fechaInicio).toLocaleDateString('es-AR') : '-'}
                    </td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
                        {t.estado || 'abierto'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleQuitarFavorito(t._id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Quitar de favoritos
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {favoritos.length === 0 && (
            <p className="text-center p-10 text-gray-500">
              Todavía no guardaste torneos en tus favoritos. Explorá la sección{' '}
              <Link to="/torneos" className="text-primary font-bold underline">
                Torneos
              </Link>{' '}
              para agendar los que te interesen.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;