import { Link } from 'react-router';

function ClubCard({ club }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between">
      {/* CABECERA IDÉNTICA A TORNEO CARD */}
      <div className="bg-primary text-white p-3 flex justify-between items-center">
        <span className="font-bold text-sm truncate pr-2">🏟️ {club.nombre}</span>
        <span className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded shrink-0">
          {(club.departamento || 'Capital').toUpperCase()}
        </span>
      </div>

      {/* CUERPO */}
      <div className="p-5 flex-grow">
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          📍 {club.direccion}
        </p>
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          📞 {club.telefono}
        </p>

        {club.servicios && club.servicios.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {club.servicios.map((servicio, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded"
              >
                {servicio}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PIE CON EL MISMO BOTÓN VERDE LIMA */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to={`/clubes/${club._id}`}
          className="block w-full text-center bg-secondary text-white font-bold py-2 rounded-lg hover:bg-lime-600 transition-colors"
        >
          Ver Detalle
        </Link>
      </div>
    </div>
  );
}

export default ClubCard;