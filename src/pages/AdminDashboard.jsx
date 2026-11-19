import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../services/api';

function AdminDashboard() {
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarTorneos = async () => {
    try {
      const res = await api.get('/torneos');
      setTorneos(res.data);
    } catch (err) {
      setError('Error al cargar los torneos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTorneos();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que querés eliminar este torneo?')) {
      try {
        await api.delete(`/torneos/${id}`);
        alert('Torneo eliminado');
        cargarTorneos(); // Recargamos la lista
      } catch (err) {
        alert('Error al eliminar');
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando panel... ⏳</p>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
        <Link to="/admin/crear" className="bg-secondary text-primary font-bold px-6 py-3 rounded-lg hover:bg-lime-500 transition-colors">
          + Crear Torneo
        </Link>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-4">Torneo</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {torneos.map((torneo) => (
              <tr key={torneo._id} className="border-b border-gray-100 hover:bg-surface transition-colors">
                <td className="p-4 font-semibold">{torneo.nombre}</td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(torneo.fechaInicio).toLocaleDateString('es-AR')}
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded uppercase">
                    {torneo.estado}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  <Link to={`/admin/editar/${torneo._id}`} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(torneo._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">
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
    </div>
  );
}

export default AdminDashboard;