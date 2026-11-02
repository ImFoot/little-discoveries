export type Point = [number, number];
export type Rect = { x: number; y: number; width: number; height: number };
export type View = { x: number; y: number; zoom: number };
export type Target = {
  id: string; name: string; preview: string;
  outline: Point[]; holes?: Point[][]; hit: Point[]; hint: Rect;
  inspect: View; crop: Rect; notes?: string;
};
export type Level = {
  id: number; chapter: number; title: string; targetCount: number;
  art: string; thumbnail: string; width: number; height: number;
  status: 'draft' | 'reviewed'; targets: Target[];
  review: { artwork: boolean; geometry: boolean; smallPhone: boolean; notes: string };
};
export type CatalogEntry = {
  id: number; chapter: number; title: string; targetCount: number;
  sample: string; thumbnail: string; status: 'draft' | 'reviewed';
  targetIds: string[];
};
export type Chapter = { id: number; title: string; subtitle: string; color: string };
export type Catalog = { chapters: Chapter[]; levels: CatalogEntry[] };
export type Attempt = { found: string[]; started: boolean; view: View; updated: number; replay: boolean; completed: boolean };
export type Preferences = { sound: boolean; reduceMotion: boolean; largePreviews: boolean; largeText: boolean; markers: boolean };
export type Save = {
  version: 1; updated: number; current: number; completed: number[];
  favorites: number[]; attempts: Record<string, Attempt>;
  preferences: Preferences; catalogScroll: number; onboarded: boolean;
};
