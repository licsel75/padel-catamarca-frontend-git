import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import api from '../services/api';

// Reemplazá este número por tu WhatsApp real (549 + código de área + número sin 15)
const WHATSAPP_ADMIN = '5493834243569';

const normalizarUrl = (valor, baseSocial = '') => {
  if (!valor) return '';
  const limpio = valor.trim();
  if (!limpio) return '';
  if (limpio.startsWith('http://') || limpio.startsWith('https://')) return limpio;
  if (limpio.startsWith('@') && baseSocial) return `${baseSocial}${limpio.slice(1)}`;
  return `https://${limpio}`;
};

function ClubDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [todosLosClubes, setTodosLosClubes] = useState([]);
  const [torneosDelClub, setTorneosDelClub] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarClubYTorneos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resClub, resTorneos, resTodosClubes] = await Promise.all([
          api.get(`/clubes/${id}`),
          api.get(`/torneos?club=${id}`),
          api.get('/clubes')
        ]);
        setClub(resClub.data);
        setTorneosDelClub(resTorneos.data);
        setTodosLosClubes(Array.isArray(resTodosClubes.data) ? resTodosClubes.data : []);
      } catch (err) {
        setError('No se pudo cargar la información del club.');
      } finally {
        setLoading(false);
      }
    };

    cargarClubYTorneos();
  }, [id]);

  const indiceActual = todosLosClubes.findIndex((c) => c._id === id);
  const clubAnterior =
    indiceActual > -1 && todosLosClubes.length > 1
      ? todosLosClubes[(indiceActual - 1 + todosLosClubes.length) % todosLosClubes.length]
      : null;

  const clubSiguiente =
    indiceActual > -1 && todosLosClubes.length > 1
      ? todosLosClubes[(indiceActual + 1) % todosLosClubes.length]
      : null;

  if (loading) return <p className="text-center mt-16 text-gray-500">Cargando ficha del club... ⏳</p>;
  if (error || !club) {
    return (
      <div className="text-center mt-16">
        <p className="text-red-500 font-bold mb-4">{error || 'Club no encontrado'}</p>
        <Link to="/" className="text-primary underline font-bold">← Volver al inicio</Link>
      </div>
    );
  }

  const telefonoLimpio = club.telefono?.replace(/\D/g, '');
  const whatsappUrl = telefonoLimpio
    ? `https://wa.me/549${telefonoLimpio}?text=${encodeURIComponent(`Hola ${club.nombre}, vi el club en Catamarca Pádel y quería hacer una consulta.`)}`
    : null;

  const whatsappSponsorUrl = `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(
    `Hola! Soy de ${club.nombre} (${club.departamento || 'Capital'}) y me interesa destacar el club como Sponsor Oficial en Catamarca Pádel.`
  )}`;

  const busquedaUbicacion = `${club.nombre}, ${club.direccion}, ${club.departamento || 'Capital'}, Catamarca, Argentina`;
  const queryMaps = encodeURIComponent(busquedaUbicacion);
  const googleMapsUrl = club.ubicacionMaps?.trim()
    ? normalizarUrl(club.ubicacionMaps)
    : `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;
  const mapaEmbedUrl = `https://maps.google.com/maps?q=${queryMaps}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const redesActivas = [
    { id: 'instagram', label: 'Instagram', icon: '📸', url: normalizarUrl(club.instagram, 'https://instagram.com/') },
    { id: 'facebook', label: 'Facebook', icon: '📘', url: normalizarUrl(club.facebook, 'https://facebook.com/') },
    { id: 'x', label: 'X (Twitter)', icon: '✖️', url: normalizarUrl(club.x, 'https://x.com/') },
    { id: 'sitioWeb', label: 'Sitio Web / Reservas', icon: '🌐', url: normalizarUrl(club.sitioWeb) }
  ].filter((r) => Boolean(r.url));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* BARRA SUPERIOR: VOLVER + FLECHAS ANTERIOR / SIGUIENTE CLUB */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          className="inline-flex items-center text-sm font-bold text-primary hover:underline cursor-pointer"
        >
          ← Volver
        </button>

        {clubAnterior && clubSiguiente && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/clubes/${clubAnterior._id}`)}
              title={`Ver ${clubAnterior.nombre}`}
              className="bg-white border border-gray-200 text-primary hover:border-secondary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span>←</span>
              <span className="hidden sm:inline">{clubAnterior.nombre}</span>
              <span className="sm:hidden">Anterior</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/clubes/${clubSiguiente._id}`)}
              title={`Ver ${clubSiguiente.nombre}`}
              className="bg-white border border-gray-200 text-primary hover:border-secondary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="hidden sm:inline">{clubSiguiente.nombre}</span>
              <span className="sm:hidden">Siguiente</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* CABECERA DEL CLUB */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-secondary text-primary text-xs font-black px-3 py-1 rounded-full uppercase">
                Departamento {club.departamento || 'Capital'}
              </span>

              {club.esSponsor && (
                <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                  ⭐ Sponsor Oficial
                </span>
              )}
            </div>

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

        {/* FRANJA DE RECONOCIMIENTO PARA CLUBES SPONSORS */}
        {club.esSponsor && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 md:px-8 py-2.5 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-amber-900">
              ⭐ <span className="font-extrabold">{club.nombre}</span> auspicia y apoya el desarrollo de{' '}
              <span className="font-extrabold">Catamarca Pádel</span>.
            </p>
            <span className="hidden sm:inline text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              Sede Destacada
            </span>
          </div>
        )}

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* INFORMACIÓN, REDES Y MAPA */}
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

            {/* REDES SOCIALES Y WEB */}
            {redesActivas.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-primary mb-3">Redes Sociales y Web</h2>
                <div className="flex flex-wrap gap-2.5">
                  {redesActivas.map((red) => (
                    <a
                      key={red.id}
                      href={red.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-surface border border-gray-200 hover:border-secondary text-primary font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
                    >
                      <span>{red.icon}</span>
                      <span>{red.label}</span>
                      <span className="text-xs text-secondary">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* MAPA DE UBICACIÓN EMBEBIDO + ENLACE DIRECTO A GOOGLE MAPS */}
            <div>
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h2 className="text-lg font-bold text-primary">Ubicación</h2>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-extrabold text-secondary hover:underline"
                >
                  🗺️ Abrir en Google Maps ↗
                </a>
              </div>

              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-64 bg-surface">
                <iframe
                  title={`Mapa de ${club.nombre}`}
                  src={mapaEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
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

        {/* PIE SUTIL PARA INVITAR A DUEÑOS A CONVERTIRSE EN SPONSORS (SOLO SI NO ES SPONSOR) */}
        {!club.esSponsor && (
          <div className="bg-surface border-t border-gray-100 px-6 md:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>¿Sos dueño o administrador de este complejo?</span>
            <a
              href={whatsappSponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:text-secondary underline"
            >
              ⭐ Destacá tu club como Sponsor Oficial →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubDetalle;