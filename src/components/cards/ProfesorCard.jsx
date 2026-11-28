function ProfesorCard({ perfil }) {
  // 1. Protegemos el acceso al teléfono por si el Backend no lo envía
  const telefonoLimpio = perfil?.telefono ? perfil.telefono.replace(/\D/g, '') : null;
  const nombreProfe = perfil?.usuario?.nombre || 'Profesor';
  const esDestacado = Boolean(perfil?.esDestacado);

  const whatsappUrl = telefonoLimpio
    ? `https://wa.me/549${telefonoLimpio}?text=${encodeURIComponent(
        `Hola ${nombreProfe}, vi tu anuncio "${perfil.titulo}" en Catamarca Pádel y quería consultar por clases.`
      )}`
    : null;

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between ${
        esDestacado ? 'ring-2 ring-amber-400' : ''
      }`}
    >
      {/* CABECERA */}
      <div className="bg-primary text-white p-3 flex justify-between items-center gap-2">
        <span className="font-bold text-sm truncate">🎓 {nombreProfe}</span>

        <div className="flex items-center gap-1.5 shrink-0">
          {esDestacado && (
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-1 rounded shadow-sm">
              ⭐ DESTACADO
            </span>
          )}
         
        </div>
      </div>

      {/* CUERPO */}
      <div className="p-5 flex-grow space-y-3">
        <h3 className="text-lg font-extrabold text-primary leading-snug">
          {perfil.titulo}
        </h3>

        {perfil.estudios && (
          <p className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
            🏅 {perfil.estudios}
          </p>
        )}

        <p className="text-sm text-gray-700 flex items-start gap-1.5">
          <span>🕒</span>
          <span>{perfil.diasHorarios}</span>
        </p>

        <p className="text-sm text-gray-600 flex items-start gap-1.5">
          <span>📍</span>
          <span>
            {perfil.clubes && perfil.clubes.length > 0
              ? perfil.clubes.map((c) => `${c.nombre} (${c.departamento || 'Capital'})`).join(' • ')
              : 'Club a coordinar'}
          </span>
        </p>

        {perfil.descripcion && (
          <p className="text-xs text-gray-500 italic leading-relaxed">
            "{perfil.descripcion}"
          </p>
        )}

        {perfil.niveles && perfil.niveles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {perfil.niveles.map((nivel) => (
              <span key={nivel} className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                {nivel}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PIE */}
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
            <p>📞 {perfil?.telefono || "Teléfono no disponible"}</p>
          </span>
        )}
      </div>
    </div>
  );
}

export default ProfesorCard;