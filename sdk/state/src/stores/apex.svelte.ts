import { createApexApi, type ApexSession } from '../../../api/src/apex.ts';
import { createDemoAccount, demoStorageKey } from '../../../core/src/apex/demo.ts';
import { parseSavedInquiry, validateInquiry } from '../../../core/src/apex/booking.ts';
import type { ApexConfig, ApexDemoSnapshot, ApexInquiry, ApexLocale, ApexSavedInquiry, ApexUser } from '../../../core/src/apex/types.ts';

const DRAFT_KEY = 'apex.guest-inquiries.v1';
/** randomUUID requires HTTPS; getRandomValues also supports local HTTP previews. */
function newDraftId(): string {
 if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
 return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
}
/** One store per mounted app. Guest drafts never imply an account or reservation. */
export function createApexStore(config: ApexConfig) {
 const api = createApexApi(config);
 const demo = config.demo?.enabled ? createDemoAccount(config.demo) : null;
 const demoKey = config.demo ? demoStorageKey(config.demo) : '';
 const modeKey = `${demoKey}.mode`;
 let accountMode = $state<'demo' | 'live'>(demo && !api.configured ? 'demo' : 'live');
 let demoSnapshot = $state<ApexDemoSnapshot | null>(demo?.snapshot ?? null);
 let demoStorageAvailable = $state(true);
 let liveInitialized = false;
 const sessionKey = `apex.auth.${config.services?.supabaseUrl ?? 'unconfigured'}`;
 let locale = $state<ApexLocale>('es');
 let reducedMotion = $state(false);
 let user = $state<ApexUser | null>(null);
 let savedInquiries = $state<ApexSavedInquiry[]>([]);
 let guestInquiries = $state<ApexSavedInquiry[]>([]);
 let busy = $state(false);
 let error = $state('');
 let message = $state('');
 let initialized = $state(false);
 let recoveryMode = $state(false);
 let session: ApexSession | null = null;
 function persistSession() {
  try { if (session) sessionStorage.setItem(sessionKey, JSON.stringify(session)); else sessionStorage.removeItem(sessionKey); } catch { /* Private browser modes may disable storage. The in-memory session still works. */ }
 }
 async function accessToken() {
  if (!session) throw new Error(locale === 'es' ? 'Inicia sesión para guardar en tu cuenta.' : 'Sign in to save to your account.');
  if (session.expires_at <= Date.now() / 1000 + 60) { session = await api.refresh(session.refresh_token); persistSession(); }
  return session.access_token;
 }
 async function run(action: () => Promise<void>) {
  if (busy) return;
  busy = true; error = ''; message = '';
  try { await action(); } catch (cause) { error = cause instanceof Error ? cause.message : 'No se pudo completar la solicitud. / Request failed.'; } finally { busy = false; }
 }
 async function loadInternal() { if (user) savedInquiries = await api.listInquiries(await accessToken()); }
 function syncDemo() {
  if (!demo) return;
  demoSnapshot = demo.snapshot;
  try { localStorage.setItem(demoKey, demo.serialize()); localStorage.setItem(modeKey, 'demo'); demoStorageAvailable = true; } catch { demoStorageAvailable = false; }
 }
 function requireDemo() {
  if (!demo || accountMode !== 'demo') throw new Error('Selecciona explícitamente el modo de ejemplo. / Select example mode explicitly.');
  return demo;
 }
 async function initializeLive() {
  if (liveInitialized || !api.configured) return;
  liveInitialized = true;
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const token = fragment.get('access_token');
  const refresh = fragment.get('refresh_token');
  if (token && refresh) {
   session = { access_token: token, refresh_token: refresh, expires_at: Math.floor(Date.now() / 1000) + Number(fragment.get('expires_in') || 3600) };
   recoveryMode = fragment.get('type') === 'recovery';
   window.history.replaceState(null, '', window.location.pathname + window.location.search);
  } else {
   try { const candidate = JSON.parse(sessionStorage.getItem(sessionKey) ?? 'null'); if (typeof candidate?.access_token === 'string' && typeof candidate?.refresh_token === 'string' && typeof candidate?.expires_at === 'number') session = candidate; } catch { session = null; }
  }
  if (session) {
   try { user = await api.getUser(await accessToken()); persistSession(); await loadInternal(); } catch (cause) { clearAccount(); throw cause; }
  }
 }
 function clearAccount() { session = null; user = null; savedInquiries = []; recoveryMode = false; persistSession(); }
 return {
  get locale() { return locale; },
  get reducedMotion() { return reducedMotion; },
  get user() { return accountMode === 'demo' ? (demoSnapshot?.signedIn ? config.demo!.persona : null) : user; },
  get savedInquiries() { return accountMode === 'demo' ? (demoSnapshot?.signedIn ? demoSnapshot.records : []) : savedInquiries; },
  get guestInquiries() { return guestInquiries; },
  get busy() { return busy; },
  get error() { return error; },
  get message() { return message; },
  get initialized() { return initialized; },
  get recoveryMode() { return accountMode === 'demo' ? demoSnapshot?.recoveryStep === 'password' : recoveryMode; },
  get demoAvailable() { return !!demo; },
  get demoPersistenceWarning() { return accountMode === 'demo' && !demoStorageAvailable ? (locale === 'es' ? 'La demo funciona solo en memoria: este navegador no permite guardar o restaurar el ejemplo. Tus cambios podrían perderse al recargar.' : 'The demo is running in memory only: this browser cannot save or restore the example. Your changes may be lost when reloading.') : ''; },
  get isDemo() { return accountMode === 'demo'; },
  get accountMode() { return accountMode; },
  get demoCredentials() { return config.demo?.credentials ?? null; },
  get demoProfile() { return config.demo?.persona ?? null; },
  get demoOutbox() { return accountMode === 'demo' ? demoSnapshot?.outbox ?? [] : []; },
  get demoPendingEmail() { return accountMode === 'demo' && (demoSnapshot?.pendingSignup || (demoSnapshot && demoSnapshot.recoveryStep !== 'none')) ? config.demo?.credentials.email ?? '' : ''; },
  get demoConfirmationRequired() { return accountMode === 'demo' && !!demoSnapshot?.pendingSignup; },
  get authConfigured() { return api.configured; },
  setLocale(value: ApexLocale) { locale = value; },
  toggleMotion() { reducedMotion = !reducedMotion; },
  clearFeedback() { error = ''; message = ''; },
  async initialize() {
   if (initialized || typeof window === 'undefined') return;
   initialized = true;
   reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   try {
    const drafts: unknown = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? '[]');
    if (Array.isArray(drafts)) guestInquiries = drafts.map(parseSavedInquiry).filter((draft): draft is ApexSavedInquiry => draft !== null).slice(0, 30);
   } catch { /* Corrupt or unavailable storage must not block booking. */ }
   if (demo) {
    try { demo.restore(localStorage.getItem(demoKey)); const selected = localStorage.getItem(modeKey); if (selected === 'demo' || selected === 'live') accountMode = selected; demoStorageAvailable = true; } catch { demoStorageAvailable = false; }
    demoSnapshot = demo.snapshot;
   }
   if (accountMode === 'live') await run(initializeLive);
  },
  async chooseAccountMode(value: 'demo' | 'live') {
   if (busy || (value === 'demo' && !demo)) return;
   accountMode = value; error = ''; message = ''; recoveryMode = false;
   try { if (demo) { localStorage.setItem(modeKey, value); demoStorageAvailable = true; } } catch { demoStorageAvailable = false; }
   if (value === 'live') await run(initializeLive);
  },

  async signIn(email: string, password: string) {
   await run(async () => {
    if (accountMode === 'demo') { requireDemo().signIn(email, password); syncDemo(); message = locale === 'es' ? 'Sesión de ejemplo iniciada. Todos los datos son ficticios y locales.' : 'Example session started. All account data is fictional and local.'; return; }
    const result = await api.signIn(email.trim(), password);
    session = result.session; user = result.user; persistSession();
    await loadInternal();
    message = locale === 'es' ? 'Sesión iniciada.' : 'Signed in.';
   });
  },
  async signUp(name: string, email: string, password: string) {
   await run(async () => {
    if (name.trim().length < 2 || password.length < 8) throw new Error(locale === 'es' ? 'Indica tu nombre y una contraseña de al menos 8 caracteres.' : 'Enter your name and a password of at least 8 characters.');
    if (accountMode === 'demo') { requireDemo().signUp(name, email, password); syncDemo(); message = locale === 'es' ? 'Vista previa local de confirmación creada. No se envió ningún correo ni se creó una cuenta real.' : 'Local confirmation preview created. No email was sent and no real account was created.'; return; }
    const result = await api.signUp(name.trim(), email.trim(), password, `${window.location.origin}/cuenta/callback/`);
    if (result.session && result.user) { session = result.session; user = result.user; persistSession(); await loadInternal(); }
    message = locale === 'es' ? 'Revisa tu correo para confirmar tu cuenta si se requiere verificación.' : 'Check your email to confirm your account if verification is required.';
   });
  },
  async recover(email: string) {
   await run(async () => {
    if (accountMode === 'demo') { requireDemo().requestRecovery(email); syncDemo(); message = locale === 'es' ? 'Vista previa local de recuperación creada. No se envió ningún correo.' : 'Local recovery preview created. No email was sent.'; return; }
    await api.recover(email.trim(), `${window.location.origin}/cuenta/recuperar/`);
    message = locale === 'es' ? 'Si existe una cuenta con ese correo, recibirás un enlace de recuperación.' : 'If an account exists for that email, you will receive a recovery link.';
   });
  },
  async updatePassword(password: string) {
   await run(async () => {
    if (password.length < 8) throw new Error(locale === 'es' ? 'Usa al menos 8 caracteres.' : 'Use at least 8 characters.');
    if (accountMode === 'demo') { requireDemo().updatePassword(password); syncDemo(); message = locale === 'es' ? 'Recorrido de recuperación completado. No se guardó la contraseña; la credencial pública de la demo no cambia.' : 'Recovery walkthrough completed. The entered password was not stored; the public demo credential is unchanged.'; return; }
    await api.updatePassword(password, await accessToken());
    recoveryMode = false;
    message = locale === 'es' ? 'Contraseña actualizada.' : 'Password updated.';
   });
  },
  async signOut() {
   if (accountMode === 'demo') { requireDemo().signOut(); syncDemo(); error = ''; message = locale === 'es' ? 'Sesión de ejemplo cerrada.' : 'Example session signed out.'; return; }
   const token = session?.access_token;
   clearAccount();
   await run(async () => { if (token && api.configured) await api.signOut(token); });
  },
  async loadInquiries() { if (accountMode === 'demo') { demoSnapshot = demo?.snapshot ?? null; return; } await run(loadInternal); },
  async confirmDemoAccount(mailId?: string) { await run(async () => { requireDemo().confirmSignup(mailId); syncDemo(); message = locale === 'es' ? 'Cuenta de ejemplo confirmada localmente. No existe un registro real.' : 'Example account confirmed locally. No real account was registered.'; }); },
  async openDemoRecovery(mailId?: string) { await run(async () => { requireDemo().beginRecovery(mailId); syncDemo(); message = locale === 'es' ? 'Recuperación de ejemplo abierta. El siguiente paso tampoco envía datos.' : 'Example recovery opened. The next step does not send data either.'; }); },
  async resetDemoAccount() { await run(async () => { requireDemo().reset(); syncDemo(); message = locale === 'es' ? 'Ejemplo restaurado con datos ficticios iniciales.' : 'Example restored with its initial fictional data.'; }); },
  async removeDemoInquiry(id: string) { await run(async () => { requireDemo().removeInquiry(id); syncDemo(); }); },
  async saveInquiry(inquiry: ApexInquiry) {
   await run(async () => {
    const errors = validateInquiry(inquiry, config, new Date(), locale);
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
    if (accountMode === 'demo') { requireDemo().saveInquiry(inquiry); syncDemo(); message = locale === 'es' ? 'Consulta guardada solo en tu cuenta de ejemplo local. No enviada ni reservada.' : 'Inquiry saved only to your local example account. It has not been sent or booked.'; return; }
    if (!user) throw new Error(locale === 'es' ? 'Inicia sesión para guardar en tu cuenta.' : 'Sign in to save to your account.');
    const saved = await api.saveInquiry({ ...inquiry }, user.id, await accessToken());
    savedInquiries = [saved, ...savedInquiries];
    message = locale === 'es' ? 'Consulta guardada en tu cuenta. No enviada ni confirmada.' : 'Inquiry saved to your account. It has not been sent or confirmed.';
   });
  },
  saveGuestDraft(inquiry: ApexInquiry) {
   error = ''; message = '';
   const errors = validateInquiry(inquiry, config, new Date(), locale);
   if (Object.keys(errors).length) { error = Object.values(errors)[0] ?? ''; return; }
   const saved: ApexSavedInquiry = { ...inquiry, id: newDraftId(), createdAt: new Date().toISOString(), status: 'draft' };
   const updated = [saved, ...guestInquiries].slice(0, 30);
   try { localStorage.setItem(DRAFT_KEY, JSON.stringify(updated)); guestInquiries = updated; message = locale === 'es' ? 'Borrador guardado solo en este navegador. No enviado ni reservado.' : 'Draft saved only in this browser. It has not been sent or booked.'; } catch { error = locale === 'es' ? 'Tu navegador no permite guardar borradores.' : 'Your browser does not allow saving drafts.'; }
  },
  removeGuestDraft(id: string) {
   try { const updated = guestInquiries.filter(item => item.id !== id); localStorage.setItem(DRAFT_KEY, JSON.stringify(updated)); guestInquiries = updated; } catch { error = locale === 'es' ? 'No se pudo actualizar el almacenamiento local.' : 'Could not update browser storage.'; }
  },
 };
}
export type ApexStore = ReturnType<typeof createApexStore>;
