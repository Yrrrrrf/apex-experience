import { deepEqual, equal, ok, throws } from 'node:assert/strict';
import { createDemoAccount, demoStorageKey } from './demo.ts';
import { initialInquiry } from './booking.ts';
import type { ApexDemoConfig } from './types.ts';
const config: ApexDemoConfig = {
 enabled:true,namespace:'test-apex',persona:{id:'demo-user',name:'Alex Example',email:'demo@apex.example'},credentials:{email:'demo@apex.example',password:'ApexDemo2026!'},
 records:[
  {id:'future',dateOffsetDays:7,experienceId:'la-marquesa',people:2,language:'es',pickup:'',dropoff:'',occasion:'',notes:'Fictional',status:'confirmed',reference:'R-201'},
  {id:'past',dateOffsetDays:-30,experienceId:'la-marquesa',people:4,language:'en',pickup:'',dropoff:'',occasion:'',notes:'Fictional',status:'completed',reference:'T-301'},
 ],
};
const now = () => new Date('2026-10-23T04:30:00Z');
function setup(){let n=0;return createDemoAccount(config,{now,id:()=>String(++n)});}
Deno.test('demo validates explicit public credentials and preserves fictional account identity',()=>{
 const demo=setup();
 equal(Boolean(demo.user),false);
 throws(()=>demo.signIn('real@example.com',config.credentials.password));
 throws(()=>demo.signIn(config.credentials.email,'wrong-password'));
 demo.signIn(config.credentials.email,config.credentials.password);
 equal(demo.user?.id,config.persona.id);
 equal(demo.records.filter(r=>r.status==='confirmed').length,1);
 ok(demo.records.every(r=>r.source==='demo'&&r.isDemo&&r.reference?.startsWith('DEMO-')));
});
Deno.test('demo registration creates only local preview, confirmation requires a current preview',()=>{
 const demo=setup();
 throws(()=>demo.confirmSignup());
 throws(()=>demo.signUp('A Real Person','person@example.com','private-password'));
 demo.signUp('Ignored supplied name',config.credentials.email,config.credentials.password);
 equal(demo.snapshot.pendingSignup,true);equal(Boolean(demo.user),false);
 equal(demo.outbox[0].to,'demo@apex.example');equal(demo.outbox[0].kind,'confirmation');
 ok(demo.outbox[0].body.es.includes('No se ha enviado'));
 throws(()=>demo.signIn(config.credentials.email,config.credentials.password));
 demo.confirmSignup(demo.outbox[0].id);
 equal(demo.snapshot.pendingSignup,false);equal(demo.user?.name,config.persona.name);
 const raw=demo.serialize();
 equal(raw.includes(config.credentials.password),false);equal(raw.includes('Ignored supplied name'),false);
});
Deno.test('demo recovery walks through preview and password step without retaining password',()=>{
 const demo=setup();
 throws(()=>demo.updatePassword('AnyNewPassword!'));
 demo.requestRecovery(config.credentials.email);
 equal(demo.snapshot.recoveryStep,'requested');equal(demo.outbox[0].kind,'recovery');
 demo.beginRecovery(demo.outbox[0].id);equal(demo.snapshot.recoveryStep,'password');
 throws(()=>demo.updatePassword('short'));
 demo.updatePassword('UniqueInputNotStored!');
 equal(demo.snapshot.recoveryStep,'none');ok(demo.user);
 equal(demo.serialize().includes('UniqueInputNotStored!'),false);
 throws(()=>demo.signIn(config.credentials.email,'UniqueInputNotStored!'));
 demo.signIn(config.credentials.email,config.credentials.password);
});
Deno.test('demo saves and restores only its own namespace and guest payload shapes',()=>{
 const demo=setup();
 equal(demoStorageKey(config),'apex.demo.account.v1.test-apex');
 throws(()=>demo.saveInquiry({...initialInquiry(),date:'2026-10-24'}));
 demo.signIn(config.credentials.email,config.credentials.password);
 const inquiry=demo.saveInquiry({...initialInquiry(),date:'2026-10-24',notes:'Local demo draft'});
 equal(inquiry.status,'draft');equal(inquiry.source,'demo');
 const raw=demo.serialize();
 equal(raw.includes('access_token'),false);equal(raw.includes('refresh_token'),false);
 const restored=setup();ok(restored.restore(raw));ok(restored.user);
 equal(restored.records.filter(r=>r.id===inquiry.id).length,1);
 restored.removeInquiry(inquiry.id);equal(restored.records.some(r=>r.id===inquiry.id),false);
});
Deno.test('malformed demo state safely resets; stale sample dates regenerate relative to current date',()=>{
 const demo=setup();demo.signIn(config.credentials.email,config.credentials.password);
 const raw=demo.serialize();
 for(const bad of ['{','null','[]','{"version":99}', 'x'.repeat(1_000_001)]){equal(demo.restore(bad),false);equal(Boolean(demo.user),false);equal(demo.records.length,2);}
 const next=createDemoAccount(config,{now:()=>new Date('2027-08-11T15:00:00Z')});
 ok(next.restore(raw));ok(next.records.find(r=>r.status==='confirmed')!.date>'2027-08-11');ok(next.records.find(r=>r.status==='completed')!.date<'2027-08-11');
});
Deno.test('signout clears transient demonstration flows, keeps records, and does not mutate through getters',()=>{
 const demo=setup();demo.signIn(config.credentials.email,config.credentials.password);
 const records=demo.records;records[0].status='cancelled';equal(demo.records[0].status,'confirmed');
 demo.requestRecovery(config.credentials.email);demo.beginRecovery();demo.signOut();
 equal(Boolean(demo.user),false);equal(demo.snapshot.recoveryStep,'none');equal(demo.outbox.length,0);equal(demo.records.length,2);
 const next=setup();next.restore(demo.serialize());equal(next.user,null);deepEqual(next.outbox,[]);
});
