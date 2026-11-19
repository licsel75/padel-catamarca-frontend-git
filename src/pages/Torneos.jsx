import useFetch from '../hooks/useFetch';
import TorneoCard from '../components/torneo/TorneoCard';

function Torneos() {
  const { data: torneos, loading, error } = useFetch('/torneos');

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-primary mb-8">Próximos Torneos</h1>

      {loading && <p className="text-center text-gray-500">Cargando torneos... ⏳</p>}
      {error && <p className="text-center text-red-500">{error} ❌</p>}

      {torneos && torneos.length === 0 && (
        <p className="text-center text-gray-500">No hay torneos programados por el momento.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {torneos && torneos.map(torneo => (
          <TorneoCard key={torneo._id} torneo={torneo} />
        ))}
      </div>
    </div>
  );
}
export default Torneos;