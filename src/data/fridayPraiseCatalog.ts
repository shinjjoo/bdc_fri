import { SCORE_PAGES } from './pdfCatalog';

export interface CatalogSong {
  id: string;
  title: string;
  key: 'G' | 'C' | 'E';
  type: '빠른 찬송가' | '느린 찬송가' | '빠른 복음성가' | '느린 복음성가';
  consonant: string;
  bookNo: number; // 0 ~ 97쪽 악보 번호
  page?: number;
  hymnNo?: string;
}

export const KOREAN_CONSONANTS = [
  '전체',
  'ㄱ',
  'ㄴ',
  'ㄷ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅅ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

export const PRAISE_KEYS = ['전체', 'G', 'C', 'E'] as const;

export const PRAISE_TYPES = [
  '전체',
  '빠른 찬송가',
  '느린 찬송가',
  '빠른 복음성가',
  '느린 복음성가',
] as const;

const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const CHOSUNG_MAP: Record<string, string> = {
  'ㄲ': 'ㄱ',
  'ㄸ': 'ㄷ',
  'ㅃ': 'ㅂ',
  'ㅆ': 'ㅅ',
  'ㅉ': 'ㅈ',
};

export function getChosung(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11171) {
      const chosungIndex = Math.floor(code / 588);
      const rawChosung = CHOSUNG_LIST[chosungIndex] || '';
      result += CHOSUNG_MAP[rawChosung] || rawChosung;
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

export function getFirstConsonant(title: string): string {
  const chosungs = getChosung(title.trim().replace(/^[0-9\s([\]'"]+/, ''));
  if (!chosungs) return 'ㄱ';
  const first = chosungs.charAt(0);
  return CHOSUNG_MAP[first] || first;
}

// 100% synchronized with SCORE_PAGES (All 101 pages of Friday Prayer Songbook)
export const FRIDAY_PRAISE_CATALOG: CatalogSong[] = SCORE_PAGES.flatMap((page) => {
  if (page.key === 'INDEX' || !page.songs || page.songs.length === 0) return [];
  return page.songs.map((s) => ({
    id: s.id,
    title: s.title,
    key: s.key,
    type: (s.type as any) || (s.hymnNo ? '빠른 찬송가' : '느린 복음성가'),
    consonant: getFirstConsonant(s.title),
    bookNo: s.bookNo,
    page: page.pageNumber,
    hymnNo: s.hymnNo,
  }));
});

// Helper to get unique numbers available for a key
export function getNumbersForKey(key: string): number[] {
  const songs = key === '전체' 
    ? FRIDAY_PRAISE_CATALOG 
    : FRIDAY_PRAISE_CATALOG.filter((s) => s.key === key);
  
  const numSet = new Set<number>();
  songs.forEach((s) => {
    if (s.bookNo !== undefined && s.bookNo !== null) numSet.add(s.bookNo);
  });

  return Array.from(numSet).sort((a, b) => a - b);
}

// Helper to get songs mapped to a specific key and book number
export function getSongsByNumber(key: string, bookNo: number): CatalogSong[] {
  return FRIDAY_PRAISE_CATALOG.filter((s) => {
    const keyMatch = key === '전체' || s.key === key;
    return keyMatch && s.bookNo === bookNo;
  });
}
