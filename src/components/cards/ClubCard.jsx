function ClubCard({ club }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary mb-2">{club.nombre}</h3>
        <p className="text-gray-600 text-sm mb-4">📍 {club.direccion}</p>
        <p className="text-gray-600 text-sm mb-4">📞 {club.telefono}</p>
        
        {/* Mostramos los servicios como etiquetas */}
        <div className="flex flex-wrap gap-2">
          {club.servicios.map((servicio, index) => (
            <span key={index} className="bg-surface text-xs font-semibold text-gray-600 px-2 py-1 rounded-md border border-gray-200">
              {servicio}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ClubCard;