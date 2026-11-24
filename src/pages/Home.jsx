import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';
import ClubCard from '../components/cards/ClubCard';
import { DEPARTAMENTOS_CATAMARCA } from '../constants/departamentos';

function Home() {
  // Consumo el listado público de clubes usando mi custom hook useFetch
  const { data: clubes, loading, error } = useFetch('/clubes');
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Función de desplazamiento suave hacia la sección de clubes
  const irAClubes = () => {
    const seccionClubes = document.getElementById('seccion-clubes');
    if (seccionClubes) {
      seccionClubes.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculo dinámicamente los departamentos que tienen al menos 1 club cargado, ordenados por cantidad de clubes
  const departamentosConClubes = useMemo(() => {
    if (!Array.isArray(clubes) || clubes.length === 0) return ['Todos'];

    const conteoPorDpto = clubes.reduce((acc, club) => {
      const dpto = (club.departamento || 'Capital').trim();
      acc[dpto] = (acc[dpto] || 0) + 1;
      return acc;
    }, {});

    const ordenados = Object.entries(conteoPorDpto)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([dpto]) => dpto);

    return ['Todos', ...ordenados];
  }, [clubes]);

  // Filtro los clubes en tiempo real por departamento y por texto, dejando los Sponsors primeros
  const clubesFiltrados = clubes
    ? clubes
        .filter((club) => {
          const dptoClub = club.departamento || 'Capital';
          const coincideDpto =
            departamentoSeleccionado === 'Todos' || dptoClub === departamentoSeleccionado;

          const termino = busqueda.toLowerCase().trim();
          const coincideTexto =
            !termino ||
            club.nombre.toLowerCase().includes(termino) ||
            club.direccion.toLowerCase().includes(termino);

          return coincideDpto && coincideTexto;
        })
        .sort((a, b) => Number(Boolean(b.esSponsor)) - Number(Boolean(a.esSponsor)))
    : [];

  return (
    <div>
      {/* Hero Section a pantalla completa con contenido anclado en la esquina inferior izquierda */}
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
            <button
              type="button"
              onClick={irAClubes}
              className="inline-flex items-center gap-2 bg-secondary text-primary text-lg font-extrabold px-15 py-4 rounded-lg hover:bg-lime-500 transition-colors shadow-lg cursor-pointer"
            >
              Ver Clubes <span aria-hidden="true">↓</span>
            </button>

            
          </div>
        </div>
      </section>

      {/* Sección de Clubes */}
      <section id="seccion-clubes" className="max-w-6xl mx-auto py-16 px-4 scroll-mt-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-primary text-center md:text-left">
              Nuestros Clubes
            </h2>
            <p className="text-sm text-gray-500 text-center md:text-left mt-1">
              Encontrá canchas y complejos en toda la provincia
            </p>
          </div>

          {/* BARRA DE FILTROS: BUSCADOR + SELECTOR DE DEPARTAMENTO */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar club o dirección..."
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-secondary outline-none w-full sm:w-60"
            />

            <select
              value={departamentoSeleccionado}
              onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm font-semibold text-primary focus:ring-2 focus:ring-secondary outline-none w-full sm:w-56"
            >
              <option value="Todos">📍 Todos los deptos.</option>
              {DEPARTAMENTOS_CATAMARCA.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PÍLDORAS DINÁMICAS SEGÚN LOS DEPARTAMENTOS CON CLUBES CARGADOS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {departamentosConClubes.map((dep) => (
            <button
              key={dep}
              type="button"
              onClick={() => setDepartamentoSeleccionado(dep)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                departamentoSeleccionado === dep
                  ? 'bg-primary text-secondary shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
              }`}
            >
              {dep}
            </button>
          ))}
        </div>

        {/* BARRA DE RESUMEN CON CONTADOR DINÁMICO DE CLUBES */}
        {!loading && !error && clubes && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-3 border-b border-gray-200">
            <p className="text-sm text-gray-600 font-medium">
              {departamentoSeleccionado === 'Todos' ? (
                <>
                  Mostrando <span className="font-black text-primary">{clubesFiltrados.length}</span>{' '}
                  {clubesFiltrados.length === 1 ? 'club' : 'clubes'} en toda la provincia
                </>
              ) : (
                <>
                  📍 <span className="font-bold text-primary">{departamentoSeleccionado}</span> —{' '}
                  <span className="font-black text-primary bg-secondary px-2.5 py-0.5 rounded-full text-xs">
                    {clubesFiltrados.length} {clubesFiltrados.length === 1 ? 'club' : 'clubes'}
                  </span>
                </>
              )}
            </p>

            {(departamentoSeleccionado !== 'Todos' || busqueda.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setDepartamentoSeleccionado('Todos');
                  setBusqueda('');
                }}
                className="text-xs font-bold text-primary hover:text-secondary underline cursor-pointer"
              >
                Limpiar filtros ✕
              </button>
            )}
          </div>
        )}

        {loading && <p className="text-center text-gray-500">Cargando clubes... ⏳</p>}
        {error && <p className="text-center text-red-500">{error} ❌</p>}

        {!loading && !error && clubesFiltrados.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
            <p className="text-gray-600 font-semibold mb-3">
              No encontramos clubes en <span className="text-primary font-bold">{departamentoSeleccionado}</span>
              {busqueda && ` que coincidan con "${busqueda}"`}.
            </p>
            <button
              type="button"
              onClick={() => {
                setDepartamentoSeleccionado('Todos');
                setBusqueda('');
              }}
              className="text-sm font-bold text-primary underline hover:text-secondary cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubesFiltrados.map((club) => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;