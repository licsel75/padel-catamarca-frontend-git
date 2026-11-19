import { Link } from 'react-router';
import useFetch from '../hooks/useFetch';
import ClubCard from '../components/cards/ClubCard';

function Home() {
  // Pedimos los clubes al backend
  const { data: clubes, loading, error } = useFetch('/clubes');

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
       
        <Link to="/torneos" className="bg-secondary text-primary text-lg font-bold px-8 py-3 rounded-lg hover:bg-lime-500 transition-colors">
          Ver Torneos Disponibles
        </Link>
      </section>

      {/* Sección de Clubes */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-10">Nuestros Clubes</h2>

        {loading && <p className="text-center text-gray-500">Cargando clubes... ⏳</p>}
        {error && <p className="text-center text-red-500">{error} ❌</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubes && clubes.map(club => (
            <ClubCard key={club._id} club={club} />
          ))}
        </div>
      </section>
    </div>
  );
}
export default Home;