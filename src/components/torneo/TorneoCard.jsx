import { Link } from 'react-router';

function TorneoCard({ torneo }) {
  // Función auxiliar para formatear fechas de forma segura
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'A confirmar';
    const fecha = new Date(fechaString);
    if (isNaN(fecha.getTime())) return 'A confirmar';

    return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const inicio = formatearFecha(torneo.fechaInicio);
  const fin = formatearFecha(torneo.fechaFin);
  const esFinalizado = torneo.estado?.toLowerCase() === 'finalizado';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between">
      <div className="bg-primary text-white p-3 flex justify-between items-center gap-2">
        <span className="font-bold text-sm truncate">🏆 {torneo.nombre}</span>
        <span
          className={`text-xs font-extrabold px-2 py-1 rounded shrink-0 ${
            esFinalizado
              ? 'bg-gray-600 text-gray-200'
              : 'bg-secondary text-primary'
          }`}
        >
          {torneo.estado.toUpperCase()}
        </span>
      </div>

      <div className="p-5 flex-grow">
        <p className="text-secondary font-bold mb-2 flex items-center gap-1">
          📅 {inicio} {inicio !== fin && `al ${fin}`}
        </p>

        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          📍{' '}
          {torneo.clubes && torneo.clubes.length > 0
            ? torneo.clubes.map((c) => c.nombre || 'Club sin nombre').join(' y ')
            : 'Sede a confirmar'}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {torneo.categorias.map((cat) => (
            <span key={cat} className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
              {cat}
            </span>
          ))}
        </div>

        {torneo.premio && (
          <p className="text-xs font-bold text-gray-700 mt-3 flex items-center gap-1">
            🏆 Premio: {torneo.premio}
          </p>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <Link
          to={`/torneos/${torneo._id}`}
          className="block w-full text-center bg-secondary text-primary font-extrabold py-2 rounded-lg hover:bg-lime-500 transition-colors"
        >
          Ver Detalle
        </Link>
      </div>
    </div>
  );
}

export default TorneoCard;