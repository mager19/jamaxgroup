// THROWAWAY SPIKE — mirrors the future promos.json shape.
// Only "san-andres" and "santa-marta" use real flyer data; the rest are sample values.
const SITE = {
  brand: "JamaxTravel",
  whatsapp: "573000000000", // placeholder number
  operator: "Start Travel Mayorista",
  rnt: "RNT MDE 6497 y 202317",
};

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const PROMOS = [
  {
    slug: "san-andres",
    title: "San Andrés: mar de siete colores",
    destination: "San Andrés, Colombia",
    origin: "Salida desde Medellín",
    nights: 3,
    category: "Nacional",
    badge: "Últimos cupos",
    priceFrom: 1499000,
    priceNote: "por persona en acomodación doble",
    departure: "29 oct – 01 nov",
    season: "Puente festivo de noviembre",
    hotel: "Hotel Portofino · Plan PA",
    images: ["photo-1592782985575-a96c6e647155", "photo-1715559501246-ffe8df3a8a5f", "photo-1700188223446-883d92810f38", "photo-1578600925345-fb0341f25289", "photo-1576540506067-67f451064d84"],
    summary: "Tres noches frente al Caribe colombiano con tiquete aéreo, alojamiento y alimentación incluidos. Ideal para el puente festivo.",
    includes: ["Tiquete aéreo ida y regreso", "Maleta de bodega de 23 kg", "3 noches de alojamiento", "Desayuno, almuerzo y cena (Plan PA)", "Asistencia médica", "Impuestos hoteleros"],
    excludes: ["Traslados y almuerzo el día de viaje", "Tarjeta de turismo (aprox. $136.000)", "Gastos no especificados"],
  },
  {
    slug: "santa-marta",
    title: "Santa Marta: sierra y mar",
    destination: "Santa Marta, Colombia",
    origin: "Salida desde Medellín",
    nights: 3,
    category: "Nacional",
    badge: "Últimos cupos",
    priceFrom: 929000,
    priceNote: "por persona en acomodación doble",
    departure: "29 oct – 01 nov",
    season: "Puente festivo de noviembre",
    hotel: "Hotel San Francisco · Plan PAM",
    images: ["photo-1649509906219-2f7ce71e938f", "photo-1604343403128-932fdf2a395b", "photo-1549027184-939b3b809970", "photo-1612869443604-7c3ad22bede4", "photo-1549025227-2fd0b499aaae"],
    summary: "Escápate al Caribe con la Sierra Nevada de fondo: tiquete, hotel y alimentación para un fin de semana largo.",
    includes: ["Tiquete aéreo ida y regreso", "3 noches de alojamiento", "Desayuno y cena (Plan PAM)", "Asistencia médica"],
    excludes: ["Traslados", "Tours no especificados"],
  },
  {
    slug: "punta-cana",
    title: "Punta Cana todo incluido",
    destination: "Punta Cana, Rep. Dominicana",
    origin: "Salida desde Bogotá",
    nights: 5,
    category: "Caribe",
    badge: "Hot Sale",
    priceFrom: 4290000,
    priceNote: "por persona en acomodación doble",
    departure: "Salidas garantizadas",
    season: "Temporada de fin de año",
    hotel: "Resort RIU · Todo incluido",
    images: ["photo-1569700946659-fe1941c71fe4", "photo-1705507972578-78537a2dda73", "photo-1732153598980-a84667c256e7", "photo-1637576305711-23d3b0f72881", "photo-1569700946659-fe1941c71fe4"],
    summary: "Playas de arena blanca y resort todo incluido. Te ayudamos a escoger el hotel según tu plan.",
    includes: ["Tiquete aéreo", "Traslados aeropuerto – hotel", "5 noches todo incluido", "Asistencia médica"],
    excludes: ["Excursiones opcionales", "Propinas"],
  },
  {
    slug: "cancun",
    title: "Caribe Mexicano salida garantizada",
    destination: "Cancún, México",
    origin: "Salida desde Bogotá",
    nights: 4,
    category: "Caribe",
    badge: "Salida garantizada",
    priceFrom: 3890000,
    priceNote: "por persona en acomodación doble",
    departure: "12 – 16 ago",
    season: "Vacaciones de mitad de año",
    hotel: "Varios hoteles · Todo incluido",
    images: ["photo-1630252421399-ddde79af47b3", "photo-1630252452598-56d592ceec50", "photo-1510097467424-192d713fd8b2", "photo-1568402102990-bc541580b59f", "photo-1630252421399-ddde79af47b3"],
    summary: "Cancún y Riviera Maya con varias opciones de hotel. Tú eliges el estilo y nosotros cotizamos.",
    includes: ["Tiquete aéreo", "Traslados", "4 noches todo incluido", "Asistencia médica"],
    excludes: ["Tours a Xcaret o Chichén Itzá", "Impuestos de salida"],
  },
  {
    slug: "rio",
    title: "Fin de año en Río de Janeiro",
    destination: "Río de Janeiro, Brasil",
    origin: "Salida desde Bogotá",
    nights: 6,
    category: "Suramérica",
    badge: "Fin de año",
    priceFrom: 5150000,
    priceNote: "por persona en acomodación doble",
    departure: "28 dic – 03 ene",
    season: "Fin de año",
    hotel: "Hotel en Copacabana · Desayuno",
    images: ["photo-1483729558449-99ef09a8c325", "photo-1518639192441-8fce0a366e2e", "photo-1516306580123-e6e52b1b7b5f", "photo-1626568941852-70bc179e493e", "photo-1483729558449-99ef09a8c325"],
    summary: "Recibe el año nuevo vestido de blanco en Copacabana, con Cristo Redentor y Pan de Azúcar en el itinerario.",
    includes: ["Tiquete aéreo", "Traslados", "6 noches con desayuno", "City tour"],
    excludes: ["Cena de fin de año", "Gastos personales"],
  },
  {
    slug: "argentina-2027",
    title: "Argentina 2027",
    destination: "Buenos Aires y Patagonia",
    origin: "Salida desde Bogotá",
    nights: 7,
    category: "Suramérica",
    badge: "Salida garantizada",
    priceFrom: 6490000,
    priceNote: "por persona en acomodación doble",
    departure: "20 – 27 jun 2027",
    season: "Mitad de año 2027",
    hotel: "Hoteles 4★ · Desayuno",
    images: ["photo-1558517286-8a9cb0b8c793", "photo-1637580980556-085dee659c7e", "photo-1546569397-ab326af881f5", "photo-1557543878-042c9857f39e", "photo-1558517286-8a9cb0b8c793"],
    summary: "Tango en Buenos Aires y glaciares en la Patagonia en un solo viaje con salida garantizada.",
    includes: ["Tiquetes aéreos", "7 noches con desayuno", "Excursiones principales", "Asistencia médica"],
    excludes: ["Almuerzos y cenas", "Propinas"],
  },
  {
    slug: "panama",
    title: "Ofertazo Panamá",
    destination: "Ciudad de Panamá",
    origin: "Salida desde Medellín",
    nights: 3,
    category: "Centroamérica",
    badge: "Ofertazo",
    priceFrom: 1790000,
    priceNote: "por persona en acomodación doble",
    departure: "Salidas semanales",
    season: "Todo el año",
    hotel: "Hotel céntrico · Desayuno",
    images: ["photo-1632505702897-cc41b0ba3b64", "photo-1524544187526-2b2855b65f16", "photo-1668294633496-c8b9baae35c3", "photo-1639935187474-10940c5be350", "photo-1632505702897-cc41b0ba3b64"],
    summary: "Compras, Canal de Panamá y Casco Antiguo en una escapada corta.",
    includes: ["Tiquete aéreo", "3 noches con desayuno", "Visita al Canal"],
    excludes: ["Traslados", "Gastos personales"],
  },
  {
    slug: "dia-de-muertos",
    title: "Día de Muertos en México",
    destination: "Ciudad de México",
    origin: "Salida desde Bogotá",
    nights: 5,
    category: "Temporada",
    badge: "Temporada",
    priceFrom: 3350000,
    priceNote: "por persona en acomodación doble",
    departure: "30 oct – 04 nov",
    season: "Día de Muertos",
    hotel: "Hotel en Centro Histórico",
    images: ["photo-1585464231875-d9ef1f5ad396", "photo-1547686669-9a8cb1a22d91", "photo-1682916114863-ba2f7b7d39c9", "photo-1580934738416-ad531f2920f7", "photo-1585464231875-d9ef1f5ad396"],
    summary: "Vive la tradición más colorida de México: altares, desfiles y gastronomía en la capital.",
    includes: ["Tiquete aéreo", "5 noches con desayuno", "City tour"],
    excludes: ["Excursiones a Teotihuacán", "Almuerzos y cenas"],
  },
];

const fmtCOP = (n) => "$" + n.toLocaleString("es-CO");

const waLink = (promo) => {
  const msg = promo
    ? `Hola JamaxTravel, quiero cotizar la promo "${promo.title}" (${promo.departure}).`
    : "Hola JamaxTravel, quiero asesoría gratuita para mi próximo viaje.";
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
};

const cardHTML = (p) => `
  <a class="card" href="promo.html?slug=${p.slug}">
    <div class="card-media">
      <img src="${img(p.images[0], 800)}" alt="${p.destination}" loading="lazy">
      <span class="chip chip-left">${p.nights} noches</span>
      <span class="chip chip-right">${p.badge}</span>
    </div>
    <div class="card-body">
      <h3>${p.title}</h3>
      <p class="dest-line">${p.destination}</p>
      <div class="price-box">
        <div><span class="from">Desde</span><span class="price">${fmtCOP(p.priceFrom)} <small>COP</small></span></div>
        <div class="season">Salida sugerida<b>${p.departure}</b></div>
      </div>
    </div>
  </a>`;

const WA_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>`;

const LOGO = `<span class="mark">✈</span>Jamax<em>Travel</em>`;

const headerHTML = () => `
  <div class="announce">🔥 Últimos cupos para San Andrés y Santa Marta en el puente de noviembre <a href="promo.html?slug=san-andres">Ver promo →</a></div>
  <div class="nav-shell">
    <header class="nav">
      <a class="logo" href="index.html">${LOGO}</a>
      <nav class="nav-links">
        <a href="index.html#promos">Promos</a>
        <a href="index.html#como-funciona">Cómo funciona</a>
        <a href="index.html#destinos">Destinos</a>
      </nav>
      <a class="btn btn-ghost btn-ghost-sm" href="${waLink()}" target="_blank" rel="noopener">${WA_ICON} Asesor</a>
    </header>
  </div>`;

const footerHTML = () => `
  <footer class="footer">
    <div class="wrap footer-inner">
      <div>
        <a class="logo" href="index.html">${LOGO}</a>
        <p>Asesoría de viajes gratuita. Planes operados por ${SITE.operator} · ${SITE.rnt}.</p>
      </div>
      <div>
        <p>Tarifas de referencia sujetas a disponibilidad y cambios sin previo aviso.</p>
        <p>JamaxTravel actúa como intermediario comercial; la reserva y el pago se realizan con el operador.</p>
      </div>
    </div>
  </footer>
  <a class="wa-float" href="${waLink()}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">${WA_ICON}</a>`;
