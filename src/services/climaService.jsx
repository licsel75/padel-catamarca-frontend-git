// Defino las coordenadas de San Fernando del Valle de Catamarca como constantes
// para no tener "números mágicos" sueltos dentro de la URL de la API.
const LATITUD_CATAMARCA = -28.4696;
const LONGITUD_CATAMARCA = -65.7852;

// Traduzco los códigos meteorológicos estándar (WMO) que devuelve Open-Meteo
// a un objeto con texto en español y un ícono visual para mostrar en la interfaz.
export const interpretarCodigoClima = (code) => {
  if (code === 0) return { texto: 'Despejado', icono: '☀️' };
  if ([1, 2, 3].includes(code)) return { texto: 'Parcialmente nublado', icono: '⛅' };
  if ([45, 48].includes(code)) return { texto: 'Neblina', icono: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { texto: 'Lluvias', icono: '🌧️' };
  if ([95, 96, 99].includes(code)) return { texto: 'Tormenta eléctrica', icono: '⛈️' };
  return { texto: 'Nublado', icono: '☁️' };
};

// Encapsulo la consulta a la API externa de Open-Meteo en este servicio.
// De esta forma, mis componentes de React solo reciben los datos ya procesados y limpios.
export const obtenerPronosticoTorneo = async (fechaInicioISO, fechaFinISO) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUD_CATAMARCA}&longitude=${LONGITUD_CATAMARCA}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FArgentina%2FCatamarca&forecast_days=16`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('No se pudo conectar con el servicio meteorológico');
  }

  const data = await response.json();

  // Extraigo solo la parte YYYY-MM-DD de las fechas ISO para compararlas sin problemas de zona horaria
  const fechaInicioStr = fechaInicioISO.split('T')[0];
  const fechaFinStr = fechaFinISO.split('T')[0];

  const pronosticoTorneo = [];

  // Open-Meteo entrega un pronóstico extendido de hasta 16 días.
  // Filtro únicamente los días que coinciden con el rango en el que se juega el torneo.
  if (data.daily && data.daily.time) {
    data.daily.time.forEach((dia, idx) => {
      if (dia >= fechaInicioStr && dia <= fechaFinStr) {
        pronosticoTorneo.push({
          fecha: dia,
          max: Math.round(data.daily.temperature_2m_max[idx]),
          min: Math.round(data.daily.temperature_2m_min[idx]),
          lluvia: data.daily.precipitation_probability_max[idx],
          code: data.daily.weather_code[idx]
        });
      }
    });
  }

  // Devuelvo tanto el clima actual como el array de días del torneo (vacío si falta más de 16 días)
  return {
    actual: data.current,
    diasTorneo: pronosticoTorneo
  };
};