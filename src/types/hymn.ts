export interface HymnVerse {
  number: number;
  lines: string[];
  englishLines?: string[];
}

export interface Hymn {
  id: string;
  number: number;
  title: string;
  alternateTitle?: string;
  category: string;
  verses: HymnVerse[];
  chorus?: string[];
  englishChorus?: string[];
  scripture?: {
    text: string;
    reference: string;
  };
  tags?: string[];
  meter?: string;
  tune?: string;
  key?: string;
  author?: string;
}

export type TextSize = 'sm' | 'md' | 'lg' | 'xl';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ReaderSettings {
  textSize: TextSize;
  keepScreenAwake: boolean;
  serifLyrics: boolean;
  showVerseNumbers: boolean;
}
