import { asset } from '$app/paths';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/public';
import type { ApexConfig, ApexText } from '../../../../sdk/core/src/apex/types.ts';
const t = (es: string, en: string): ApexText => ({ es, en });
const photos = (id: string) => Array.from({ length: 5 }, (_, i) => asset(`/assets/experiences/${id}-${i + 1}.webp`));

/** Business content lives here. The shared SDK is independent of the APEX catalog. */
export const apexConfig: ApexConfig = {
 brand: { name: 'APEX Experience', tagline: t('Siente la adrenalina.', 'Feel the adrenaline.'), logo: asset('/logo.svg'), background: asset('/assets/forest.webp') },
 contact: {
  phone: '+52 722 671 0947', whatsapp: '527226710947', instagram: 'https://www.instagram.com/experience.apex/',
  address: 'Bernardo Vara Manzana 016, Pilares, 52179 San Jerónimo Chicahualco, Méx.',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Bernardo%20Vara%2C%20Pilares%2C%20Metepec%2C%20Mexico',
  mapEmbed: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sBernardo+Vara,+Pilares,+Metepec,+Mexico!6i17',
 },
 destinations: [
  { id: 'cdmx', name: 'CDMX', description: t('Ciudad, cultura y aventura en sus alrededores.', 'City, culture and adventure in the surrounding region.'), image: asset('/assets/destinations/cdmx.webp'), gallery: [asset('/assets/destinations/editorial/cdmx-1.webp'),asset('/assets/destinations/editorial/cdmx-2.webp')], status: 'available', experienceIds: ['la-marquesa','vuelo-en-helicoptero','lucha-libre','gastronomia'] },
  { id: 'quintana-roo', name: 'Quintana Roo', description: t('El Caribe, un nuevo horizonte para APEX. Estamos trabajando en este destino.', 'The Caribbean, a new horizon for APEX. We are developing this destination.'), image: asset('/assets/destinations/quintana-roo.webp'), gallery: [asset('/assets/destinations/editorial/quintana-roo-1.webp'),asset('/assets/destinations/editorial/quintana-roo-2.webp')], status: 'coming-soon', experienceIds: [] },
  { id: 'hidalgo', name: 'Hidalgo', description: t('Paisajes que invitan a salir de lo cotidiano.', 'Landscapes that invite you beyond the everyday.'), image: asset('/assets/destinations/hidalgo.webp'), gallery: [asset('/assets/destinations/editorial/hidalgo-1.webp'),asset('/assets/destinations/editorial/hidalgo-2.webp')], status: 'coming-soon', experienceIds: [] },
  { id: 'jalisco', name: 'Jalisco', description: t('Tradición y energía para nuevas historias.', 'Tradition and energy for new stories.'), image: asset('/assets/destinations/jalisco.webp'), gallery: [asset('/assets/destinations/editorial/jalisco-1.webp'),asset('/assets/destinations/editorial/jalisco-2.webp')], status: 'coming-soon', experienceIds: [] },
  { id: 'baja-california', name: 'Baja California', description: t('Horizontes abiertos y una forma distinta de explorar.', 'Open horizons and a different way to explore.'), image: asset('/assets/destinations/baja-california.webp'), gallery: [asset('/assets/destinations/editorial/baja-california-1.webp'),asset('/assets/destinations/editorial/baja-california-2.webp')], status: 'coming-soon', experienceIds: [] },
  { id: 'oaxaca', name: 'Oaxaca', description: t('Cultura y paisajes que despiertan los sentidos.', 'Culture and landscapes that awaken the senses.'), image: asset('/assets/destinations/oaxaca.webp'), gallery: [asset('/assets/destinations/editorial/oaxaca-1.webp'),asset('/assets/destinations/editorial/oaxaca-2.webp')], status: 'coming-soon', experienceIds: [] },
 ],
 experiences: [
  { id: 'la-marquesa', destinationId: 'cdmx', title: t('La Marquesa','La Marquesa'), description: t('ATV, caballos y tirolesa en una salida privada con tu grupo.', 'ATVs, horseback riding and ziplining on a private outing with your group.'), image: asset('/assets/la-marquesa/portada-paisaje.jpg'), gallery: photos('la-marquesa'), status: 'available', kind: 'adventure', activities: [t('ATV','ATVs'),t('Paseo a caballo','Horseback riding'),t('Tirolesa','Ziplining')], location: t('Centro Recreativo El Valle del Potrero','El Valle del Potrero Recreation Center'), meeting: t('Valle del Potrero, La Marquesa, Estado de México. Inicio y recogida: 8:30 a. m., hora de Ciudad de México. Desde Santa Fe, calcula aproximadamente 40–60 minutos según el tráfico. El punto exacto se acuerda con APEX.', 'Valle del Potrero, La Marquesa, State of Mexico. Start and pickup: 8:30 a.m., Mexico City time. Allow approximately 40–60 minutes from Santa Fe, depending on traffic. The exact meeting point is agreed with APEX.') },
  { id: 'vuelo-en-helicoptero', destinationId: 'cdmx', title: t('Vuelo en helicóptero','Helicopter flight'), description: t('Descubre CDMX desde una nueva perspectiva con un vuelo en helicóptero. Comparte tu fecha y número de pasajeros para recibir una propuesta de APEX.', 'Discover Mexico City from a new perspective on a helicopter flight. Share your date and passenger count to receive an APEX proposal.'), image: asset('/assets/experiences/vuelo-en-helicoptero-1.webp'), gallery: photos('vuelo-en-helicoptero'), status: 'quote', kind: 'flight', activities: [t('Historia y arquitectura','History and architecture'),t('Paisajes naturales','Natural landscapes'),t('Paseo en helicóptero','Helicopter flight')], location: t('Punto de encuentro y traslados.','Meeting point and transfers.'), meeting: t('El helipuerto, la dirección, la aeronave, la duración, la ruta y los requisitos se confirman en tu propuesta. La oficina de APEX no es el punto de salida del vuelo. Traslados se cotizan por separado salvo inclusión expresa.', 'The helipad, address, aircraft, duration, route and requirements are confirmed in your proposal. The APEX office is not the flight departure point. Transfers are quoted separately unless expressly included.') },
  { id: 'lucha-libre', destinationId: 'cdmx', title: t('Lucha libre','Lucha libre'), description: t('La energía del ring y la cultura de la ciudad. Una experiencia que estamos preparando. Sin fechas ni reservas abiertas. Imágenes conceptuales generadas con IA.', 'The energy of the ring and the culture of the city. An experience in preparation. No dates or reservations open. AI-generated conceptual images.'), image: asset('/assets/experiences/lucha-libre-1.webp'), gallery: photos('lucha-libre'), status: 'coming-soon', kind: 'culture', activities: [], location: t('CDMX','Mexico City'), meeting: t('Próximamente.','Coming soon.') },
  { id: 'gastronomia', destinationId: 'cdmx', title: t('Experiencia gastronómica','Gastronomic experience'), description: t('Sabores e historias para explorar la ciudad desde su cocina. Propuesta en preparación. Sin fechas ni reservas abiertas. Imágenes conceptuales generadas con IA.', 'Flavors and stories to explore the city through its cuisine. In preparation. No dates or reservations open. AI-generated conceptual images.'), image: asset('/assets/experiences/gastronomia-1.webp'), gallery: photos('gastronomia'), status: 'coming-soon', kind: 'food', activities: [], location: t('CDMX','Mexico City'), meeting: t('Próximamente.','Coming soon.') },
 ],
 prices: { 2: 697.05, 3: 1176.98, 4: 1542.64, 5: 1908.30, 6: 2279.67 },
 copy: {
  about: t('Somos Apex Experience: una compañía de turismo de aventura que diseña encuentros con la naturaleza, atención personalizada y espacio para disfrutar a tu manera. La Marquesa es nuestra experiencia en operación: ATV, caballos y tirolesa para tu grupo. Antes de contratar, revisamos contigo fecha, logística, tarifa y condiciones; los demás destinos se identifican como próximos.', 'We are Apex Experience: an adventure travel company designing encounters with nature, personal attention and room to enjoy things your way. La Marquesa is our operating experience: ATVs, horseback riding and ziplining for your group. Before booking, we review the date, logistics, price and terms with you; other destinations are marked as coming soon.'),
  value1Title: t('Atención desde el primer contacto','Care from the first conversation'), value1: t('Escuchamos tus ideas y resolvemos tus dudas para que llegues a tu experiencia con un plan claro.','We listen to your ideas and answer your questions so you arrive with a clear plan.'),
  value2Title: t('Información antes de salir','Information before your outing'), value2: t('Atención al detalle: información previa sobre requisitos, uso del equipo y condiciones de participación.','Attention to detail: advance information on requirements, equipment use and participation conditions.'),
  value3Title: t('Acompañamiento acordado','Agreed guidance'), value3: t('Acompañamiento e indicaciones para vivir la aventura. Confirmamos contigo el servicio incluido en cada propuesta.','Guidance and instructions for your adventure. We confirm the included service with each proposal.'),
  value4Title: t('Propuestas para tu grupo','Proposals for your group'), value4: t('Tu grupo y tu propósito orientan el plan, siempre sujeto a las posibilidades de la ruta y la disponibilidad.','Your group and purpose shape the plan, subject to route possibilities and availability.'),
  private: t('Una escapada con amigos, una celebración o un momento especial. Coordinamos la propuesta alrededor de tu grupo y de lo que buscas vivir.','An escape with friends, a celebration or a special moment. We coordinate the proposal around your group and what you want to experience.'),
  corporate: t('Explora una propuesta de team building, convivencia o evento privado con APEX. Partimos del objetivo de tu encuentro para evaluar las opciones y su viabilidad.','Explore a team-building, group gathering or private-event proposal with APEX. We start with your goals to assess the options and their feasibility.'),
  future: t('Estamos trabajando en nuevas experiencias para este destino. Compartiremos los detalles cuando estén confirmados; todavía no hay reservas abiertas.','We are developing new experiences for this destination. Details will be shared when confirmed; reservations are not yet open.'),
  conceptual: t('Vistas conceptuales generadas con IA. No representan actividades incluidas.','AI-generated conceptual views. They do not represent included activities.'),
  inquiryDisclaimer: t('Revisa tu solicitud y continúa en WhatsApp para enviarla a APEX. Abrir la conversación no confirma disponibilidad ni reserva; tú decides cuándo enviar el mensaje.','Review your request and continue to WhatsApp to send it to APEX. Opening the conversation does not confirm availability or a booking; you choose when to send the message.'),
  priceDisclaimer: t('Importes totales por grupo, no por persona. Moneda de la tarifa: dólares estadounidenses (USD). APEX confirma el total, la moneda y el medio de pago en la cotización; aquí no se procesa un cobro.','Totals are per group, not per person. Published prices are in US dollars (USD). APEX confirms the total, currency and payment method in your quote; no payment is processed here.'),
  transport: t('Indica los puntos que necesitas. APEX confirma cobertura, costo y ubicación exacta en la cotización. La dirección de la oficina no es el punto de encuentro del tour.','Share the pickup and return locations you need. APEX confirms coverage, price and exact locations in your proposal. The office address is not the tour meeting point.'),
  clothing: t('Lleva pantalón largo, calzado cerrado con agarre y abrigo. Consulta con APEX los requisitos específicos de las actividades antes de contratar. Comparte cualquier necesidad de accesibilidad para revisar la viabilidad.','Wear long pants, closed shoes with grip and warm layers. Ask APEX about activity-specific requirements before booking. Share accessibility needs so feasibility can be reviewed.'),
  cancellation: t('Solicita las condiciones aplicables a tu fecha y revísalas antes de aceptar la cotización o realizar un pago. Una consulta, una fecha seleccionada o un mensaje preparado no confirman la reserva.','Request the terms for your date and review them before accepting a quote or paying. An inquiry, selected date or prepared message does not confirm a reservation.'),
  faqPlan: t('Explora la colección o cuéntanos tu idea. Revisamos tu fecha, grupo y preferencias para compartir una propuesta con alcance, tarifa y disponibilidad antes de contratar.','Explore the collection or tell us your idea. We review your date, group and preferences to share a proposal with scope, price and availability before booking.'),
  faqPrivate: t('Sí. La experiencia está pensada para tu grupo. La tarifa se ajusta al número de participantes, hasta seis. La disponibilidad se confirma al solicitar.','Yes. The experience is designed for your group. The price adjusts to the number of participants, up to six. Availability is confirmed after inquiry.'),
  faqCorporate: t('Comparte el objetivo, la fecha, el tamaño del grupo y tus necesidades de transporte. Evaluamos la viabilidad y acordamos el alcance en una cotización.','Share your goals, date, group size and transport needs. We assess feasibility and agree the scope in a quote.'),
  faqNews: t('El catálogo mostrará los nuevos destinos cuando se confirmen. Notificarme abre WhatsApp para que solicites información al equipo; no te inscribe automáticamente ni reserva un lugar.','The collection will show new destinations when confirmed. Notify me opens WhatsApp so you can request updates; it does not automatically subscribe you or book a place.'),
  faqIncluded: t('El programa reúne recorrido en ATV, paseo a caballo y tirolesa. La duración, el orden y los requisitos de participación se confirman antes de reservar.','The program combines ATV riding, horseback riding and ziplining. Duration, order and participation requirements are confirmed before booking.'),
  faqDays: t('La Marquesa opera de jueves a domingo. Consulta tu fecha con al menos 2 días de anticipación por WhatsApp; la selección del calendario no confirma disponibilidad. Para grupos grandes o eventos, solicita una propuesta a APEX.','La Marquesa operates Thursday–Sunday. Inquire at least 2 days ahead through WhatsApp; selecting a calendar date does not confirm availability. For larger groups or events, request a proposal.'),
  faqCelebration: t('Puedes solicitar atención para un cumpleaños, aniversario u otra ocasión. Confirmamos su viabilidad y cualquier costo adicional antes de que lo aceptes.','You can request arrangements for a birthday, anniversary or another occasion. Feasibility and additional costs are confirmed before you accept.'),
  faqPayment: t('La contratación se coordina con APEX por WhatsApp. El cobro comercial en línea aún no está habilitado. Confirma disponibilidad, condiciones y medio de pago con el equipo.','Booking is coordinated with APEX through WhatsApp. Commercial online payments are not enabled. Confirm availability, terms and payment arrangements with the team.'),
  faqWeather: t('APEX confirma contigo las condiciones de reprogramación y cancelación antes de tu salida. Consulta al equipo las condiciones aplicables a tu fecha.','APEX confirms rescheduling and cancellation conditions before your outing. Ask the team about the terms that apply to your date.'),
  flightDetails: t('El programa, la aeronave y los servicios se confirman en tu cotización. Las imágenes son de referencia.','The program, aircraft and services are confirmed in your quote. Images are references.'),
  flightRequirements: t('Solicita los requisitos de identificación, edades y límites de peso del operador antes de contratar. No hay restricciones numéricas publicadas hasta su validación.','Ask for operator identification, age and weight requirements before booking. Numeric restrictions have not been published pending validation.'),
  flightGallery: t('Galería de referencia: vistas aéreas de CDMX y cabina fotografiada en Río de Janeiro. No garantiza una aeronave ni un recorrido específico.','Reference gallery: aerial views of Mexico City and a cockpit photographed in Rio de Janeiro. It does not guarantee a specific aircraft or route.'),
  community: t('Momentos reales compartidos con APEX. Detrás de cada salida, personas que buscan conectar, disfrutar y salir de la rutina.','Real moments shared with APEX. Behind every outing are people seeking connection, enjoyment and a break from routine.'),
  footer: t('Experiencias para salir de la rutina y volver con una historia.','Experiences that take you out of your routine and give you a story to tell.'),
  meetingDisclaimer: t('El punto de encuentro del tour se confirma al reservar.','The tour meeting point is confirmed when booking.'),
  accountUnavailable: t('Las cuentas requieren conectar tu proyecto de Supabase. Mientras tanto puedes preparar tu consulta y continuar por WhatsApp, o guardar un borrador solo en este navegador.','Accounts require connecting your Supabase project. Meanwhile, prepare an inquiry and continue through WhatsApp, or save a draft only in this browser.'),
  privacyIntro: t('Este portal permite explorar experiencias, preparar consultas por WhatsApp y, cuando se configura el servicio, crear una cuenta y guardar consultas. Una solicitud o un borrador no confirma una salida.','This portal lets you explore experiences, prepare WhatsApp inquiries and, when configured, create an account and save inquiries. A request or draft does not confirm a trip.'),
  privacyData: t('Las solicitudes pueden incluir fecha, participantes, idioma, recogida, regreso, ocasión y comentarios. Solo se envían a WhatsApp cuando tú decides continuar y enviar el mensaje. Los borradores locales permanecen en este navegador. Las cuentas configuradas usan Supabase Auth y registros protegidos por usuario.','Inquiries may include date, participants, language, pickup, return, occasion and notes. They are sent through WhatsApp only when you choose to continue and send the message. Local drafts stay in this browser. Configured accounts use Supabase Auth and user-protected records.'),
  privacyServices: t('Las fotografías, estilos y fuentes se sirven desde este sitio. Google Maps se carga como mapa externo; WhatsApp e Instagram se abren mediante enlaces. Los servicios de cuenta solo se activan cuando el propietario configura su propio proyecto. No se procesan pagos en este portal.','Photos, styles and fonts are served from this site. Google Maps loads an external map; WhatsApp and Instagram open through links. Account services are enabled only when the owner configures their own project. This portal does not process payments.'),
  privacyRights: t('Para preguntas sobre privacidad o solicitudes de acceso, rectificación, cancelación u oposición, contacta al WhatsApp de APEX e inicia el mensaje con “Solicitud ARCO / Privacidad”. No envíes identificaciones, datos bancarios ni información sensible por este formulario.','For privacy questions or access, correction, cancellation or objection requests, contact APEX through WhatsApp and begin with “Solicitud ARCO / Privacidad”. Do not send identification, banking details or sensitive information through this form.'),
  privacyImages: t('Las imágenes conceptuales y de referencia se identifican como tales. Asistir a una experiencia no equivale a autorizar uso promocional de imagen. Las solicitudes de revisión o retiro se atienden por el canal de privacidad.','Conceptual and reference imagery is identified accordingly. Attending an experience does not authorize promotional use of a person’s image. Review or removal requests are handled through the privacy contact.'),
 },
 services: { supabaseUrl: PUBLIC_SUPABASE_URL, supabaseAnonKey: PUBLIC_SUPABASE_ANON_KEY },
};

// Stable semantic copy keys consumed by the reusable UI. The values remain app-owned.
Object.assign(apexConfig.copy, {
 about_intro: t('Somos Apex Experience: una compañía de turismo de aventura que diseña encuentros con la naturaleza, atención personalizada y espacio para disfrutar a tu manera.','We are Apex Experience: an adventure travel company designing encounters with nature, personal attention and room to enjoy things your way.'),
 about_operation: t('La Marquesa es nuestra experiencia en operación: ATV, caballos y tirolesa para tu grupo. Antes de contratar revisamos contigo fecha, logística, tarifa y condiciones.','La Marquesa is our operating experience: ATVs, horseback riding and ziplining for your group. Before booking we review the date, logistics, price and terms with you.'),
 marquesa_promo: t('Nuestra experiencia recomendada: ATV, caballos y tirolesa en una salida privada. Fecha sujeta a disponibilidad.','Our recommended experience: ATVs, horseback riding and ziplining on a private outing. Dates subject to availability.'),
 private_body: apexConfig.copy.private,
 corporate_body: apexConfig.copy.corporate,
 faq_home_1: apexConfig.copy.faqPlan,
 faq_home_2: apexConfig.copy.faqPrivate,
 faq_home_3: apexConfig.copy.faqCorporate,
 faq_home_4: apexConfig.copy.faqNews,
 ...Object.fromEntries([1,2,3,4].flatMap(i => [[`value_${i}_title`,apexConfig.copy[`value${i}Title`]],[`value_${i}_body`,apexConfig.copy[`value${i}`]]])),
});

// Application-owned practical details and activity descriptions.
Object.assign(apexConfig.copy, {
 "flight_schedule": {
  "es": "Indica tu fecha preferida. APEX confirmará días de operación, horario del vuelo y disponibilidad antes de reservar.",
  "en": "Share your preferred date. APEX will confirm operating days, flight time and availability before booking."
 },
 "flight_arrival": {
  "es": "La hora de llegada, el acceso al helipuerto y las indicaciones de embarque se confirman en tu propuesta.",
  "en": "Arrival time, heliport access and boarding instructions are confirmed in your proposal."
 },
 "flight_requirements": {
  "es": "Solicita los requisitos de identificación, edades y límites de peso del operador antes de contratar. No hay restricciones numéricas publicadas hasta su validación.",
  "en": "Ask for the operator’s identification, age and weight requirements before booking. Numeric restrictions are not published until validated."
 },
 "flight_accessibility": {
  "es": "Comparte tus necesidades de asistencia para revisar la viabilidad antes de contratar.",
  "en": "Share any assistance needs so feasibility can be reviewed before booking."
 },
 "flight_luggage": {
  "es": "Consulta con APEX las indicaciones del operador sobre equipaje y objetos personales.",
  "en": "Ask APEX for the operator’s instructions on luggage and personal items."
 },
 "flight_weather": {
  "es": "La operación y la ruta deben confirmarse con el operador. Solicita las condiciones aplicables por clima, restricciones de vuelo y reprogramación antes de pagar.",
  "en": "Operations and route must be confirmed with the operator. Ask about weather, flight restrictions and rescheduling terms before paying."
 },
 "flight_cancellation": {
  "es": "Los plazos, cargos y condiciones de devolución se incluirán en tu propuesta. Revísalos antes de aceptar; una solicitud no garantiza cupo ni confirma la reserva.",
  "en": "Deadlines, charges and refund terms are included in your proposal. Review them before accepting; an inquiry does not guarantee capacity or confirm a reservation."
 },
 "marquesa_schedule": {
  "es": "Jueves a domingo, con solicitud al menos 2 días antes. Inicio y recogida previstos a las 8:30 a. m., hora de Ciudad de México. El programa incluye ATV, caballos y tirolesa; acuerda el orden, la duración y la hora de regreso con APEX antes de contratar.",
  "en": "Thursday–Sunday, with inquiries at least 2 days ahead. Planned start and pickup at 8:30 a.m., Mexico City time. The program includes ATVs, horses and ziplining; agree on order, duration and return time with APEX before booking."
 },
 "marquesa_inclusions": {
  "es": "Las tres actividades forman parte de la experiencia privada para grupos de 2 a 6 personas. Transporte, alimentos y atención para celebraciones se detallan en la cotización; no los des por incluidos si no están expresamente confirmados.",
  "en": "All three activities form part of the private experience for groups of 2–6. Transport, food and celebration arrangements are detailed in the quote; do not assume they are included unless expressly confirmed."
 },
 "marquesa_pickup": {
  "es": "Indica los puntos que necesitas. APEX confirma cobertura, costo y ubicación exacta en la cotización. La dirección de la oficina no es el punto de encuentro del tour. La Marquesa se encuentra en el Estado de México, dentro de nuestra colección CDMX y alrededores.",
  "en": "Share the locations you need. APEX confirms coverage, cost and exact location in the quote. The office address is not the tour meeting point. La Marquesa is in the State of Mexico, within our CDMX and surroundings collection."
 },
 "marquesa_requirements": {
  "es": "Lleva pantalón largo, calzado cerrado con agarre y abrigo. Consulta con APEX los requisitos específicos de las actividades antes de contratar. Comparte cualquier necesidad de accesibilidad con el equipo para revisar la viabilidad.",
  "en": "Bring long trousers, closed shoes with grip and warm clothing. Ask APEX about specific activity requirements before booking. Share accessibility needs with the team so feasibility can be reviewed."
 },
 "marquesa_cancellation": {
  "es": "Solicita las condiciones aplicables a tu fecha y revísalas antes de aceptar la cotización o realizar un pago. Una consulta, una fecha seleccionada o un mensaje preparado no confirman la reserva.",
  "en": "Ask for the terms applicable to your date and review them before accepting a quote or making payment. An inquiry, selected date or prepared message does not confirm a reservation."
 },
 "flight_activity_1": {
  "es": "Contempla lugares históricos y edificios emblemáticos desde otra perspectiva. Los puntos de interés se confirman según la ruta de tu vuelo.",
  "en": "See historic places and iconic buildings from another perspective. Points of interest are confirmed according to your flight route."
 },
 "flight_activity_2": {
  "es": "Descubre el contraste entre la ciudad, el valle y las montañas del horizonte. Las vistas naturales dependen de la ruta y de la visibilidad del día.",
  "en": "Discover the contrast between the city, valley and mountains on the horizon. Natural views depend on the route and visibility that day."
 },
 "flight_activity_3": {
  "es": "Vive el despegue y disfruta las vistas desde la cabina. APEX confirma la aeronave, la duración y las indicaciones de embarque en tu propuesta.",
  "en": "Experience takeoff and enjoy the view from the cabin. APEX confirms the aircraft, duration and boarding instructions in your proposal."
 },
 "marquesa_activity_1": {
  "es": "Recorre los senderos en cuatrimoto y descubre el bosque desde el camino.",
  "en": "Ride the trails on an ATV and discover the forest from the path."
 },
 "marquesa_activity_2": {
  "es": "Baja el ritmo. Conecta con el paisaje en un paseo a caballo.",
  "en": "Slow down. Connect with the landscape on a horseback ride."
 },
 "marquesa_activity_3": {
  "es": "Dale un giro a tu día y completa la aventura al aire libre.",
  "en": "Give your day a twist and complete your outdoor adventure."
 }
});

Object.assign(apexConfig.brand, {
 backgroundMobile: asset('/assets/forest-detail-mobile.webp'),
 promoImage: asset('/assets/bosque.jpg'),
 aboutImage: asset('/assets/clientes-sendero.jpg'),
 attributionsUrl: asset('/assets/ATTRIBUTIONS.md'),
});
Object.assign(apexConfig.experiences.find(item => item.id === 'la-marquesa')!, {
 activityImages: [asset('/assets/bosque.jpg'),asset('/assets/clientes-caballos.jpg'),asset('/assets/momentos.jpg')],
 communityImages: [asset('/assets/clientes-caballos.jpg'),asset('/assets/paisaje.jpg'),asset('/assets/momentos.jpg')],
 mapUrl: 'https://share.google/xAlQaiBA76PdSVf6B',
});
Object.assign(apexConfig.experiences.find(item => item.id === 'vuelo-en-helicoptero')!, {
 activityImages: [asset('/assets/tours/helicoptero/catedral.jpg'),asset('/assets/tours/helicoptero/cdmx-aerea.jpg'),asset('/assets/tours/helicoptero/cabina.jpg')],
});

/** Explicit fictional account data. It never shares storage or sessions with live authentication. */
apexConfig.demo = {
 enabled: true,
 namespace: 'apex-experience',
 persona: { id: 'apex-demo-alex-rivera', email: 'demo@apex.example', name: 'Alex Rivera' },
 credentials: { email: 'demo@apex.example', password: 'ApexDemo2026!' },
 records: [
  { id: 'quote-101', experienceId: 'la-marquesa', dateOffsetDays: 14, people: 2, language: 'es', pickup: 'Punto de recogida de ejemplo · Santa Fe', dropoff: 'Mismo punto de ejemplo', occasion: 'birthday', notes: 'Consulta ficticia para explorar el área personal. No se ha enviado a APEX.', status: 'quoted', reference: 'Q-101', quote: 'USD 697.05 · Cotización de ejemplo / Example quote · Sin contratación / No booking', createdOffsetDays: -2 },
  { id: 'flight-102', experienceId: 'vuelo-en-helicoptero', dateOffsetDays: 21, people: 2, language: 'en', pickup: '', dropoff: '', occasion: '', notes: 'Solicitud ficticia de vuelo. Ruta, capacidad y precio pendientes de cotización. / Fictional flight inquiry. Route, capacity and price pending.', status: 'requested', reference: 'Q-102', createdOffsetDays: -1 },
  { id: 'reservation-201', experienceId: 'la-marquesa', dateOffsetDays: 7, people: 2, language: 'es', pickup: 'Punto de encuentro de ejemplo · Santa Fe', dropoff: 'Mismo punto de ejemplo', occasion: 'anniversary', notes: 'Reserva de muestra para recorrer la interfaz. No existe una salida contratada ni un pago real. / Sample reservation for the interface; no real trip or payment.', status: 'confirmed', reference: 'R-201', quote: 'USD 697.05 · Total ilustrativo / Illustrative total · Sin pago / No payment', createdOffsetDays: -5 },
  { id: 'trip-301', experienceId: 'la-marquesa', dateOffsetDays: -30, people: 4, language: 'es', pickup: 'Recogida de ejemplo', dropoff: 'Regreso de ejemplo', occasion: '', notes: 'Viaje completado ficticio. Ninguna persona ha realizado este viaje a través de esta demostración. / Fictional completed trip, not a trip taken through this demonstration.', status: 'completed', reference: 'T-301', quote: 'USD 1,542.64 · Registro de ejemplo / Example record', createdOffsetDays: -40 },
 ],
};
apexConfig.account = {
 heroImage: asset('/assets/la-marquesa/portada-paisaje.jpg'),
 heroTitle: t('Tu próxima historia empieza aquí.', 'Your next story starts here.'),
 heroIntro: t('Un espacio para tus planes, tus salidas y los recuerdos que vienen después.', 'A place for your plans, upcoming outings and the memories that follow.'),
 profileLocation: 'Ciudad de México · Perfil ficticio / Fictional profile',
 memberSince: '2026',
};
apexConfig.copy.accountDemo = t('Cuenta de ejemplo · Datos ficticios guardados solo en este navegador. No hay reservas, pagos ni correos reales.', 'Example account · Fictional data saved only in this browser. There are no real bookings, payments or emails.');
apexConfig.copy.accountLive = t('Cuenta conectada al servicio real. Los registros de ejemplo permanecen separados y no se transfieren a esta cuenta.', 'Account connected to the live service. Example records remain separate and are not transferred to this account.');
