import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import api from '../services/api';

function ClubDetalle() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [torneosDelClub, setTorneosDelClub] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarClubYTorneos = async () => {
      setLoading(true);
      try {
        const [resClub, resTorneos] = await Promise.all([
          api.get(`/clubes/${id}`),
          api.get(`/torneos?club=${id}`)
        ]);
        setClub(resClub.data);
        setTorneosDelClub(resTorneos.data);
      } catch (err) {
        setError('No se pudo cargar la información del club.');
      } finally {
        setLoading(false);
      }
    };

    cargarClubYTorneos();
  }, [id]);

  if (loading) return <p className="text-center mt-16 text-gray-500">Cargando ficha del club... ⏳</p>;
  if (error || !club) {
    return (
      <div className="text-center mt-16">
        <p className="text-red-500 font-bold mb-4">{error || 'Club no encontrado'}</p>
        <Link to="/" className="text-primary underline font-bold">← Volver al inicio</Link>
      </div>
    );
  }

  // Limpiamos el teléfono para enlace directo a WhatsApp
  const telefonoLimpio = club.telefono?.replace(/\D/g, '');
  const whatsappUrl = telefonoLimpio
    ? `https://wa.me/549${telefonoLimpio}?text=${encodeURIComponent(`Hola ${club.nombre}, vi el club en Catamarca Pádel y quería hacer una consulta.`)}`
    : null;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Link to="/" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-6">
        ← Volver a Nuestros Clubes
      </Link>

      {/* CABECERA DEL CLUB */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-secondary text-primary text-xs font-black px-3 py-1 rounded-full uppercase">
              Departamento {club.departamento || 'Capital'}
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-3">🏟️ {club.nombre}</h1>
            <p className="text-gray-200 text-sm mt-2">📍 {club.direccion}</p>
          </div>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary text-primary font-extrabold px-6 py-3 rounded-xl hover:bg-lime-400 transition-colors shadow-md text-sm shrink-0"
            >
              💬 Contactar por WhatsApp
            </a>
          )}
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* INFORMACIÓN Y SERVICIOS */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-primary mb-3">Servicios e Instalaciones</h2>
              {club.servicios && club.servicios.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {club.servicios.map((srv, idx) => (
                    <span
                      key={idx}
                      className="bg-surface border border-gray-200 text-primary font-semibold px-4 py-2 rounded-lg text-sm"
                    >
                      ✓ {srv}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Sin servicios especificados.</p>
              )}
            </div>

            {/* ESPACIO PREPARADO PARA GALERÍA DE FOTOS */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-3">Galería de Fotos</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-surface">
                <span className="text-3xl block mb-2">📸</span>
                <p className="text-sm font-semibold text-gray-600">
                  Próximamente galería de fotos de las canchas e instalaciones de {club.nombre}.
                </p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: TORNEOS EN ESTE CLUB */}
          <div className="bg-surface border border-gray-200 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-primary mb-4">🏆 Torneos en esta sede</h2>

            {torneosDelClub.length === 0 ? (
              <p className="text-sm text-gray-500">
                Este club no tiene torneos programados por el momento.
              </p>
            ) : (
              <div className="space-y-3">
                {torneosDelClub.map((torneo) => (
                  <Link
                    key={torneo._id}
                    to={`/torneos/${torneo._id}`}
                    className="block bg-white p-3.5 rounded-xl border border-gray-200 hover:border-secondary transition-colors shadow-sm"
                  >
                    <p className="font-bold text-primary text-sm">{torneo.nombre}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(torneo.fechaInicio).toLocaleDateString('es-AR')}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubDetalle;