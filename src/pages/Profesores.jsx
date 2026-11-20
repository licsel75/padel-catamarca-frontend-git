import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import ProfesorCard from '../components/cards/ProfesorCard';

function Profesores() {
  // Reutilizo mi custom hook useFetch para consultar el listado público de profesores activos
  const { data: profesores, loading, error } = useFetch('/profesores');
  const [busqueda, setBusqueda] = useState('');

  // Filtro en tiempo real por nombre del profesor, estudios, club o nivel
  const profesoresFiltrados = profesores
    ? profesores.filter((p) => {
        const termino = busqueda.toLowerCase().trim();
        if (!termino) return true;

        const nombre = p.usuario?.nombre?.toLowerCase() || '';
        const titulo = p.titulo?.toLowerCase() || '';
        const estudios = p.estudios?.toLowerCase() || '';
        const clubes = p.clubes?.map((c) => c.nombre.toLowerCase()).join(' ') || '';

        return (
          nombre.includes(termino) ||
          titulo.includes(termino) ||
          estudios.includes(termino) ||
          clubes.includes(termino)
        );
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary text-center md:text-left">
            Profesores y Clases
          </h1>
          <p className="text-sm text-gray-500 text-center md:text-left mt-1">
            Entrená y mejorá tu juego con profesores de toda la provincia
          </p>
        </div>

        {/* Buscador rápido */}
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar profe, club o certificación..."
          className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm focus:ring-2 focus:ring-secondary outline-none w-full md:w-72"
        />
      </div>

      {loading && <p className="text-center text-gray-500">Cargando profesores... ⏳</p>}
      {error && <p className="text-center text-red-500">{error} ❌</p>}

      {!loading && !error && profesoresFiltrados.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
          <p className="text-gray-600 font-semibold">
            No hay profesores publicados que coincidan con tu búsqueda.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profesoresFiltrados.map((perfil) => (
          <ProfesorCard key={perfil._id} perfil={perfil} />
        ))}
      </div>
    </div>
  );
}

export default Profesores;