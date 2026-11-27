import { Link } from 'react-router';

import imagenClub_00 from '../../assets/imagenClub_00.png'; 


const normalizarUrl = (valor, baseSocial = '') => {
  if (!valor) return '';
  const limpio = valor.trim();
  if (!limpio) return '';
  if (limpio.startsWith('http://') || limpio.startsWith('https://')) return limpio;
  if (limpio.startsWith('@') && baseSocial) return `${baseSocial}${limpio.slice(1)}`;
  return `https://${limpio}`;
};

function ClubCard({ club }) {
  const queryMaps = encodeURIComponent(
    `${club.nombre}, ${club.direccion}, ${club.departamento || 'Capital'}, Catamarca, Argentina`
  );
  const urlMaps = club.ubicacionMaps?.trim()
    ? normalizarUrl(club.ubicacionMaps)
    : `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;

  const redes = [
    {
      id: 'instagram',
      nombre: 'Instagram',
      url: normalizarUrl(club.instagram, 'https://instagram.com/'),
      hoverClass: 'hover:text-pink-600 hover:bg-pink-50',
      icono: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      id: 'facebook',
      nombre: 'Facebook',
      url: normalizarUrl(club.facebook, 'https://facebook.com/'),
      hoverClass: 'hover:text-blue-600 hover:bg-blue-50',
      icono: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
        </svg>
      )
    },
    {
      id: 'x',
      nombre: 'X (Twitter)',
      url: normalizarUrl(club.x, 'https://x.com/'),
      hoverClass: 'hover:text-primary hover:bg-gray-200',
      icono: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      id: 'sitioWeb',
      nombre: 'Sitio Web',
      url: normalizarUrl(club.sitioWeb),
      hoverClass: 'hover:text-secondary hover:bg-gray-200',
      icono: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    }
  ];

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between ${
        club.esSponsor ? 'ring-2 ring-amber-400/80' : ''
      }`}
    >
    {/* CABECERA */}
      <div className="bg-primary text-white p-3.5 flex flex-col gap-2">
        {/* Fila superior: etiquetas de departamento y sponsor */}
        <div className="flex items-center justify-between gap-2">
          <span className="bg-secondary text-primary text-[11px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wide">
            {(club.departamento || 'Capital').toUpperCase()}
          </span>

          {club.esSponsor && (
            <span
              title="Club Sponsor Oficial de Catamarca Pádel"
              className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wide shadow-sm"
            >
              ⭐ Sponsor Oficial
            </span>
          )}
        </div>

        {/* Fila inferior: nombre completo del club a ancho total */}
        
        <h3 className="font-bold text-base leading-snug line-clamp-2" title={club.nombre}>
          🏟️ {club.nombre}
        </h3>
      </div>
      <div className="mt-2 w-full h-60 rounded-lg overflow-hidden border-2 border-white/20 shadow-sm">
          <img 
            src={imagenClub_00} 
            alt={`Foto del club ${club.nombre}`} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

      {/* CUERPO */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <a
            href={urlMaps}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver ubicación en Google Maps"
            className="text-sm text-gray-600 hover:text-secondary mb-2 flex items-center gap-1.5 transition-colors group"
          >
            <span>📍 {club.direccion}</span>
            <span className="text-[11px] font-bold text-secondary opacity-80 group-hover:underline shrink-0">
              (Mapa ↗)
            </span>
          </a>

          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1.5">
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

        {/* BARRA DE REDES */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mr-auto">
            Canales:
          </span>

          {redes.map((red) =>
            red.url ? (
              <a
                key={red.id}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Ir a ${red.nombre}`}
                aria-label={red.nombre}
                className={`p-1.5 rounded-lg bg-surface text-gray-700 transition-colors ${red.hoverClass}`}
              >
                {red.icono}
              </a>
            ) : (
              <span
                key={red.id}
                title={`${red.nombre} no cargado`}
                aria-label={`${red.nombre} no disponible`}
                className="p-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
              >
                {red.icono}
              </span>
            )
          )}
        </div>
      </div>

      {/* PIE CON BOTÓN VER DETALLE */}
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