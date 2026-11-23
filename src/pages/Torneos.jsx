import { useState, useMemo } from 'react';
import useFetch from '../hooks/useFetch';
import TorneoCard from '../components/torneo/TorneoCard';
import { DEPARTAMENTOS_CATAMARCA } from '../constants/departamentos';

function Torneos() {
  // Consumo tanto los torneos como los clubes desde mi API propia usando mi custom hook useFetch
  const { data: torneos, loading, error } = useFetch('/torneos');
  const { data: clubes } = useFetch('/clubes');

  // Estados para controlar la pestaña temporal activa ('proximos' | 'activos' | 'pasados') y los filtros combinados
  const [tabTemporal, setTabTemporal] = useState('proximos');
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('Todos');
  const [clubFiltro, setClubFiltro] = useState('Todos');

  // Construyo dinámicamente y ordeno alfabéticamente el listado único de clubes reales para poblar el selector
  const clubesDisponibles = useMemo(() => {
    const nombres = new Set();

    if (Array.isArray(clubes)) {
      clubes.forEach((c) => {
        if (c.nombre) nombres.add(c.nombre.trim());
      });
    }

    if (Array.isArray(torneos)) {
      torneos.forEach((t) => {
        if (typeof t.club === 'string' && t.club.trim()) nombres.add(t.club.trim());
        if (t.club?.nombre) nombres.add(t.club.nombre.trim());
        if (typeof t.sede === 'string' && t.sede.trim()) nombres.add(t.sede.trim());
        if (Array.isArray(t.clubes)) {
          t.clubes.forEach((c) => {
            const nom = typeof c === 'string' ? c : c?.nombre;
            if (nom) nombres.add(nom.trim());
          });
        }
      });
    }

    return Array.from(nombres).sort((a, b) => a.localeCompare(b));
  }, [clubes, torneos]);

  // Filtro los torneos por pestaña temporal, texto, categoría, departamento y club, y los ordeno cronológicamente
  const torneosFiltrados = useMemo(() => {
    if (!torneos) return [];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return torneos
      .filter((t) => {
        const inicio = new Date(t.fechaInicio);
        const fin = t.fechaFin ? new Date(t.fechaFin) : inicio;
        inicio.setHours(0, 0, 0, 0);
        fin.setHours(23, 59, 59, 999);

        // Separo automáticamente entre próximos, en curso y finalizados comparando contra la fecha actual
        if (tabTemporal === 'proximos' && (inicio <= hoy || t.estado === 'finalizado')) return false;
        if (tabTemporal === 'activos' && (hoy < inicio || hoy > fin || t.estado === 'finalizado')) return false;
        if (tabTemporal === 'pasados' && fin >= hoy && t.estado !== 'finalizado') return false;

        // Filtro por coincidencia de texto en el nombre
        const termino = busqueda.toLowerCase().trim();
        const coincideTexto = !termino || t.nombre.toLowerCase().includes(termino);

        // Filtro por categoría habilitada
        const coincideCategoria =
          categoriaFiltro === 'Todas' ||
          (Array.isArray(t.categorias) && t.categorias.includes(categoriaFiltro));

        // Normalizo los nombres de las sedes del torneo para evaluar tanto el club como el departamento
        const textoSede = [
          typeof t.club === 'string' ? t.club : t.club?.nombre,
          t.sede,
          ...(Array.isArray(t.clubes) ? t.clubes.map((c) => (typeof c === 'string' ? c : c?.nombre)) : [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        // Filtro por club sede
        const coincideClub =
          clubFiltro === 'Todos' || textoSede.includes(clubFiltro.toLowerCase());

        // Filtro por departamento (uso el departamento directo si existe o lo deduzco cruzando con el listado de clubes)
        let coincideDpto = departamentoFiltro === 'Todos';
        if (!coincideDpto) {
          const dptoDirecto = t.departamento || t.club?.departamento;
          if (dptoDirecto) {
            coincideDpto = dptoDirecto === departamentoFiltro;
          } else if (Array.isArray(clubes)) {
            coincideDpto = clubes.some(
              (c) =>
                (c.departamento || 'Capital') === departamentoFiltro &&
                c.nombre &&
                textoSede.includes(c.nombre.toLowerCase())
            );
          }
        }

        return coincideTexto && coincideCategoria && coincideClub && coincideDpto;
      })
      .sort((a, b) =>
        tabTemporal === 'pasados'
          ? new Date(b.fechaInicio) - new Date(a.fechaInicio)
          : new Date(a.fechaInicio) - new Date(b.fechaInicio)
      );
  }, [torneos, clubes, tabTemporal, busqueda, categoriaFiltro, departamentoFiltro, clubFiltro]);

  // Agrupo los torneos ya filtrados por "Mes Año" usando reduce para renderizar encabezados separadores entre meses
  const torneosPorMes = useMemo(() => {
    return torneosFiltrados.reduce((grupos, torneo) => {
      const fecha = new Date(torneo.fechaInicio);
      const mesAnio = fecha.toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric'
      });
      const etiqueta = mesAnio.charAt(0).toUpperCase() + mesAnio.slice(1);

      if (!grupos[etiqueta]) grupos[etiqueta] = [];
      grupos[etiqueta].push(torneo);
      return grupos;
    }, {});
  }, [torneosFiltrados]);

  // Restablezco todos los filtros simultáneamente cuando el usuario hace clic en limpiar
  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoriaFiltro('Todas');
    setDepartamentoFiltro('Todos');
    setClubFiltro('Todos');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* ENCABEZADO DE LA SECCIÓN */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-primary mb-2">Torneos de Pádel</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Descubrí todos los torneos disponibles en Catamarca, filtrá por categoría, departamento o club y agendá tus fechas.
        </p>
      </div>

      {/* PANEL DE BÚSQUEDA Y FILTROS EN 3 COLUMNAS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 space-y-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="🔍 Buscar torneo por nombre..."
          className="w-full border border-gray-300 px-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-secondary outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="Todas">🎾 Todas las categorías</option>
            {['1ra', '2da', '3ra', '4ta', '5ta', '6ta', '7ma', '8va', 'Damas', 'Mixto'].map((cat) => (
              <option key={cat} value={cat}>
                Categoría {cat}
              </option>
            ))}
          </select>

          <select
            value={departamentoFiltro}
            onChange={(e) => setDepartamentoFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="Todos">📍 Todos los dptos.</option>
            {DEPARTAMENTOS_CATAMARCA.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>

          <select
            value={clubFiltro}
            onChange={(e) => setClubFiltro(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="Todos">🏟️ Todos los clubes</option>
            {clubesDisponibles.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PESTAÑAS TEMPORALES: PRÓXIMOS / EN CURSO / FINALIZADOS */}
      <div className="grid grid-cols-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 mb-10">
        {[
          { id: 'proximos', label: '📅 Próximos' },
          { id: 'activos', label: '🏆 En Curso' },
          { id: 'pasados', label: '📦 Finalizados' }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTabTemporal(item.id)}
            className={`py-2.5 px-3 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
              tabTemporal === item.id
                ? 'bg-primary text-secondary shadow'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ESTADOS DE CARGA Y ERROR */}
      {loading && <p className="text-center text-gray-500 py-10">Cargando torneos... ⏳</p>}
      {error && <p className="text-center text-red-500 py-10">{error} ❌</p>}

      {/* ESTADO VACÍO CUANDO NINGÚN TORNEO COINCIDE CON LOS FILTROS */}
      {!loading && !error && Object.keys(torneosPorMes).length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-600 font-semibold mb-3">
            No hay torneos en esta sección con los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={limpiarFiltros}
            className="text-sm font-bold text-primary underline hover:text-secondary cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* LISTADO AGRUPADO POR MES CON SEPARADOR VISUAL */}
      <div className="space-y-12">
        {Object.entries(torneosPorMes).map(([mesAnio, listaTorneos]) => (
          <section key={mesAnio}>
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-secondary text-primary text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                📅 {mesAnio}
              </span>
              <div className="h-px bg-gray-300 flex-grow" />
              <span className="text-xs font-bold text-gray-500">
                {listaTorneos.length} {listaTorneos.length === 1 ? 'torneo' : 'torneos'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listaTorneos.map((torneo) => (
                <TorneoCard key={torneo._id} torneo={torneo} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default Torneos;