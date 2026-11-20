import { useState } from 'react';
import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';
import ClubCard from '../components/cards/ClubCard';
import { DEPARTAMENTOS_CATAMARCA } from '../constants/departamentos';

function Home() {
  const { data: clubes, loading, error } = useFetch('/clubes');
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtramos los clubes por departamento y por texto (nombre o dirección)
  const clubesFiltrados = clubes
    ? clubes.filter((club) => {
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
    : [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Jugá, divertite, competí. <br />
          <span className="text-secondary">Subí de categoría.</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Toda la información del pádel Catamarqueño en un sólo lugar.
          Clubes, torneos, jugadores destacados y mucho más.
          Seleccioná tus torneos favoritos y armá tu agenda para todo el año.
        </p>

        <Link
          to="/torneos"
          className="bg-secondary text-primary text-lg font-bold px-8 py-3 rounded-lg hover:bg-lime-500 transition-colors"
        >
          Ver Torneos Disponibles
        </Link>
      </section>

      {/* Sección de Clubes */}
      <section className="max-w-6xl mx-auto py-16 px-4">
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
              <option value="Todos">📍 Todos los departamentos</option>
              {DEPARTAMENTOS_CATAMARCA.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PÍLDORAS RÁPIDAS DE DEPARTAMENTOS PRINCIPALES */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Todos', 'Capital', 'Valle Viejo', 'Fray Mamerto Esquiú', 'Andalgalá', 'Belén', 'La Paz (Recreo)'].map(
            (dep) => (
              <button
                key={dep}
                type="button"
                onClick={() => setDepartamentoSeleccionado(dep)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  departamentoSeleccionado === dep
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
                }`}
              >
                {dep === 'Todos' ? 'Todos' : dep}
              </button>
            )
          )}
        </div>

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
              className="text-sm font-bold text-primary underline hover:text-secondary"
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