import type { ApexLocale, ApexSavedInquiry } from '../../../../core/src/apex/mod.ts';

export function accountDate(value: string, locale: ApexLocale, compact = false): string {
 const date = new Date(`${value}T12:00:00Z`);
 if (!Number.isFinite(date.getTime())) return value;
 return new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
  day: 'numeric', month: compact ? 'short' : 'long', year: 'numeric', timeZone: 'UTC',
 }).format(date);
}
export function accountStatus(status: ApexSavedInquiry['status'], locale: ApexLocale): string {
 const labels = {
  draft: { es: 'Consulta guardada', en: 'Saved inquiry' },
  requested: { es: 'En revisión', en: 'Under review' },
  quoted: { es: 'Propuesta recibida', en: 'Proposal received' },
  confirmed: { es: 'Confirmada', en: 'Confirmed' },
  completed: { es: 'Experiencia vivida', en: 'Experience completed' },
  cancelled: { es: 'Cancelada', en: 'Cancelled' },
 };
 return labels[status][locale];
}
export function accountInitials(name: string): string {
 return name.trim().split(/\s+/).slice(0, 2).map(part => part[0] ?? '').join('').toUpperCase() || 'A';
}
