import { deepEqual, equal, ok, throws } from 'node:assert/strict';
import { createDemoAccount, demoStorageKey } from './demo.ts';
import { initialInquiry } from './booking.ts';
import type { ApexDemoConfig } from './types.ts';

const now = () => new Date('2026-10-23T04:30:00Z'); // October 22 in Mexico City.
function fixture(): ApexDemoConfig {
 return {
  enabled: true,
  namespace: 'independent-demo-review',
  persona: { id: 'example-person', name: 'Viajera de ejemplo', email: 'viajera@apex.example' },
  credentials: { email: 'viajera@apex.example', password: 'PublicDemo2026!' },
  records: [
   { ...initialInquiry(), id: 'reservation', status: 'confirmed', dateOffsetDays: 7, reference: 'EXAMPLE-RESERVATION' },
   { ...initialInquiry(), id: 'trip', status: 'completed', dateOffsetDays: -14, reference: 'EXAMPLE-TRIP' },
  ],
 };
}
const create = () => {
 let sequence = 0;
 return createDemoAccount(fixture(), { now, id: () => `review-${++sequence}` });
};

Deno.test('independent review: demo storage never restores a live session or exposes live-looking records', () => {
 const account = create();
 const config = fixture();
 ok(demoStorageKey(config).startsWith('apex.demo.account.'));
 equal(demoStorageKey(config).startsWith('apex.auth.'), false);
 equal(account.restore(JSON.stringify({ access_token: 'LIVE_TOKEN', refresh_token: 'LIVE_REFRESH' })), false);
 equal(account.user, null);
 const payload = account.snapshot;
 payload.records.unshift({
  ...initialInquiry(), id: 'untrusted-import', date: '2026-10-25', createdAt: now().toISOString(),
  status: 'confirmed', reference: 'REAL-REFERENCE', source: 'live', isDemo: false,
 });
 equal(account.restore(JSON.stringify(payload)), true);
 for (const record of account.records) {
  equal(record.source, 'demo');
  equal(record.isDemo, true);
  if (record.reference) ok(record.reference.startsWith('DEMO-'));
 }
 const serialized = account.serialize();
 equal(serialized.includes('LIVE_TOKEN'), false);
 equal(serialized.includes('access_token'), false);
 equal(serialized.includes('refresh_token'), false);
});

Deno.test('independent review: malformed restoration clears auth and returns a usable sample baseline', () => {
 for (const raw of ['not json', 'null', '[]', '{}', JSON.stringify({ version: 999 }), 'x'.repeat(1_000_001)]) {
  const account = create();
  account.signIn(fixture().credentials.email, fixture().credentials.password);
  equal(account.restore(raw), false);
  equal(account.user, null);
  equal(account.snapshot.recoveryStep, 'none');
  equal(account.snapshot.pendingSignup, false);
  equal(account.outbox.length, 0);
  equal(account.records.length, fixture().records.length);
  account.signIn(fixture().credentials.email, fixture().credentials.password);
  ok(account.user);
 }
});

Deno.test('independent review: signup and recovery previews never persist supplied identity or password', () => {
 const account = create();
 const config = fixture();
 throws(() => account.signUp('Private real name', 'real.person@example.com', config.credentials.password));
 throws(() => account.signIn(config.credentials.email, 'IncorrectPassword!'));
 equal(account.user, null);
 account.signUp('Private real name', config.credentials.email, config.credentials.password);
 equal(account.snapshot.pendingSignup, true);
 equal(account.user, null);
 equal(account.outbox[0].to, config.credentials.email);
 equal(account.outbox[0].kind, 'confirmation');
 equal(account.serialize().includes('Private real name'), false);
 equal(account.serialize().includes(config.credentials.password), false);
 account.confirmSignup(account.outbox[0].id);
 account.requestRecovery(config.credentials.email);
 equal(account.user, null);
 account.beginRecovery(account.outbox[0].id);
 throws(() => account.updatePassword('short'));
 const typedPassword = 'DistinctRecoverySecretNotForStorage123!';
 account.updatePassword(typedPassword);
 equal(account.serialize().includes(typedPassword), false);
 account.signOut();
 equal(account.snapshot.recoveryStep, 'none');
 equal(account.snapshot.pendingSignup, false);
 equal(account.outbox.length, 0);
 throws(() => account.signIn(config.credentials.email, typedPassword));
 account.signIn(config.credentials.email, config.credentials.password);
 ok(account.user);
});

Deno.test('independent review: custom demo inquiry save/remove survives reload without changing sample reservations', () => {
 const account = create();
 const config = fixture();
 account.signIn(config.credentials.email, config.credentials.password);
 const count = account.records.length;
 const draft = account.saveInquiry({ ...initialInquiry(), date: '2026-10-25', pickup: 'Example hotel only' });
 equal(account.records.length, count + 1);
 equal(draft.status, 'draft');
 equal(draft.source, 'demo');
 equal(draft.isDemo, true);
 const restored = create();
 equal(restored.restore(account.serialize()), true);
 ok(restored.user);
 ok(restored.records.some(record => record.id === draft.id));
 equal(restored.records.filter(record => record.status === 'confirmed').length, 1);
 const protectedReservation = restored.records.find(record => record.status === 'confirmed')!;
 restored.removeInquiry(protectedReservation.id);
 equal(restored.records.filter(record => record.status === 'confirmed').length, 1);
 restored.removeInquiry(draft.id);
 equal(restored.records.length, count);
 const afterDelete = create();
 afterDelete.restore(restored.serialize());
 equal(afterDelete.records.some(record => record.id === draft.id), false);
});

Deno.test('independent review: exposed snapshots cannot mutate internal demo state', () => {
 const account = create();
 const original = account.snapshot;
 const snapshot = account.snapshot;
 const records = account.records;
 snapshot.signedIn = true;
 snapshot.records[0].source = 'live';
 records.splice(0, records.length);
 deepEqual(account.snapshot, original);
 equal(account.user, null);
 equal(account.records.length, 2);
});
