import type { ApexConfig, ApexInquiry, ApexLocale, ApexValidationErrors } from './types.ts';

/** Gregorian calendar date in the operator's timezone, independent of browser timezone. */
export function mexicoToday(now = new Date()): string {
 const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
 const get = (type: string) => parts.find(part => part.type === type)?.value ?? '';
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function parseCalendarDate(value: string): Date | null {
 if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
 const d = new Date(`${value}T12:00:00Z`);
 return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value ? d : null;
}
export function minimumInquiryDate(now = new Date()): string {
 const d = parseCalendarDate(mexicoToday(now))!;
 d.setUTCDate(d.getUTCDate() + 2);
 return d.toISOString().slice(0, 10);
}
export function availableDate(value: string, now = new Date()): boolean {
 const d = parseCalendarDate(value);
 return !!d && value >= minimumInquiryDate(now) && [0, 4, 5, 6].includes(d.getUTCDay());
}
export function groupPrice(people: number, config: Pick<ApexConfig, 'prices'>): number | null {
 return Number.isInteger(people) && Object.hasOwn(config.prices, people) ? config.prices[people] : null;
}
export function formatUSD(value: number, locale: ApexLocale = 'es'): string {
 return new Intl.NumberFormat(locale === 'es' ? 'es-MX' : 'en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'code' }).format(value);
}
export function initialInquiry(experienceId = 'la-marquesa'): ApexInquiry {
 return { experienceId, date: '', people: 2, language: 'es', pickup: '', dropoff: '', occasion: '', notes: '' };
}
export function validateInquiry(inquiry: ApexInquiry, config: ApexConfig, now = new Date(), locale: ApexLocale = 'es'): ApexValidationErrors {
 const errors: ApexValidationErrors = {};
 const es = locale === 'es';
 const experience = config.experiences.find(item => item.id === inquiry.experienceId);
 if (!experience || experience.status === 'coming-soon') errors.experienceId = es ? 'Esta experiencia todavía no admite consultas de reserva.' : 'This experience is not accepting reservation inquiries yet.';
 if (experience?.kind === 'adventure') {
  if (!availableDate(inquiry.date, now)) errors.date = es ? 'Elige jueves a domingo con al menos 2 días de anticipación.' : 'Choose Thursday–Sunday, at least 2 days ahead.';
  if (groupPrice(inquiry.people, config) === null) errors.people = es ? 'La experiencia privada es para grupos de 2 a 6 personas.' : 'The private experience accommodates 2–6 people.';
 } else {
  if (!parseCalendarDate(inquiry.date) || inquiry.date < mexicoToday(now)) errors.date = es ? 'Elige una fecha válida de hoy en adelante.' : 'Choose a valid date today or later.';
  if (!Number.isInteger(inquiry.people) || inquiry.people < 1 || inquiry.people > 99) errors.people = es ? 'Indica entre 1 y 99 pasajeros. La capacidad se confirma en la propuesta.' : 'Enter 1–99 passengers. Capacity is confirmed in your proposal.';
 }
 if (!['es', 'en'].includes(inquiry.language)) errors.language = es ? 'Selecciona un idioma válido.' : 'Select a valid language.';
 for (const key of ['pickup', 'dropoff', 'occasion', 'notes'] as const) {
  if (typeof inquiry[key] !== 'string' || inquiry[key].length > (key === 'notes' ? 1500 : 300)) errors[key] = es ? 'Revisa este campo; el texto es demasiado largo.' : 'Check this field; the text is too long.';
 }
 return errors;
}
export function formatInquiry(inquiry: ApexInquiry, config: ApexConfig, locale: ApexLocale = 'es'): string {
 const es = locale === 'es';
 const experience = config.experiences.find(item => item.id === inquiry.experienceId);
 const title = experience?.title[locale] ?? inquiry.experienceId;
 const price = experience?.kind === 'adventure' ? groupPrice(inquiry.people, config) : null;
 const occasionLabels: Record<string, string> = { birthday: es ? 'Cumpleaños' : 'Birthday', anniversary: es ? 'Aniversario' : 'Anniversary', other: es ? 'Otra celebración' : 'Other celebration' };
 return [
  `${es ? 'Consulta de disponibilidad' : 'Availability inquiry'} · ${title}`,
  experience?.kind === 'adventure' && experience.activities.length ? `${es ? 'Programa incluido' : 'Included program'}: ${experience.activities.map(item => item[locale]).join(', ')}.` : '',
  `${es ? 'Fecha' : 'Date'}: ${inquiry.date}`,
  `${es ? 'Personas' : 'People'}: ${inquiry.people}`,
  `${es ? 'Idioma del tour' : 'Tour language'}: ${inquiry.language === 'es' ? 'Español' : 'English'}`,
  price === null ? (es ? 'Solicito tarifa por persona y total del grupo.' : 'Please quote the per-person and group total.') : `${es ? 'Tarifa publicada del grupo' : 'Published group price'}: ${formatUSD(price, locale)}`,
  inquiry.pickup.trim() ? `${es ? 'Recogida solicitada' : 'Requested pickup'}: ${inquiry.pickup.trim()}` : '',
  inquiry.pickup.trim() ? `${es ? 'Regreso solicitado' : 'Requested return'}: ${inquiry.dropoff.trim() || inquiry.pickup.trim()}` : '',
  inquiry.occasion.trim() ? `${es ? 'Ocasión especial' : 'Special occasion'}: ${occasionLabels[inquiry.occasion.trim()] ?? inquiry.occasion.trim()}` : '',
  inquiry.notes.trim() ? `${es ? 'Comentarios' : 'Notes'}: ${inquiry.notes.trim()}` : '',
  es ? 'Solicito disponibilidad, tarifa y condiciones de reserva.' : 'Please confirm availability, price and reservation terms.',
 ].filter(Boolean).join('\n');
}
export function whatsappUrl(config: Pick<ApexConfig, 'contact'>, message: string): string {
 const phone = config.contact.whatsapp.replace(/\D/g, '');
 return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Validate stored records without rejecting historical dates. Storage is untrusted input. */
export function parseSavedInquiry(value: unknown): import('./types.ts').ApexSavedInquiry | null {
 if (!value || typeof value !== 'object') return null;
 const item = value as Record<string, unknown>;
 if (typeof item.id !== 'string' || !item.id || item.id.length > 128 ||
     typeof item.createdAt !== 'string' || !Number.isFinite(Date.parse(item.createdAt)) ||
     typeof item.experienceId !== 'string' || !item.experienceId || item.experienceId.length > 100 ||
     typeof item.date !== 'string' || !parseCalendarDate(item.date) ||
     typeof item.people !== 'number' || !Number.isInteger(item.people) || item.people < 1 || item.people > 99 ||
     (item.language !== 'es' && item.language !== 'en') ||
     !['draft', 'requested', 'quoted', 'confirmed', 'completed', 'cancelled'].includes(String(item.status))) return null;
 for (const key of ['pickup', 'dropoff', 'occasion', 'notes'] as const) {
  if (typeof item[key] !== 'string' || item[key].length > (key === 'notes' ? 1500 : 300)) return null;
 }
 if ((item.reference !== undefined && typeof item.reference !== 'string') ||
     (item.quote !== undefined && typeof item.quote !== 'string')) return null;
 return {
  id: item.id, createdAt: item.createdAt, experienceId: item.experienceId, date: item.date,
  people: item.people, language: item.language, pickup: item.pickup as string,
  dropoff: item.dropoff as string, occasion: item.occasion as string, notes: item.notes as string,
  status: item.status as import('./types.ts').ApexSavedInquiry['status'],
  ...(typeof item.reference === 'string' ? { reference: item.reference } : {}),
  ...(typeof item.quote === 'string' ? { quote: item.quote } : {}),
 };
}
