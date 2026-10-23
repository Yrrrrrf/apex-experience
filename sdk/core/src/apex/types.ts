/** Content belongs to the application; SDK components only consume this contract. */
export type ApexLocale = 'es' | 'en';
export interface ApexText { es: string; en: string }
export interface ApexDestination {
 id: string;
 name: string;
 description: ApexText;
 image: string;
 gallery: string[];
 status: 'available' | 'coming-soon';
 experienceIds: string[];
}
export interface ApexExperience {
 id: string;
 destinationId: string;
 title: ApexText;
 description: ApexText;
 image: string;
 gallery: string[];
 status: 'available' | 'quote' | 'coming-soon';
 kind: 'adventure' | 'flight' | 'culture' | 'food';
 activities: ApexText[];
 activityImages?: string[];
 communityImages?: string[];
 mapUrl?: string;
 location: ApexText;
 meeting: ApexText;
}
export interface ApexConfig {
 brand: { name: string; tagline: ApexText; logo: string; background: string; backgroundMobile?: string; promoImage?: string; aboutImage?: string; attributionsUrl?: string };
 contact: { phone: string; whatsapp: string; instagram: string; address: string; mapUrl: string; mapEmbed: string };
 destinations: ApexDestination[];
 experiences: ApexExperience[];
 prices: Record<number, number>;
 copy: Record<string, ApexText>;
 services?: { supabaseUrl?: string; supabaseAnonKey?: string };
 demo?: ApexDemoConfig;
 account?: ApexAccountContent;
}
export interface ApexInquiry {
 experienceId: string;
 date: string;
 people: number;
 language: ApexLocale;
 pickup: string;
 dropoff: string;
 occasion: string;
 notes: string;
}
export interface ApexSavedInquiry extends ApexInquiry {
 id: string;
 createdAt: string;
 status: 'draft' | 'requested' | 'quoted' | 'confirmed' | 'completed' | 'cancelled';
 reference?: string;
 quote?: string;
 source?: 'demo' | 'live';
 isDemo?: boolean;
}
export interface ApexUser { id: string; email: string; name: string }
export type ApexValidationErrors = Partial<Record<keyof ApexInquiry, string>>;

export interface ApexDemoConfig {
 enabled: boolean;
 namespace: string;
 persona: ApexUser;
 credentials: { email: string; password: string };
 records: Array<Omit<ApexSavedInquiry, 'id' | 'date' | 'createdAt'> & { id: string; dateOffsetDays: number; createdOffsetDays?: number }>;
}
export interface ApexAccountContent {
 heroImage: string;
 heroTitle: ApexText;
 heroIntro: ApexText;
 profileLocation?: string;
 memberSince?: string;
}
export interface ApexDemoMail {
 id: string;
 to: string;
 subject: ApexText;
 body: ApexText;
 kind: 'confirmation' | 'recovery';
 createdAt: string;
 consumed: boolean;
}
export interface ApexDemoSnapshot {
 version: 1;
 signedIn: boolean;
 emailConfirmed: boolean;
 pendingSignup: boolean;
 recoveryStep: 'none' | 'requested' | 'password';
 records: ApexSavedInquiry[];
 outbox: ApexDemoMail[];
}
