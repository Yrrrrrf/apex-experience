# APEX public-reference contract

Reference: https://apexexperience.com.mx/ and its public destinations, experiences, reservation, account and privacy pages, inspected 22 October 2026. This describes public presentation and behavior; it does not establish private backend implementation or real-world tour availability.

## Routes and availability

| Route | Public behavior |
| --- | --- |
| `/` | Six-card destination carousel; featured La Marquesa; about, private routes, corporate proposals, FAQs and contact sections. |
| `/destinos/cdmx/` | Two-image conceptual destination hero; cards for La Marquesa, helicopter flight, upcoming lucha libre and upcoming gastronomic experience. La Marquesa is in Estado de México and is explicitly part of CDMX and surroundings. |
| `/destinos/quintana-roo/` | In development, no reservations open. |
| `/destinos/hidalgo/`, `/destinos/jalisco/`, `/destinos/baja-california/`, `/destinos/oaxaca/` | Coming soon, no reservations open. |
| `/experiencias/la-marquesa/` | Defined private adventure program, operational details, group price table and inquiry preparation. |
| `/experiencias/vuelo-en-helicoptero/` | Quote-only flight inquiry. No fixed public price, flight time, aircraft, route, capacity, helipad, or private/shared guarantee. |
| `/reservar/` | La Marquesa inquiry builder; no payment or instant booking. |
| `/cuenta/` | Sign in and registration entry; advertises saved inquiries, reservations and trips. |
| `/cuenta/recuperar/` | Account recovery. |
| `/privacidad/` | Public privacy disclosure. |

## La Marquesa booking semantics

- Activities: ATV, horseback riding, zipline; all three are part of the private program.
- Venue: Centro Recreativo El Valle del Potrero, La Marquesa, Estado de México.
- Operation: Thursday through Sunday, inquiries at least two calendar days ahead.
- Timezone: America/Mexico_City; stated start/pickup 08:30.
- Standard group size: 2–6 people. Published USD totals: 2 = 697.05; 3 = 1176.98; 4 = 1542.64; 5 = 1908.30; 6 = 2279.67. These are totals per group, not per person.
- Tour language: Spanish or English.
- Pickup and return are optional requests. Empty return means requesting the pickup point; it is not automatic transport acceptance. Transport coverage, exact point and cost are agreed in the quote.
- Special occasion request can select birthday, anniversary or another celebration, with optional notes. It does not change the fixed activity program and may have extra cost.
- Review generates a readable inquiry and encoded WhatsApp link. The final message is not sent automatically. Opening WhatsApp is not a booking or availability confirmation.
- Express APEX confirmation is required; timing, order, requirements, transport, meals, weather, cancellation and rescheduling terms must be agreed before contracting.
- Office/contact address is not the tour meeting point.

## Visual details

- Manrope body font, Space Grotesk display font; original font binaries included.
- Forest photograph behind dark overlays; destination pages switch to the destination photograph.
- Sticky translucent dark navigation: 22px radius, 16px outer margin, 76px desktop inner height, blur(22px).
- Main home carousel uses perspective(1400px), cards up to 760px / 68% wide, clamp(300px,44svh,470px) tall, rotated and scaled adjacent cards.
- CDMX destination heading is a 1fr / 1fr grid with 40px gap; title clamp(3rem,7vw,6rem); conceptual gallery 340px image height desktop, 280px mobile.
- Image carousels have next, previous, index dots and pause; reduced motion can disable animation. Experience galleries include lightbox enlargement.
- Spanish/English control affects content and WhatsApp message language.
- Published media disclosures distinguish AI conceptual imagery from real/reference photography. Asset provenance and licenses are in ASSETS.md.

## Integration boundaries

The original privacy notice names Vercel, Supabase Auth/profile storage, Resend transactional mail and a Stripe test checkout flow. The public current reservation page does not take payments. A faithful standalone implementation must not pretend that unavailable credentials or a simulated Stripe operation created a real account, took money, or confirmed a tour. Guest browser drafts must remain distinct from server records and confirmed reservations.
