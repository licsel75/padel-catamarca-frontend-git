function Historia() {
  // Número de WhatsApp para recibir los aportes históricos
  const telefonoWhatsApp = '3834123456'; 
  const mensajeWhatsApp = encodeURIComponent(
    '¡Hola! Tengo información, fotos o recuerdos para aportar a la historia del pádel en Catamarca.'
  );
  const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${mensajeWhatsApp}`;

  // Array con los datos reales de los torneos históricos
  const registrosHistoricos = [
    {
      anio: "2006",
      torneo: "Masters As.Ca.Pa",
      categoria: "1ra Categoría",
      campeones: "Alfredo Cipolletti y Nicolás Grajales",
      subcampeones: "Claudio Díaz y Pablo Viale",
      marcador: "7-5, 6-3",
      sede: "El Fuerte Pádel"
    },
    {
      anio: "2007",
      torneo: "Temporada Oficial",
      categoria: "2da Categoría",
      campeones: "Alejandro Merep y Carlos Segura",
      subcampeones: "Daniel Hernández y Marcelo Tula",
      marcador: "6-1, 6-2",
      sede: "Luck Pádel y Las Rejas"
    },
    {
      anio: "2007",
      torneo: "Circuito Profesional",
      categoria: "Torneo Nacional",
      campeones: "Javier Escalante y Luis Soliverez",
      subcampeones: "Miguel y Daniel Codina",
      marcador: "Final Nacional",
      sede: "Club Red Star"
    },
    {
      anio: "2025",
      torneo: "20° Aniversario Open Pádel",
      categoria: "6ta Categoría",
      campeones: "Natalia Segura y Lucas Vera",
      subcampeones: "Participación destacada",
      marcador: "Aniversario",
      sede: "Open Pádel (La Chacarita)"
    }
  ];

  // Premios del Círculo de Periodistas Deportivos de Catamarca
  const premiosCpdc = [
    { anio: "2009", ganador: "Cristian Diamante y Nicolás Codigoni" },
    { anio: "2017", ganador: "Agustín Tapia" },
    { anio: "2021", ganador: "Facundo Sayes" },
    { anio: "2023", ganador: "Aaron Guevara" },
    { anio: "2024", ganador: "Mónica Cabrera" },
    { anio: "2025", ganador: "Marcelo / Saúl Castro" }
  ];

  return (
    <div id="seccion-historia" className="bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera de la sección */}
        <div className="text-center mb-12">
          <span className="text-secondary font-bold text-sm uppercase tracking-wider mb-2 block">
            Especial Histórico
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Historia del Pádel en Catamarca
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
            De las primeras canchas de cemento en los 90 al fenómeno mundial de Agustín Tapia. Una historia de clubes, familias, jugadores y dirigentes que hicieron crecer un deporte que hoy tiene a Catamarca en el mapa mundial.
          </p>
        </div>

        {/* Contenido en columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 mb-12">
          <div>
            <h3 className="text-xl font-bold text-primary mb-3">Los primeros años: el nacimiento de una pasión</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Para reconstruir los comienzos del pádel catamarqueño es necesario remontarse a la década de 1990, época en la que este deporte se expandía con fuerza por todo el país. Los primeros recuerdos ubican a clubes pioneros como <strong>Club Pelota Paleta</strong> y <strong>Handicap</strong> (hoy Handicap 4) como los espacios fundacionales.
            </p>
            <p className="text-sm leading-relaxed">
              A ellos se sumaron <strong>Efe Pádel</strong> y las primeras canchas en villas veraniegas como <strong>El Rodeo</strong> y <strong>Balcozna</strong>, puntos de encuentro ineludibles durante los veranos. Se jugaba en canchas de cemento con paredes tradicionales, en una dinámica principalmente recreativa y familiar que fue generando los primeros grupos de jugadores.
            </p>

            <h3 className="text-xl font-bold text-primary mb-3 mt-8">El crecimiento competitivo (2006-2008)</h3>
            <p className="text-sm leading-relaxed">
              Con el correr de los años, clubes como <strong>Luck Pádel</strong> y <strong>Las Rejas Tennis Club</strong> se consolidaron como sedes neurálgicas con torneos propios a los que se le sumaron <strong>El Fuerte Pádel</strong>, <strong>Open Pádel</strong> y <strong>City Pádel</strong>.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              La fundación de la <strong>Asociación Catamarqueña de Pádel (As.Ca.Pa)</strong> en 2006, impulsada por Pablo Viale, marcó un antes y un después. Ese año se organizaron los torneos Masters en <strong>El Fuerte Pádel</strong> y <strong>Ay Carmela!</strong>, con competencias desde Primera a Quinta categoría.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-3">El fenómeno Tapia y la proyección nacional</h3>
            <p className="mb-4 text-sm leading-relaxed">
              Si hay un nombre que transformó la relación de Catamarca con el pádel, es el de <strong>Agustín Tapia</strong>. Nacido en 1999, el "Pollito" dio sus primeros pasos en <strong>Open Pádel</strong> y a los 11 años ya conquistaba títulos nacionales en Buenos Aires.
            </p>
            <p className="text-sm leading-relaxed">
              Su ascenso al número uno del mundo generó una explosión de nuevos jugadores, escuelas formativas y una fuerte inversión privada en canchas de blindex. Esto, sumado a eventos internacionales como el APP Tour en 2013, puso a Catamarca en el centro de la escena nacional.
            </p>

            <h3 className="text-xl font-bold text-primary mb-3 mt-8">La federalización y el presente (2026)</h3>
            <p className="text-sm leading-relaxed">
              El crecimiento también llegó al interior. En 2023 se inauguró la primera cancha profesional en <strong>La Merced (Paclín)</strong> y en 2025 otra en <strong>Las Juntas (Ambato)</strong> con la presencia de Tapia. Hoy la provincia cuenta con una red de complejos modernos como Indian, Citi, Pádel One y IL Pádel, que conviven con los históricos.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Bajo la conducción de Juan Andrada en As.Ca.Pa, la entidad trabaja en la reorganización oficial, la formación de menores y la participación de delegaciones en torneos regionales, donde Catamarca sigue cosechando títulos.
            </p>
          </div>
        </div>

        {/* SECCIÓN: Salón de la Fama (Torneos) */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Salón de la Fama</h2>
            <div className="h-1 flex-grow bg-gray-200 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrosHistoricos.map((reg, index) => (
              <div key={index} className="bg-surface p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                    {reg.anio}
                  </span>
                  <span className="text-xs font-bold text-secondary uppercase">
                    {reg.sede}
                  </span>
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{reg.torneo}</h4>
                <p className="text-sm text-gray-500 mb-3">{reg.categoria}</p>
                
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">🏆 CAMPEONES</p>
                  <p className="text-sm font-bold text-primary">{reg.campeones}</p>
                  {reg.subcampeones !== "Participación destacada" && (
                    <>
                      <p className="text-xs text-gray-500 font-semibold mt-2 mb-1">🥈 SUBCAMPEONES</p>
                      <p className="text-sm text-gray-700">{reg.subcampeones}</p>
                    </>
                  )}
                  <p className="text-xs text-gray-400 mt-2 italic">{reg.marcador}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN: Distinciones CPDC */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Distinciones CPDC</h2>
            <div className="h-1 flex-grow bg-gray-200 rounded"></div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Reconocimientos entregados por el Círculo de Periodistas Deportivos de Catamarca en su Gala Anual del Deporte.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {premiosCpdc.map((premio, index) => (
              <div key={index} className="bg-surface p-4 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow">
                <span className="block text-xs font-bold text-secondary mb-1">{premio.anio}</span>
                <span className="block text-sm font-bold text-primary leading-tight">{premio.ganador}</span>
                <span className="block text-[10px] text-gray-400 mt-2 uppercase tracking-wide">Premio Pádel</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nota metodológica y Call to action */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-8 border-l-4 border-secondary pl-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-1">Nota Metodológica</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Esta reconstrucción histórica fue elaborada a partir de información disponible en la web, relatos y registros públicos recopilados. No existe un archivo digital oficial de la época fundacional, por lo que la información se presenta como un documento en construcción abierta a correcciones y aportes.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-primary mb-2">Archivo Abierto y Colaborativo</h3>
            <p className="text-gray-600 mb-6 text-sm max-w-2xl mx-auto">
              Si fuiste jugador, dueño o dirigente y tenés fotos o recuerdos de los clubes pioneros, tu testimonio es fundamental para completar este archivo.
            </p>
            
            <a
              href={urlWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#128C7E] transition-colors shadow-md"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar mi aporte por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historia;