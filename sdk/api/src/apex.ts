import { parseSavedInquiry } from '../../core/src/apex/booking.ts';
import type { ApexConfig, ApexInquiry, ApexSavedInquiry, ApexUser } from '../../core/src/apex/types.ts';

export interface ApexSession {
 access_token: string;
 refresh_token: string;
 expires_at: number;
}
interface AuthResponse { access_token?: string; refresh_token?: string; expires_in?: number; expires_at?: number; user?: { id: string; email?: string; user_metadata?: { display_name?: string; name?: string } } }
export function createApexApi(config: ApexConfig, fetcher: typeof fetch = fetch) {
 const url = config.services?.supabaseUrl?.replace(/\/+$/, '') ?? '';
 const key = config.services?.supabaseAnonKey ?? '';
 const configured = !!url && !!key;
 const failUnconfigured = () => { if (!configured) throw new Error('El acceso de cuenta aún no está conectado. Puedes preparar tu consulta y contactar a APEX por WhatsApp. / Account service is not configured.'); };
 async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  failUnconfigured();
  const response = await fetcher(`${url}${path}`, { ...options, headers: { apikey: key, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }, signal: AbortSignal.timeout(20000) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.msg || body?.message || body?.error_description || body?.error || `Service request failed (${response.status})`);
  return body as T;
 }
 function sessionFrom(body: AuthResponse): ApexSession | null {
  return body.access_token && body.refresh_token ? { access_token: body.access_token, refresh_token: body.refresh_token, expires_at: body.expires_at ?? Math.floor(Date.now() / 1000) + (body.expires_in ?? 3600) } : null;
 }
 function userFrom(body: NonNullable<AuthResponse['user']>): ApexUser {
  return { id: body.id, email: body.email ?? '', name: body.user_metadata?.display_name ?? body.user_metadata?.name ?? body.email?.split('@')[0] ?? '' };
 }
 return {
  configured,
  async signIn(email: string, password: string) {
   const body = await request<AuthResponse>('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
   const session = sessionFrom(body);
   if (!session || !body.user) throw new Error('No se pudo iniciar la sesión. / Could not start your session.');
   return { session, user: userFrom(body.user) };
  },
  async signUp(name: string, email: string, password: string, redirectTo: string) {
   const body = await request<AuthResponse>(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: JSON.stringify({ email, password, data: { display_name: name } }) });
   return { session: sessionFrom(body), user: body.user ? userFrom(body.user) : null };
  },
  async recover(email: string, redirectTo: string) {
   await request(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: JSON.stringify({ email }) });
  },
  async updatePassword(password: string, token: string) {
   await request('/auth/v1/user', { method: 'PUT', body: JSON.stringify({ password }) }, token);
  },
  async getUser(token: string): Promise<ApexUser> {
   const body = await request<NonNullable<AuthResponse['user']>>('/auth/v1/user', {}, token);
   return userFrom(body);
  },
  async refresh(refreshToken: string): Promise<ApexSession> {
   const body = await request<AuthResponse>('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) });
   const session = sessionFrom(body);
   if (!session) throw new Error('La sesión expiró. Inicia sesión de nuevo. / Session expired. Please sign in again.');
   return session;
  },
  async signOut(token: string) { await request('/auth/v1/logout', { method: 'POST' }, token); },
  async saveInquiry(inquiry: ApexInquiry, userId: string, token: string): Promise<ApexSavedInquiry> {
   const source = inquiry as Partial<ApexSavedInquiry>;
   if (source.source === 'demo' || source.isDemo === true) throw new Error('Los registros de ejemplo no se transfieren al servicio real. / Example records cannot be sent to the live service.');
   const rows = await request<Array<{ id: string; payload: ApexInquiry; status: ApexSavedInquiry['status']; created_at: string }>>('/rest/v1/apex_inquiries', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ user_id: userId, payload: inquiry }) }, token);
   if (!rows?.[0]) throw new Error('No se pudo guardar la consulta. / Could not save your inquiry.');
   const saved = parseSavedInquiry({ ...rows[0].payload, id: rows[0].id, status: rows[0].status, createdAt: rows[0].created_at });
   if (!saved) throw new Error('Invalid inquiry record returned by the account service.');
   return saved;
  },
  async listInquiries(token: string): Promise<ApexSavedInquiry[]> {
   const rows = await request<Array<{ id: string; payload: ApexInquiry; status: ApexSavedInquiry['status']; created_at: string; reference?: string; quote?: string }>>('/rest/v1/apex_inquiries?select=id,payload,status,created_at,reference,quote&order=created_at.desc&limit=100', {}, token);
   if (!Array.isArray(rows)) throw new Error('Invalid inquiry response from the account service.');
   return rows.map(row => parseSavedInquiry({ ...row.payload, id: row.id, status: row.status, createdAt: row.created_at, ...(row.reference ? { reference: row.reference } : {}), ...(row.quote ? { quote: row.quote } : {}) })).filter((row): row is ApexSavedInquiry => row !== null);
  },
 };
}
