import { mexicoToday, parseCalendarDate, parseSavedInquiry } from './booking.ts';
import type { ApexDemoConfig, ApexDemoMail, ApexDemoSnapshot, ApexInquiry, ApexSavedInquiry } from './types.ts';

export const DEMO_STORAGE_PREFIX = 'apex.demo.account.v1.';
export function demoStorageKey(config: ApexDemoConfig): string {
 return `${DEMO_STORAGE_PREFIX}${config.namespace.replace(/[^a-zA-Z0-9.-]/g, '-').slice(0, 80)}`;
}
/** A local demonstration, deliberately independent of fetch, authentication tokens and storage APIs. */
export function createDemoAccount(config: ApexDemoConfig, options: { now?: () => Date; id?: () => string } = {}) {
 const now = options.now ?? (() => new Date());
 let sequence = 0;
 const id = options.id ?? (() => `${now().getTime().toString(36)}-${++sequence}-${Math.random().toString(36).slice(2, 9)}`);
 if (!config.enabled || !config.credentials.email.endsWith('@apex.example') || config.persona.email !== config.credentials.email || !config.namespace) throw new Error('Invalid demo account configuration. Use a synthetic @apex.example account.');
 function relativeDate(offset: number, experienceId: string) {
  const date = parseCalendarDate(mexicoToday(now()))!;
  date.setUTCDate(date.getUTCDate() + offset);
  if (experienceId === 'la-marquesa') {
   while (![0, 4, 5, 6].includes(date.getUTCDay())) date.setUTCDate(date.getUTCDate() + (offset < 0 ? -1 : 1));
  }
  return date.toISOString().slice(0, 10);
 }
 function seeds(): ApexSavedInquiry[] {
  return config.records.map(record => {
   const { dateOffsetDays, createdOffsetDays = -2, ...fields } = record;
   const created = new Date(now()); created.setUTCDate(created.getUTCDate() + createdOffsetDays);
   return { ...fields, id: `demo-seed-${record.id}`, date: relativeDate(dateOffsetDays, record.experienceId), createdAt: created.toISOString(), reference: record.reference ? `DEMO-${record.reference.replace(/^DEMO-/, '')}` : undefined, source: 'demo', isDemo: true };
  });
 }
 function initial(): ApexDemoSnapshot { return { version: 1, signedIn: false, emailConfirmed: true, pendingSignup: false, recoveryStep: 'none', records: seeds(), outbox: [] }; }
 let state = initial();
 function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
 function requireEmail(email: string) {
  if (email.trim().toLowerCase() !== config.credentials.email.toLowerCase()) throw new Error(`Usa únicamente el correo ficticio ${config.credentials.email}. No se guardan correos reales. / Use only the fictional demo email.`);
 }
 function makeMail(kind: ApexDemoMail['kind'], mailId = `demo-mail-${id()}`, createdAt = now().toISOString(), consumed = false): ApexDemoMail {
  return {
   id: mailId, kind, createdAt, consumed, to: config.credentials.email,
   subject: kind === 'confirmation' ? { es: 'Vista previa · Confirma tu cuenta de ejemplo', en: 'Preview · Confirm your example account' } : { es: 'Vista previa · Recupera tu acceso de ejemplo', en: 'Preview · Recover your example access' },
   body: kind === 'confirmation'
    ? { es: `Hola ${config.persona.name}. Esta es una vista previa local del correo de confirmación. Selecciona “Confirmar cuenta de ejemplo” para continuar. No se ha enviado ningún correo ni creado una cuenta real.`, en: `Hello ${config.persona.name}. This is a local confirmation email preview. Select “Confirm example account” to continue. No email has been sent and no real account has been created.` }
    : { es: 'Esta es una vista previa local del correo de recuperación. Selecciona “Abrir recuperación de ejemplo” para recorrer el cambio de contraseña. No se ha enviado ningún correo. La contraseña pública de la demo no cambia.', en: 'This is a local recovery email preview. Select “Open example recovery” to walk through the password update. No email has been sent. The public demo password does not change.' },
  };
 }
 function queueMail(kind: ApexDemoMail['kind']) {
  state.outbox = [makeMail(kind), ...state.outbox.map(mail => mail.kind === kind ? { ...mail, consumed: true } : mail)].slice(0, 10);
 }
 function consume(kind: ApexDemoMail['kind'], mailId?: string) {
  const mail = state.outbox.find(item => item.kind === kind && !item.consumed && (!mailId || item.id === mailId));
  if (!mail) throw new Error('Genera primero una nueva vista previa de correo. / Generate a new email preview first.');
  if (now().getTime() - Date.parse(mail.createdAt) > 24 * 60 * 60 * 1000) throw new Error('La vista previa caducó. Genera otra. / This preview expired. Generate another one.');
  state.outbox = state.outbox.map(item => item.id === mail.id ? { ...item, consumed: true } : item);
 }
 return {
  get snapshot(): ApexDemoSnapshot { return clone(state); },
  get user() { return state.signedIn ? { ...config.persona } : null; },
  get records() { return clone(state.records); },
  get outbox() { return clone(state.outbox); },
  serialize(): string {
   // Never serialize supplied names/emails/passwords, config credentials, or any real auth token.
   return JSON.stringify({ ...state, namespace: config.namespace, outbox: state.outbox.map(({ id, kind, createdAt, consumed }) => ({ id, kind, createdAt, consumed })) });
  },
  restore(raw: string | null): boolean {
   state = initial();
   if (!raw || raw.length > 1_000_000) return false;
   try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return false;
    const saved = value as Record<string, unknown>;
    if ((saved.namespace !== undefined && saved.namespace !== config.namespace) || saved.version !== 1 || typeof saved.signedIn !== 'boolean' || typeof saved.emailConfirmed !== 'boolean' || typeof saved.pendingSignup !== 'boolean' || !['none', 'requested', 'password'].includes(String(saved.recoveryStep)) || !Array.isArray(saved.records) || !Array.isArray(saved.outbox)) return false;
    const records = saved.records.map(parseSavedInquiry).filter((record): record is ApexSavedInquiry => !!record && !record.id.startsWith('demo-seed-')).slice(0, 100).map(record => ({ ...record, reference: record.reference ? `DEMO-${record.reference.replace(/^DEMO-/, '')}` : undefined, source: 'demo' as const, isDemo: true }));
    const outbox: ApexDemoMail[] = saved.outbox.flatMap(item => {
     if (!item || typeof item !== 'object' || typeof item.id !== 'string' || item.id.length > 160 || !item.id.startsWith('demo-mail-') || !['confirmation','recovery'].includes(item.kind) || typeof item.createdAt !== 'string' || !Number.isFinite(Date.parse(item.createdAt)) || typeof item.consumed !== 'boolean') return [];
     return [makeMail(item.kind, item.id, item.createdAt, item.consumed)];
    }).slice(0, 10);
    state = { version: 1, signedIn: saved.signedIn && saved.emailConfirmed && !saved.pendingSignup, emailConfirmed: saved.emailConfirmed, pendingSignup: saved.pendingSignup, recoveryStep: saved.recoveryStep as ApexDemoSnapshot['recoveryStep'], records: [...records, ...seeds()], outbox };
    if (state.recoveryStep === 'password' && !outbox.some(mail => mail.kind === 'recovery' && mail.consumed)) state.recoveryStep = 'none';
    return true;
   } catch { return false; }
  },
  signIn(email: string, password: string) {
   requireEmail(email);
   if (password !== config.credentials.password) throw new Error('La contraseña no coincide con la demo publicada. / The password does not match the published demo credential.');
   if (!state.emailConfirmed || state.pendingSignup) throw new Error('Confirma primero la cuenta de ejemplo desde la vista previa. / Confirm the example account from the preview first.');
   state.signedIn = true; state.recoveryStep = 'none';
  },
  signUp(_name: string, email: string, password: string) {
   requireEmail(email);
   if (password !== config.credentials.password) throw new Error('Para el registro de ejemplo usa la contraseña pública de la demo. / Use the public demo password for example registration.');
   state.signedIn = false; state.emailConfirmed = false; state.pendingSignup = true; state.recoveryStep = 'none'; queueMail('confirmation');
  },
  confirmSignup(mailId?: string) {
   if (!state.pendingSignup) throw new Error('No hay un registro de ejemplo pendiente. / There is no pending example registration.');
   consume('confirmation', mailId); state.emailConfirmed = true; state.pendingSignup = false; state.signedIn = true;
  },
  requestRecovery(email: string) {
   requireEmail(email); state.signedIn = false; state.recoveryStep = 'requested'; queueMail('recovery');
  },
  beginRecovery(mailId?: string) { consume('recovery', mailId); state.recoveryStep = 'password'; },
  updatePassword(password: string) {
   if (state.recoveryStep !== 'password') throw new Error('Abre primero la recuperación desde la vista previa. / Open recovery from the email preview first.');
   if (password.length < 8 || password.length > 128) throw new Error('Usa entre 8 y 128 caracteres para este paso de demostración. / Use 8–128 characters for this demonstration step.');
   // Deliberately do not retain, hash or use this input as an authentication credential.
   state.recoveryStep = 'none'; state.emailConfirmed = true; state.pendingSignup = false; state.signedIn = true;
  },
  signOut() { state.signedIn = false; state.recoveryStep = 'none'; state.pendingSignup = false; state.emailConfirmed = true; state.outbox = []; },
  saveInquiry(inquiry: ApexInquiry) {
   if (!state.signedIn) throw new Error('Inicia la sesión de ejemplo. / Sign in to the example account.');
   const candidate = parseSavedInquiry({ ...inquiry, id: `demo-inquiry-${id()}`, createdAt: now().toISOString(), status: 'draft' });
   if (!candidate) throw new Error('La consulta de ejemplo no es válida. / The example inquiry is invalid.');
   const record = { ...candidate, source: 'demo' as const, isDemo: true };
   state.records = [record, ...state.records].slice(0, 120); return clone(record);
  },
  removeInquiry(recordId: string) {
   if (!state.signedIn) throw new Error('Inicia la sesión de ejemplo. / Sign in to the example account.');
   state.records = state.records.filter(record => record.id !== recordId || record.id.startsWith('demo-seed-') || record.status !== 'draft');
  },
  reset() { state = initial(); },
 };
}
