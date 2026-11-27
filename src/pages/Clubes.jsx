import { useState, useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import ClubCard from '../components/cards/ClubCard';
import { DEPARTAMENTOS_CATAMARCA } from '../constants/departamentos';

function Clubes() {
  const { data: clubes, loading, error } = useFetch('/clubes');
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

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

  const clubesFiltrados = clubes
    ? clubes.filter((club) => {
        const dptoClub = club.departamento || 'Capital';
        const coincideDpto = departamentoSeleccionado === 'Todos' || dptoClub === departamentoSeleccionado;
        const termino = busqueda.toLowerCase().trim();
        const coincideTexto = !termino || club.nombre.toLowerCase().includes(termino) || club.direccion.toLowerCase().includes(termino);
        return coincideDpto && coincideTexto;
      }).sort((a, b) => Number(Boolean(b.esSponsor)) - Number(Boolean(a.esSponsor)))
    : [];

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4">
      
      {/* Cabecera */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-1 md:mb-2 text-center md:text-left">
          Directorio de Clubes
        </h1>
        <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
          Encontrá canchas y complejos en toda la provincia de Catamarca.
        </p>
      </div>

      {/* SECCIÓN DE FILTROS (Corregida para Mobile) */}
      <div className="flex flex-col gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Buscador - Ancho completo en todas las pantallas */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Buscar</label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej: Cancha, dirección..."
            className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg text-sm focus:ring-2 focus:ring-secondary outline-none"
          />
        </div>

        {/* Selector - Ancho completo en mobile, lado a lado en desktop */}
        <div className="w-full">
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Departamento</label>
          <select
            value={departamentoSeleccionado}
            onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
            className="w-full border border-gray-300 bg-white px-4 py-3 rounded-lg text-sm font-semibold text-primary focus:ring-2 focus:ring-secondary outline-none"
          >
            <option value="Todos">Todos los departamentos</option>
            {DEPARTAMENTOS_CATAMARCA.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Píldoras de departamentos (Se adaptan al ancho) */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
        {departamentosConClubes.map((dep) => (
          <button
            key={dep}
            type="button"
            onClick={() => setDepartamentoSeleccionado(dep)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              departamentoSeleccionado === dep
                ? 'bg-primary text-secondary shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'
            }`}
          >
            {dep}
          </button>
        ))}
      </div>

      {/* Barra de resumen (Contador) */}
      {!loading && !error && clubes && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-6 pb-3 border-b border-gray-200">
          <p className="text-sm text-gray-600 font-medium">
            {departamentoSeleccionado === 'Todos' ? (
              <>Mostrando <span className="font-black text-primary">{clubesFiltrados.length}</span> clubes en toda la provincia</>
            ) : (
              <>📍 <span className="font-bold text-primary">{departamentoSeleccionado}</span> — <span className="font-black text-primary bg-secondary px-2.5 py-0.5 rounded-full text-xs">{clubesFiltrados.length} clubes</span></>
            )}
          </p>

          {(departamentoSeleccionado !== 'Todos' || busqueda.trim() !== '') && (
            <button
              type="button"
              onClick={() => { setDepartamentoSeleccionado('Todos'); setBusqueda(''); }}
              className="text-xs font-bold text-primary hover:text-secondary underline cursor-pointer"
            >
              Limpiar filtros ✕
            </button>
          )}
        </div>
      )}

      {/* Carga / Error / Empty State */}
      {loading && <p className="text-center text-gray-500 py-10">Cargando clubes... ⏳</p>}
      {error && <p className="text-center text-red-500 py-10">{error} ❌</p>}
      {!loading && !error && clubesFiltrados.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
          <p className="text-gray-600 font-semibold mb-3">No encontramos clubes con esos filtros.</p>
          <button type="button" onClick={() => { setDepartamentoSeleccionado('Todos'); setBusqueda(''); }} className="text-sm font-bold text-primary underline hover:text-secondary">
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grilla de Clubes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubesFiltrados.map((club) => (
          <ClubCard key={club._id} club={club} />
        ))}
      </div>
    </div>
  );
}

export default Clubes;