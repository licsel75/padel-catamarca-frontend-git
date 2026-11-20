function ProfesorCard({ perfil }) {
  // Limpio el número de teléfono dejando solo dígitos para construir el enlace directo a WhatsApp
  const telefonoLimpio = perfil.telefono?.replace(/\D/g, '');
  const nombreProfe = perfil.usuario?.nombre || 'Profesor';
  const whatsappUrl = telefonoLimpio
    ? `https://wa.me/549${telefonoLimpio}?text=${encodeURIComponent(
        `Hola ${nombreProfe}, vi tu anuncio "${perfil.titulo}" en Catamarca Pádel y quería consultar por clases.`
      )}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between">
      {/* CABECERA IDÉNTICA A TORNEO Y CLUB CARD */}
      <div className="bg-primary text-white p-3 flex justify-between items-center gap-2">
        <span className="font-bold text-sm truncate">🎓 {nombreProfe}</span>
        <span className="bg-secondary text-primary text-xs font-bold px-2 py-1 rounded shrink-0">
          PROFESOR
        </span>
      </div>

      {/* CUERPO DEL ANUNCIO */}
      <div className="p-5 flex-grow space-y-3">
        <h3 className="text-lg font-extrabold text-primary leading-snug">
          {perfil.titulo}
        </h3>

        {/* Credenciales o estudios (APA, AJPP, categoría) */}
        {perfil.estudios && (
          <p className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
            🏅 {perfil.estudios}
          </p>
        )}

        {/* Días y horarios */}
        <p className="text-sm text-gray-700 flex items-start gap-1.5">
          <span>🕒</span>
          <span>{perfil.diasHorarios}</span>
        </p>

        {/* Clubes donde dicta clases */}
        <p className="text-sm text-gray-600 flex items-start gap-1.5">
          <span>📍</span>
          <span>
            {perfil.clubes && perfil.clubes.length > 0
              ? perfil.clubes.map((c) => `${c.nombre} (${c.departamento || 'Capital'})`).join(' • ')
              : 'Club a coordinar'}
          </span>
        </p>

        {/* Descripción breve */}
        {perfil.descripcion && (
          <p className="text-xs text-gray-500 italic leading-relaxed">
            "{perfil.descripcion}"
          </p>
        )}

        {/* Etiquetas de niveles / categorías que entrena */}
        {perfil.niveles && perfil.niveles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {perfil.niveles.map((nivel) => (
              <span
                key={nivel}
                className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded"
              >
                {nivel}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PIE CON BOTÓN DE CONTACTO DIRECTO */}
      <div className="p-4 border-t border-gray-100">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-secondary text-white font-bold py-2 rounded-lg hover:bg-lime-600 transition-colors"
          >
            💬 Consultar Clases
          </a>
        ) : (
          <span className="block w-full text-center bg-gray-100 text-gray-500 font-bold py-2 rounded-lg text-sm">
            📞 {perfil.telefono}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProfesorCard;