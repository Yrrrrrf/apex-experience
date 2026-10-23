import { deepEqual, equal, match, ok } from 'node:assert/strict';
import { availableDate, formatInquiry, groupPrice, initialInquiry, mexicoToday, minimumInquiryDate, parseCalendarDate, parseSavedInquiry, validateInquiry, whatsappUrl } from './booking.ts';
import type { ApexConfig } from './types.ts';
const config: ApexConfig = {
 brand: {name:'APEX',tagline:{es:'',en:''},logo:'/logo.svg',background:''},
 contact: {phone:'',whatsapp:'52 722 671 0947',instagram:'',address:'',mapUrl:'',mapEmbed:''}, destinations: [], copy: {},
 experiences: [{id:'la-marquesa',destinationId:'cdmx',title:{es:'La Marquesa',en:'La Marquesa'},description:{es:'',en:''},image:'',gallery:[],status:'available',kind:'adventure',activities:[{es:'ATV',en:'ATVs'}],location:{es:'',en:''},meeting:{es:'',en:''}}, {id:'vuelo-en-helicoptero',destinationId:'cdmx',title:{es:'Vuelo',en:'Flight'},description:{es:'',en:''},image:'',gallery:[],status:'quote',kind:'flight',activities:[],location:{es:'',en:''},meeting:{es:'',en:''}}],
 prices: {2:697.05,3:1176.98,4:1542.64,5:1908.30,6:2279.67},
};
const now = new Date('2026-10-23T04:30:00Z'); // Still October 22 in Mexico City.
Deno.test('Mexico City dates remain correct across UTC midnight and month/year boundaries', () => {
 equal(mexicoToday(now), '2026-10-22');
 equal(minimumInquiryDate(now), '2026-10-24');
 equal(minimumInquiryDate(new Date('2026-12-31T18:00:00Z')), '2027-01-02');
 equal(parseCalendarDate('2026-02-30'), null);
 equal(parseCalendarDate('2026-1-05'), null);
 equal(parseCalendarDate('2028-02-29')?.toISOString().slice(0,10), '2028-02-29');
});
Deno.test('La Marquesa respects two calendar days and Thursday–Sunday operation', () => {
 equal(availableDate('2026-10-23',now),false);
 equal(availableDate('2026-10-24',now),true);
 equal(availableDate('2026-10-25',now),true);
 equal(availableDate('2026-10-26',now),false);
 equal(availableDate('2026-10-29',now),true);
 const inquiry = {...initialInquiry(),date:'2026-10-24'};
 deepEqual(validateInquiry(inquiry,config,now),{});
 ok(validateInquiry({...inquiry,people:1},config,now).people);
 ok(validateInquiry({...inquiry,people:2.5},config,now).people);
 ok(validateInquiry({...inquiry,experienceId:'lucha-libre'},config,now).experienceId);
});
Deno.test('flight inquiry is quote-only and does not inherit the adventure calendar/prices', () => {
 const inquiry={...initialInquiry('vuelo-en-helicoptero'),date:'2026-10-26',people:1};
 deepEqual(validateInquiry(inquiry,config,now),{});
 const message = formatInquiry(inquiry,config);
 match(message,/tarifa por persona/);
 equal(message.includes('697.05'),false);
 equal(message.includes('Programa incluido'),false);
});
Deno.test('group prices and WhatsApp messages preserve exact totals and encoded user input', () => {
 equal(groupPrice(2,config),697.05); equal(groupPrice(6,config),2279.67);
 equal(groupPrice(7,config),null); equal(groupPrice(2.5,config),null);
 const inquiry={...initialInquiry(),date:'2026-10-24',pickup:'Hotel A & B',occasion:'Cumpleaños 🎂',notes:'Hola\nDos líneas'};
 const message = formatInquiry(inquiry,config);
 match(message,/Regreso solicitado: Hotel A & B/);
 const url = new URL(whatsappUrl(config,message));
 equal(url.hostname,'wa.me');equal(url.pathname,'/527226710947');equal(url.searchParams.get('text'),message);
});
Deno.test('untrusted saved records must include every field used by UI and message formatters', () => {
 equal(parseSavedInquiry({id:'x',date:'2026-10-24',experienceId:'la-marquesa',people:2}),null);
 const saved={...initialInquiry(),date:'2026-10-24',id:'draft-1',createdAt:'2026-10-22T12:00:00Z',status:'draft'};
 ok(parseSavedInquiry(saved));
 equal(parseSavedInquiry({...saved,language:'xx'}),null);
 equal(parseSavedInquiry({...saved,status:'admin'}),null);
 equal(parseSavedInquiry({...saved,pickup:null}),null);
 equal(parseSavedInquiry({...saved,notes:'x'.repeat(1501)}),null);
});
