import { useMemo } from 'react';
import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';
import ClubCard from '../components/cards/ClubCard';

function Home() {
  // Consumo el listado público de clubes
  const { data: clubes } = useFetch('/clubes');

  // Calculo los 3 clubes destacados (priorizando sponsors)
  const clubesDestacados = useMemo(() => {
    if (!clubes) return [];
    return [...clubes]
      .sort((a, b) => Number(Boolean(b.esSponsor)) - Number(Boolean(a.esSponsor)))
      .slice(0, 3);
  }, [clubes]);

  return (
    <div>
      {/* --- HERO SECTION --- */}
      <section
        className="relative w-full min-h-[calc(100vh-72px)] flex items-end justify-start bg-primary text-white px-6 md:px-12 lg:px-16 pb-12 md:pb-16 pt-24 text-left bg-cover bg-center bg-no-repeat border-b border-gray-800"
        style={{
          backgroundImage: `linear-gradient(to top right, rgba(15, 23, 42, 0.92) 15%, rgba(15, 23, 42, 0.45) 55%, rgba(15, 23, 42, 0.15) 100%), url('/landin.png')`
        }}
      >
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight drop-shadow-md">
            TU GUÍA DEL PÁDEL CATAMARQUEÑO. <br />
            <span className="text-secondary">
              Clubes, torneos, profesores y mucho más!
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-8 drop-shadow">
            Explorá complejos por departamento, agendá tus próximos torneos y conectá directo con los mejores profes de la provincia.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/clubes"
              className="inline-flex items-center gap-2 bg-secondary text-primary text-lg font-extrabold px-10 py-4 rounded-lg hover:bg-lime-500 transition-colors shadow-lg cursor-pointer"
            >
              Ver Clubes <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN: CLUBES DESTACADOS (Solo 3) --- */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-primary">
              Nuestros Clubes
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Los complejos más destacados de la provincia.
            </p>
          </div>
          <Link 
            to="/clubes" 
            className="text-primary font-bold hover:text-secondary flex items-center gap-1 transition-colors"
          >
            Ver todos los clubes →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubesDestacados.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      </section>

      {/* --- SECCIÓN: TEASER HISTORIA --- */}
      <section className="bg-surface py-16 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-secondary font-bold text-sm uppercase tracking-wider mb-2 block">
            Especial Histórico
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            ¿Conocés la historia del pádel en Catamarca?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            De las canchas de cemento de los 90 al número uno del mundo. Descubrí el Salón de la Fama y los secretos de nuestro deporte.
          </p>
          <Link 
            to="/historia" 
            className="inline-flex items-center gap-2 bg-secondary text-primary font-bold px-8 py-3 rounded-lg hover:bg-lime-500 transition-colors shadow-md"
          >
            Leer la historia completa
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;