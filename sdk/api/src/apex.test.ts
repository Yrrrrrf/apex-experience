import { deepEqual, equal, rejects } from 'node:assert/strict';
import { createApexApi } from './apex.ts';
import { initialInquiry } from '../../core/src/apex/booking.ts';
import type { ApexConfig } from '../../core/src/apex/types.ts';
const config = {services:{supabaseUrl:'https://example.supabase.co',supabaseAnonKey:'public-anon-key'}} as ApexConfig;
Deno.test('unconfigured accounts fail before making any request', async () => {
 let requests = 0;
 const api=createApexApi({} as ApexConfig, (()=>{requests++;throw new Error('Unexpected network request');}) as typeof fetch);
 equal(api.configured,false);
 await rejects(api.signIn('a@example.com','password'), /not configured/);
 equal(requests,0);
});
Deno.test('Supabase password auth uses public key and grant endpoint without persisting password', async () => {
 const calls:Array<{url:string;options:RequestInit}>=[];
 const api=createApexApi(config,(async (input,options) => {
  calls.push({url:String(input),options:options??{}});
  return new Response(JSON.stringify({access_token:'access',refresh_token:'refresh',expires_in:3600,user:{id:'user-id',email:'a@example.com',user_metadata:{display_name:'A'}}}),{status:200});
 }) as typeof fetch);
 const result=await api.signIn('a@example.com','not-real');
 equal(calls[0].url,'https://example.supabase.co/auth/v1/token?grant_type=password');
 deepEqual(JSON.parse(String(calls[0].options.body)),{email:'a@example.com',password:'not-real'});
 equal((calls[0].options.headers as Record<string,string>).apikey,'public-anon-key');
 equal(result.user.name,'A');equal(result.session.access_token,'access');
});
Deno.test('saved inquiry writes exclude status and operator fields; malformed server rows are rejected',async()=>{
 const inquiry={...initialInquiry(),date:'2026-10-24'};
 let body:Record<string,unknown>={};
 const api=createApexApi(config,(async(_input,options)=>{
  body=JSON.parse(String(options?.body));
  return new Response(JSON.stringify([{id:'record-1',payload:inquiry,status:'draft',created_at:'2026-10-22T12:00:00Z'}]),{status:201});
 }) as typeof fetch);
 const saved=await api.saveInquiry(inquiry,'user-id','user-access-token');
 deepEqual(Object.keys(body).sort(),['payload','user_id']);equal(saved.status,'draft');
 const invalid=createApexApi(config,(async()=>new Response(JSON.stringify([{id:'x',payload:{},status:'draft',created_at:'today'}]),{status:201})) as typeof fetch);
 await rejects(invalid.saveInquiry(inquiry,'user-id','token'), /Invalid inquiry record/);
});

Deno.test('live persistence rejects marked demonstration records before any network request', async () => {
 let requests=0;
 const api=createApexApi(config, (async()=>{requests++;return new Response('[]');}) as typeof fetch);
 const sample={...initialInquiry(),date:'2026-10-24',source:'demo' as const,isDemo:true};
 await rejects(api.saveInquiry(sample,'live-user','live-token'), /cannot be sent to the live service/);
 equal(requests,0);
});
