import { Link } from 'react-router';

function Sponsors() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-14">
        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
          🚧 Sección en Construcción
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-primary mb-4">
          Nuestros <span className="text-secondary">Sponsors</span>
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg leading-relaxed mb-8">
          Estamos preparando este espacio para destacar a las marcas, complejos e instituciones que apoyan el crecimiento del pádel en Catamarca.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            ← Volver al Inicio
          </Link>

          <Link
            to="/clubes"
            className="bg-secondary text-primary font-extrabold px-6 py-3 rounded-xl hover:bg-lime-500 transition-colors text-sm"
          >
            Ver Clubes Destacados
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Sponsors;