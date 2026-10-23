# APEX media provenance

The images and fonts in `static/assets` were retrieved from the public APEX Experience website for the requested reproduction on 22 October 2026. Original media paths are retained. No logo was copied or generated: put the supplied logo at `static/logo.svg`.

## Paths used by the app

- Background: `/assets/forest.webp` (byte-identical alias of the original `forest-detail.webp`); mobile original `/assets/forest-detail-mobile.webp`.
- Fonts: `/assets/fonts/manrope.ttf` and `/assets/fonts/space-grotesk.ttf`.
- Destinations: `/assets/destinations/{cdmx,quintana-roo,hidalgo,jalisco,baja-california,oaxaca}.webp`. Jalisco aliases the original `guadalajara.webp`.
- Conceptual destination galleries: `/assets/destinations/editorial/{destination}-{1,2}.webp`. Jalisco aliases Guadalajara.
- Experience galleries: `/assets/experiences/{la-marquesa,vuelo-en-helicoptero,lucha-libre,gastronomia}-{1..5}.webp`.
- Detailed La Marquesa hero: `/assets/la-marquesa/portada-paisaje.jpg`.

The alias map is in `static/assets/asset-aliases.json`. Original WebP aliases are copied without recompression. JPEG gallery aliases are encoded as WebP quality 92; originals are retained. Total assets: about 18.7 MB.

## Image meaning

Destination editorial images and the lucha libre / gastronomic galleries are conceptual AI-generated illustrations in the source site. They are not evidence of a confirmed activity, venue or itinerary. The helicopter gallery consists of reference photography, including a cabin photograph taken in Rio de Janeiro; it does not identify APEX’s actual aircraft or guarantee a route. Preserve these disclosures in customer-facing copy.

## Source attribution

Attributions below are the photographer and license credits published by APEX. Original image modifications already present at the source include resizing, WebP conversion, and display cropping. The additional gallery aliases use WebP conversion as noted above.

| Local image | Photographer | License | Original source |
| --- | --- | --- | --- |
| `destinations/cdmx.webp` | Agmoreno26 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [Palacio Bellas Artes](https://commons.wikimedia.org/wiki/File:Palacio_Bellas_Artes_-_Mexico_City.jpg) |
| `destinations/quintana-roo.webp` | Luka Peternel | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Cancún beach](https://commons.wikimedia.org/wiki/File:Cancun-beach-Mexico-2016-Luka-Peternel.jpg) |
| `destinations/hidalgo.webp` | Diego Delso | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [Prismas Basálticos](https://commons.wikimedia.org/wiki/File:Prismas_Bas%C3%A1lticos,_Huasca_de_Ocampo,_Hidalgo,_M%C3%A9xico,_2013-10-10,_DD_10.JPG) |
| `destinations/guadalajara.webp`, `destinations/jalisco.webp` | Sergio Estrada Flores | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | [Catedral de Guadalajara](https://commons.wikimedia.org/wiki/File:Catedral_de_Guadalajara,_Jalisco.jpg) |
| `destinations/baja-california.webp` | Cbojorquez75 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Valle de Guadalupe](https://commons.wikimedia.org/wiki/File:Valle_de_Guadalupe.jpg) |
| `destinations/oaxaca.webp` | LBM1948 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Santo Domingo](https://commons.wikimedia.org/wiki/File:Oaxaca_de_Ju%C3%A1rez,_Santo_Domingo_1.jpg) |
| `tours/helicoptero/cdmx-aerea.jpg` | LBM1948 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Ciudad de México, aérea 1](https://commons.wikimedia.org/wiki/File:Ciudad_de_M%C3%A9xico,_a%C3%A9rea_1.jpg) |
| `tours/helicoptero/cabina.jpg` | Matheus Bertelli | [Pexels License](https://www.pexels.com/license/) | [Two People Inside A Helicopter](https://www.pexels.com/photo/two-people-inside-a-helicopter-2868215/) |
| `tours/helicoptero/catedral.jpg` | ProtoplasmaKid | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Catedral Metropolitana aerial](https://commons.wikimedia.org/wiki/File:Toma_a%C3%A9rea_de_la_Catedral_Metropolitana_de_la_Ciudad_de_M%C3%A9xico_1.jpg) |
| `tours/helicoptero/vuelo.jpg` | Julia Volk | [Pexels License](https://www.pexels.com/license/) | [Helicopter flying](https://www.pexels.com/photo/helicopter-flying-in-blue-cloudless-sky-7099633/) |

Private outing photographs, forest images, flags and conceptual illustrations were served by the APEX site without separate per-file license metadata in its public pages. Their source is recorded below. Font binaries are the same Manrope and Space Grotesk files served by APEX.

## Font licenses

The embedded font metadata identifies both families as SIL Open Font License 1.1. Copyright: 2019 The Manrope Project Authors; 2020 The Space Grotesk Project Authors. Complete license copies from the Google Fonts source repository accompany the fonts as `static/assets/fonts/manrope-OFL.txt` and `static/assets/fonts/spacegrotesk-OFL.txt`.

## Download inventory

| Public path | Bytes | SHA-256 |
| --- | ---: | --- |
| [/assets/bosque.jpg](https://apexexperience.com.mx/assets/bosque.jpg) | 359238 | `e7d5254add8e511b4eafd038de9a9980234216a682cb075f76e6249afc82f6ae` |
| [/assets/clientes-caballos.jpg](https://apexexperience.com.mx/assets/clientes-caballos.jpg) | 250376 | `988876124d8d52128071a99373ee2b6b87ef827c1e0562f8c9e97985e9c05cf3` |
| [/assets/clientes-sendero.jpg](https://apexexperience.com.mx/assets/clientes-sendero.jpg) | 348279 | `445ac2a33e08fb192ede43f9366005879d60886be9a6f8f3e3d11fced2f93f82` |
| [/assets/destinations/baja-california.webp](https://apexexperience.com.mx/assets/destinations/baja-california.webp) | 276418 | `e5193bd5a07be3e749b24426a426d025671848f13624e07712ce009f515bd74b` |
| [/assets/destinations/cdmx.webp](https://apexexperience.com.mx/assets/destinations/cdmx.webp) | 331330 | `6f310621edf12d74e11be6b4334589fac9179a89f083602347f6659fea7e6a33` |
| [/assets/destinations/editorial/baja-california-1.webp](https://apexexperience.com.mx/assets/destinations/editorial/baja-california-1.webp) | 247448 | `8c992d90f5f189623cdba54649993818b2c6942d9998d7bdd6ca9ed94ee40266` |
| [/assets/destinations/editorial/baja-california-2.webp](https://apexexperience.com.mx/assets/destinations/editorial/baja-california-2.webp) | 235244 | `543b01e7f0c87c1d315016d8645ed5f6fa05013da893f0f5bcd868529bdd7afd` |
| [/assets/destinations/editorial/cdmx-1.webp](https://apexexperience.com.mx/assets/destinations/editorial/cdmx-1.webp) | 119686 | `e27550d26136b94190a9d429d797d3ad30c6696ebf3981482d4a3e675dbaeea8` |
| [/assets/destinations/editorial/cdmx-2.webp](https://apexexperience.com.mx/assets/destinations/editorial/cdmx-2.webp) | 221630 | `26e11f028e7fbfdf0e099a6e65b0e6921d89079f0c8f27bb2ba477a2081027a5` |
| [/assets/destinations/editorial/guadalajara-1.webp](https://apexexperience.com.mx/assets/destinations/editorial/guadalajara-1.webp) | 257650 | `7f5153d53dc634dcb55d2f6051e9500f8170976b1cf0e187bf40918595af58f3` |
| [/assets/destinations/editorial/guadalajara-2.webp](https://apexexperience.com.mx/assets/destinations/editorial/guadalajara-2.webp) | 308916 | `6dbeea4048a6dec391c2ba40ba861585737da5960ce74343695dd4e08c5bb526` |
| [/assets/destinations/editorial/hidalgo-1.webp](https://apexexperience.com.mx/assets/destinations/editorial/hidalgo-1.webp) | 257210 | `e82485d915a6f2b16a46c71ece61c9d21c00174e2a62d1be2203aabe4ec8c5d9` |
| [/assets/destinations/editorial/hidalgo-2.webp](https://apexexperience.com.mx/assets/destinations/editorial/hidalgo-2.webp) | 142988 | `a1162acc93b34f71dc1a657120ab9b604e6606d2c9d1991c66d83bdaed13ade8` |
| [/assets/destinations/editorial/oaxaca-1.webp](https://apexexperience.com.mx/assets/destinations/editorial/oaxaca-1.webp) | 206422 | `35580d38a3ded657c5ec0839fbc0b60f1133ae1b17bc9be13c1df576c0b59905` |
| [/assets/destinations/editorial/oaxaca-2.webp](https://apexexperience.com.mx/assets/destinations/editorial/oaxaca-2.webp) | 237672 | `5ca8c74ad91071d602e33db5871e4b488bf2173332061050eef1a6ea0e9ddc88` |
| [/assets/destinations/editorial/quintana-roo-1.webp](https://apexexperience.com.mx/assets/destinations/editorial/quintana-roo-1.webp) | 211016 | `44fad2c57df7dea224e1845fc3e0fa77e8c1f9ffc59b5f59eee9a973b4a445c9` |
| [/assets/destinations/editorial/quintana-roo-2.webp](https://apexexperience.com.mx/assets/destinations/editorial/quintana-roo-2.webp) | 235052 | `42f5830fb94a5f2900b7f9620762bcbdc090fa1a5336b24277d981077bb888e8` |
| [/assets/destinations/guadalajara.webp](https://apexexperience.com.mx/assets/destinations/guadalajara.webp) | 369606 | `7a84602403b6b819f3e050cde311685097b5b7b1b9eb9094570a593dba026cbf` |
| [/assets/destinations/hidalgo.webp](https://apexexperience.com.mx/assets/destinations/hidalgo.webp) | 310672 | `c546cfea2d1dea6d6d88ceb29af0002271735b3797bb083f34a90532d7bc16dd` |
| [/assets/destinations/oaxaca.webp](https://apexexperience.com.mx/assets/destinations/oaxaca.webp) | 450526 | `5de9e34b192b1cada4334a3260c82b011449016818f6bb45f00d77e6e83b8067` |
| [/assets/destinations/quintana-roo.webp](https://apexexperience.com.mx/assets/destinations/quintana-roo.webp) | 133332 | `883b7579d8c4006e5be6de333695e3eeb261a7af4b98d31424f5ba263a410a96` |
| [/assets/flag-mx.svg](https://apexexperience.com.mx/assets/flag-mx.svg) | 84753 | `9dbc8ad8b35e52ce7cb686d5cd93bd95e4c0dd8505c184186a740148ffd34901` |
| [/assets/fonts/manrope.ttf](https://apexexperience.com.mx/assets/fonts/manrope.ttf) | 164700 | `3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6` |
| [/assets/fonts/space-grotesk.ttf](https://apexexperience.com.mx/assets/fonts/space-grotesk.ttf) | 136676 | `acad6de1fc93436f5c0f1f4137751ef04f1aea3063e7036535970ffcfbd79f72` |
| [/assets/forest-detail-mobile.webp](https://apexexperience.com.mx/assets/forest-detail-mobile.webp) | 422010 | `d6563b95df35f77eccb86337cb086808a0f299e39fb6643dba9ad92101f3aaa0` |
| [/assets/forest-detail.webp](https://apexexperience.com.mx/assets/forest-detail.webp) | 727932 | `f3d5a1e2f1a16952378f10b344e995338cc66c896aac0fb7e799c61d72852582` |
| [/assets/la-marquesa/aventura-compartida.jpg](https://apexexperience.com.mx/assets/la-marquesa/aventura-compartida.jpg) | 354598 | `30ff193b6397dfe4e41b98e33feef77aab4fb93d94dd25e79dd2327d06cf1154` |
| [/assets/la-marquesa/paseo-caballos.jpg](https://apexexperience.com.mx/assets/la-marquesa/paseo-caballos.jpg) | 186134 | `167f08bc6cf2fdd3e6eb6f5df6c3e825d1d0b4f2c2d7f2d8d2ce8f7203c40717` |
| [/assets/la-marquesa/portada-paisaje.jpg](https://apexexperience.com.mx/assets/la-marquesa/portada-paisaje.jpg) | 305413 | `4a55d16d7b1d51defb50a5805d701f7eb3452e27785a8da156540e1ab8de9c25` |
| [/assets/la-marquesa/recorrido-atv.jpg](https://apexexperience.com.mx/assets/la-marquesa/recorrido-atv.jpg) | 276630 | `9aca17df066e2939095e44a3173409ca203e99a130216257beba3b9d364752cd` |
| [/assets/la-marquesa/vista-bosque.jpg](https://apexexperience.com.mx/assets/la-marquesa/vista-bosque.jpg) | 309622 | `fb095454ed53568beb06b82fafb8860d0352c8459a6dd3eb966b18373369d329` |
| [/assets/momentos.jpg](https://apexexperience.com.mx/assets/momentos.jpg) | 334110 | `a7649d73771112047dc9deac5d92c9f64c582dafe347b6cac1a7ccdcc2cf9ce3` |
| [/assets/paisaje.jpg](https://apexexperience.com.mx/assets/paisaje.jpg) | 372659 | `230f75e700e423a50b63a89ca9779657c20ac84834f530b3dfdca0d495cc9882` |
| [/assets/tours/editorial/food-comal.webp](https://apexexperience.com.mx/assets/tours/editorial/food-comal.webp) | 129986 | `7d88973d6a4ef236b8514d626e4c054b179ba490312ad8bae467dc2d0fc18db9` |
| [/assets/tours/editorial/food-dessert.webp](https://apexexperience.com.mx/assets/tours/editorial/food-dessert.webp) | 146078 | `d1ff51de7b05d47dca91ffcc65daeb6dfff345dc03e739c9e9758019fd900331` |
| [/assets/tours/editorial/food-market.webp](https://apexexperience.com.mx/assets/tours/editorial/food-market.webp) | 248592 | `bbceb4225038b2df60b95de262d3860a1247321e405540b2374bbf9e8f39d53b` |
| [/assets/tours/editorial/food-pozole.webp](https://apexexperience.com.mx/assets/tours/editorial/food-pozole.webp) | 186764 | `057f87b2883e90a98431eaa13a241ace3ec6a66ab08302dc42cb9ff79572c251` |
| [/assets/tours/editorial/food-tacos.webp](https://apexexperience.com.mx/assets/tours/editorial/food-tacos.webp) | 279486 | `eb2530518c4cc2081a4bb8e4e202733bd12bfa663d7ecc80b6e6d58dc44730a5` |
| [/assets/tours/editorial/lucha-action.webp](https://apexexperience.com.mx/assets/tours/editorial/lucha-action.webp) | 99754 | `f1c609ed18830f219154e893e62aba45fd5c87116ab18db1da7d5f5a54bcffcf` |
| [/assets/tours/editorial/lucha-arena.webp](https://apexexperience.com.mx/assets/tours/editorial/lucha-arena.webp) | 166336 | `ecd98053b699cbf712074adfc8f69ab3b6eeae273bb556f76e62b5b93a689bb7` |
| [/assets/tours/editorial/lucha-culture.webp](https://apexexperience.com.mx/assets/tours/editorial/lucha-culture.webp) | 166668 | `e5cc82104a29e740a88a81f60e021dcc6c2d82ecf6e135b01f06abf71ee1f017` |
| [/assets/tours/editorial/lucha-mask.webp](https://apexexperience.com.mx/assets/tours/editorial/lucha-mask.webp) | 147884 | `c66fd97cab757fadf1a6d8adea217f302ed92096700484335c25cb62582ab1cd` |
| [/assets/tours/editorial/lucha-portrait.webp](https://apexexperience.com.mx/assets/tours/editorial/lucha-portrait.webp) | 150460 | `4ae85124d08ec09c031e9a2a1b3762e8ef8ea954f9f4354f9979fca9c940e561` |
| [/assets/tours/helicoptero/cabina.jpg](https://apexexperience.com.mx/assets/tours/helicoptero/cabina.jpg) | 107620 | `42734faa1176ba4ff70c22d1a7394da482b2a4792588d6f77b4517777a94b2f0` |
| [/assets/tours/helicoptero/catedral.jpg](https://apexexperience.com.mx/assets/tours/helicoptero/catedral.jpg) | 333089 | `ce9d76da8a8871117be5dfb4ea4822666ad318153ede5a8b9cc77b18dcdbb28f` |
| [/assets/tours/helicoptero/cdmx-aerea.jpg](https://apexexperience.com.mx/assets/tours/helicoptero/cdmx-aerea.jpg) | 417264 | `fbeabd15f3fd4caad24ee62e0d86dc027a23f6929bd0f48f9898eb5d6beb84a4` |
| [/assets/tours/helicoptero/vuelo.jpg](https://apexexperience.com.mx/assets/tours/helicoptero/vuelo.jpg) | 17866 | `2ac34e7b4a5072504567837879f194154c2eb81e44675629c84e6668af813aa7` |
