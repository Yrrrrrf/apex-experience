/** Emit real HTML entrypoints so direct URLs work on any static host. */
export function entries() {
 return [
  'destinos/cdmx', 'destinos/quintana-roo', 'destinos/hidalgo', 'destinos/jalisco', 'destinos/baja-california', 'destinos/oaxaca',
  'experiencias/la-marquesa', 'experiencias/vuelo-en-helicoptero', 'reservar', 'cuenta', 'cuenta/recuperar', 'cuenta/callback', 'privacidad',
 ].map(path => ({ path }));
}
