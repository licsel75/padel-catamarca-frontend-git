import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
// Importo las funciones desde mi servicio dedicado para mantener la vista desacoplada de la API externa
import { obtenerPronosticoTorneo, interpretarCodigoClima } from '../services/climaService';

function TorneoDetalle() {
  // Capturo el parámetro dinámico ":id" de la URL para saber qué torneo consultar en la base de datos
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principales para los datos del torneo y el control de carga/errores
  const [torneo, setTorneo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para controlar si el usuario logueado ya guardó este torneo en su agenda
  const [esFavorito, setEsFavorito] = useState(false);
  const [cargandoFav, setCargandoFav] = useState(false);

  // Estados independientes para el pronóstico del clima, así la pantalla principal no se frena si demora el clima
  const [climaData, setClimaData] = useState(null);
  const [loadingClima, setLoadingClima] = useState(true);

  useEffect(() => {
    const cargarTodo = async () => {
      setLoading(true);
      try {
        // 1. Pido los datos completos del torneo a mi Backend (incluye clubes y organizador populados)
        const resTorneo = await api.get(`/torneos/${id}`);
        const datosTorneo = resTorneo.data;
        setTorneo(datosTorneo);

        // 2. Si hay una sesión activa, consulto los favoritos del usuario para pintar el corazón como corresponde
        if (user) {
          try {
            const resFavs = await api.get('/favoritos');
            const yaGuardado = resFavs.data.some(
              (f) => (f.torneo?._id || f._id) === datosTorneo._id
            );
            setEsFavorito(yaGuardado);
          } catch {
            // Si falla la consulta de favoritos, no bloqueo el resto de la información del torneo
          }
        }

        // 3. Delego la consulta meteorológica a mi climaService pasándole las fechas del torneo
        setLoadingClima(true);
        try {
          const datosClima = await obtenerPronosticoTorneo(
            datosTorneo.fechaInicio,
            datosTorneo.fechaFin
          );
          setClimaData(datosClima);
        } catch {
          setClimaData(null);
        } finally {
          setLoadingClima(false);
        }

      } catch (err) {
        setError('No se pudo cargar la información del torneo.');
      } finally {
        setLoading(false);
      }
    };

    cargarTodo();
  }, [id, user]);

  // Manejador para agregar o quitar el torneo de la agenda personal del usuario
  const handleToggleFavorito = async () => {
    // Si es un visitante sin sesión, lo redirijo al Login en lugar de tirar un error 401
    if (!user) {
      navigate('/login');
      return;
    }

    setCargandoFav(true);
    try {
      // Uso un endpoint tipo "toggle" en mi Backend que crea o elimina el favorito en una sola petición
      const res = await api.post(`/favoritos/toggle/${torneo._id}`);
      setEsFavorito(res.data.agregado);
    } catch (err) {
      alert('No se pudo actualizar favoritos');
    } finally {
      setCargandoFav(false);
    }
  };

  // Renderizado condicional temprano mientras espero la respuesta del servidor
  if (loading) return <p className="text-center mt-16 text-gray-500">Cargando detalle del torneo... ⏳</p>;

  // Si el ID no existe o hubo un fallo de red, muestro un mensaje claro y un enlace de retorno
  if (error || !torneo) {
    return (
      <div className="text-center mt-16">
        <p className="text-red-500 font-bold mb-4">{error || 'Torneo no encontrado'}</p>
        <Link to="/torneos" className="text-primary underline font-semibold">
          ← Volver a Torneos
        </Link>
      </div>
    );
  }

  // Formateo las fechas ISO de MongoDB a un formato legible en español de Argentina
  const fechaInicioFmt = new Date(torneo.fechaInicio).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const fechaFinFmt = new Date(torneo.fechaFin).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <Link to="/torneos" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-6">
        ← Volver al listado de torneos
      </Link>

      {/* TARJETA PRINCIPAL DEL TORNEO */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="bg-primary text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-secondary text-primary text-xs font-black px-3 py-1 rounded-full uppercase">
              {torneo.estado}
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-3">🏆 {torneo.nombre}</h1>
            <p className="text-gray-200 text-sm mt-2 capitalize">
              📅 Del {fechaInicioFmt} al {fechaFinFmt}
            </p>
          </div>

          {/* BOTÓN DE FAVORITOS CON ESTADO DINÁMICO */}
          <button
            onClick={handleToggleFavorito}
            disabled={cargandoFav}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md shrink-0 ${
              esFavorito
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-secondary text-primary hover:bg-lime-400'
            }`}
          >
            {cargandoFav
              ? 'Actualizando...'
              : esFavorito
              ? '❤️ Guardado en Mi Agenda'
              : '🤍 Guardar en Mi Agenda'}
          </button>
        </div>

        {/* GRILLA RESPONSIVA: 2 columnas para datos del torneo y 1 columna para el widget del clima */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMNA IZQUIERDA: CATEGORÍAS, PREMIACIÓN Y CLUBES SEDE */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-primary mb-2">Categorías habilitadas</h2>
              <div className="flex flex-wrap gap-2">
                {torneo.categorias && torneo.categorias.length > 0 ? (
                  torneo.categorias.map((cat) => (
                    <span key={cat} className="bg-surface border border-gray-200 text-primary font-bold px-4 py-1.5 rounded-lg text-sm">
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">A confirmar</span>
                )}
              </div>
            </div>

            {torneo.premio && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <span className="text-xs font-bold uppercase text-amber-700 block">Premiación</span>
                <p className="text-lg font-extrabold text-amber-900 mt-1">🥇 {torneo.premio}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold text-primary mb-3">Clubes Sede</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {torneo.clubes && torneo.clubes.map((club) => (
                  <div key={club._id} className="border border-gray-200 rounded-xl p-4 bg-surface">
                    <h3 className="font-bold text-primary text-base">🏟️ {club.nombre}</h3>
                    <p className="text-sm text-gray-600 mt-1">📍 {club.direccion}</p>
                    {club.telefono && (
                      <p className="text-sm text-gray-600 mt-1">📞 {club.telefono}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {torneo.usuario && (
              <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Organizado por: <span className="font-bold text-gray-700">{torneo.usuario.nombre}</span> ({torneo.usuario.email})
              </p>
            )}
          </div>

          {/* COLUMNA DERECHA: WIDGET DEL CLIMA ALIMENTADO POR MI SERVICIO EXTERNO */}
          <div className="bg-gradient-to-br from-blue-900 to-primary text-white rounded-2xl p-6 flex flex-col justify-between shadow-inner">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Clima en Catamarca</h2>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Open-Meteo API</span>
              </div>

              {loadingClima ? (
                <p className="text-sm text-gray-200">Consultando satélite meteorológico... ⛅</p>
              ) : !climaData ? (
                <p className="text-sm text-gray-200">No se pudo obtener el pronóstico en este momento.</p>
              ) : climaData.diasTorneo.length > 0 ? (
                /* ESCENARIO A: El torneo cae dentro de los próximos 16 días -> Muestro el pronóstico exacto */
                <div className="space-y-3">
                  <p className="text-xs text-lime-300 font-semibold uppercase">
                    Pronóstico para los días del torneo:
                  </p>
                  {climaData.diasTorneo.map((dia) => {
                    const info = interpretarCodigoClima(dia.code);
                    return (
                      <div key={dia.fecha} className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold capitalize">
                            {/* Agrego T12:00:00 para evitar que la zona horaria reste un día al convertir a Date */}
                            {new Date(dia.fecha + 'T12:00:00').toLocaleDateString('es-AR', {
                              weekday: 'short', day: 'numeric', month: 'short'
                            })}
                          </p>
                          <p className="text-xs text-gray-200">{info.texto} • 💧 {dia.lluvia}%</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl">{info.icono}</span>
                          <p className="text-xs font-bold">
                            {dia.max}° / <span className="text-gray-300">{dia.min}°</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* ESCENARIO B: Faltan más de 16 días -> Muestro temperatura actual + aviso informativo */
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <span className="text-4xl block mb-1">
                      {interpretarCodigoClima(climaData.actual?.weather_code).icono}
                    </span>
                    <p className="text-3xl font-black">
                      {Math.round(climaData.actual?.temperature_2m)}°C
                    </p>
                    <p className="text-xs text-gray-200 mt-1">
                      Ahora en S.F.V. de Catamarca ({interpretarCodigoClima(climaData.actual?.weather_code).texto})
                    </p>
                  </div>
                  <p className="text-xs text-gray-200 bg-black/20 p-3 rounded-lg leading-relaxed">
                    ℹ️ El pronóstico detallado día por día para este torneo estará disponible automáticamente 15 días antes de su inicio.
                  </p>
                </div>
              )}
            </div>

            <p className="text-[11px] text-gray-300 mt-6 pt-3 border-t border-white/10">
              Ideal para planificar si se juega en canchas descubiertas o techadas.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TorneoDetalle;