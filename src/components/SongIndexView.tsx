import React, { useState, useMemo } from 'react';
import {
  CatalogSong,
  FRIDAY_PRAISE_CATALOG,
  KOREAN_CONSONANTS,
  PRAISE_KEYS,
  getChosung,
  getNumbersForKey,
} from '../data/fridayPraiseCatalog';
import { findPageForSong } from '../data/pdfCatalog';
import { CueSignal, SongItem } from '../types';
import { soundManager } from '../utils/audioVibration';
import {
  Search,
  Music,
  Radio,
  Check,
  CheckCircle2,
  BookOpen,
  Filter,
} from 'lucide-react';

interface SongIndexViewProps {
  onSendCue: (cue: Omit<CueSignal, 'id' | 'timestamp' | 'acknowledgedBy'>) => void;
  onSelectSong: (song: SongItem, page: number) => void;
  currentSongTitle?: string;
  senderName: string;
}

export const SongIndexView: React.FC<SongIndexViewProps> = ({
  onSendCue,
  onSelectSong,
  currentSongTitle = '',
  senderName,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('전체');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedConsonant, setSelectedConsonant] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSentSongId, setLastSentSongId] = useState<string | null>(null);

  // Available numbers for currently selected key
  const availableNumbers = useMemo(() => {
    return getNumbersForKey(selectedKey);
  }, [selectedKey]);

  // Filtered Songs List
  const filteredSongs = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    const queryChosung = getChosung(trimmed);
    const queryAsNumber = !isNaN(Number(trimmed)) && trimmed !== '' ? Number(trimmed) : null;

    return FRIDAY_PRAISE_CATALOG.filter((song) => {
      // 1. Key Filter
      if (selectedKey !== '전체' && song.key !== selectedKey) {
        return false;
      }

      // 2. Specific Number Filter
      if (selectedNumber !== null && !trimmed) {
        if (song.bookNo !== selectedNumber) {
          return false;
        }
      }

      // 3. Consonant Filter
      if (selectedConsonant !== '전체') {
        const songChosungFirst = song.consonant || getChosung(song.title).charAt(0);
        if (songChosungFirst !== selectedConsonant) {
          return false;
        }
      }

      // 4. Search Query Filter
      if (trimmed) {
        const titleLower = song.title.toLowerCase();
        const chosung = getChosung(titleLower);
        const hymnNo = (song.hymnNo || '').toLowerCase();

        const matchTitle = titleLower.includes(trimmed);
        const matchChosung = chosung.includes(queryChosung) || chosung.includes(trimmed);
        const matchHymn = hymnNo.includes(trimmed);
        const matchBookNo = queryAsNumber !== null && song.bookNo === queryAsNumber;

        if (!matchTitle && !matchChosung && !matchHymn && !matchBookNo) {
          return false;
        }
      }

      return true;
    });
  }, [selectedKey, selectedNumber, selectedConsonant, searchQuery]);

  // Handle Transmitting Song Switch
  const handleTransmitSong = (song: CatalogSong) => {
    soundManager.playHighCue();
    setLastSentSongId(song.id);

    const targetPage = findPageForSong(song.title, song.key) || (song.key === 'G' ? 1 : song.key === 'C' ? 48 : 74);

    const songItem: SongItem = {
      id: `catalog-song-${song.id}-${Date.now()}`,
      title: song.title,
      key: song.key,
      notes: `악보 ${song.bookNo}번 (p.${targetPage})`,
    };

    onSelectSong(songItem, targetPage);

    onSendCue({
      category: 'SONG_FLOW',
      title: `[곡 전환] ${song.title}`,
      subtitle: `Key ${song.key} • 악보 ${song.bookNo}번 (p.${targetPage}쪽)`,
      icon: 'Music',
      color: 'cyan',
      senderId: 'leader',
      senderName: senderName || '인도자',
      senderRole: 'LEADER',
      urgency: 'HIGH',
      targetPage,
      targetSongTitle: song.title,
      targetKey: song.key,
    });

    setTimeout(() => {
      setLastSentSongId(null);
    }, 2500);
  };

  const handleResetFilters = () => {
    setSelectedKey('전체');
    setSelectedNumber(null);
    setSelectedConsonant('전체');
    setSearchQuery('');
  };

  return (
    <div className="bg-neutral-900/95 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>찬양 색인 (코드 및 자음 검색)</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                101쪽 수록곡
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              원하는 곡을 검색하고 <strong className="text-cyan-400">[곡 전환 신호]</strong>를 누르면 악보가 해당 페이지로 이동하며 찬양팀에 실시간 신호가 전송됩니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="text-xs text-neutral-400 hover:text-amber-300 font-bold px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
        >
          필터 초기화
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3.5 space-y-3">
        {/* Step 1: Code Selection (Key) */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-amber-400 w-24 shrink-0 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black inline-flex items-center justify-center">1</span>
            코드 선택:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRAISE_KEYS.map((k) => {
              const isSelected = selectedKey === k;
              return (
                <button
                  key={`songindex-key-${k}`}
                  type="button"
                  onClick={() => {
                    setSelectedKey(k);
                    setSelectedNumber(null);
                    soundManager.playNormalCue();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 border-amber-400 font-black shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>{k === '전체' ? '전체 코드' : `${k} 코드`}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Search Input & Consonants */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-neutral-800/80">
          <span className="text-xs font-black text-amber-400 w-24 shrink-0 flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black inline-flex items-center justify-center">2</span>
            자음/검색:
          </span>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="곡명, 초성(예: ㄲㄷㄷ, 변찮는), 악보 번호..."
              className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Consonants Chips */}
        <div className="flex items-center gap-1 flex-wrap pt-1 pl-0 sm:pl-[104px]">
          <span className="text-[10px] text-neutral-400 shrink-0 mr-1">초성:</span>
          {KOREAN_CONSONANTS.map((c) => {
            const isSelected = selectedConsonant === c;
            return (
              <button
                key={`songindex-c-${c}`}
                type="button"
                onClick={() => {
                  setSelectedConsonant(c);
                  soundManager.playNormalCue();
                }}
                className={`w-6 h-6 rounded text-[11px] font-bold transition flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-sm'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Number Quick Chips if specific key selected */}
        {availableNumbers.length > 0 && selectedKey !== '전체' && (
          <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-neutral-800/80 scrollbar-thin scrollbar-thumb-neutral-700 pl-0 sm:pl-[104px]">
            <span className="text-[10px] text-neutral-400 shrink-0 mr-1">악보 번호:</span>
            <button
              type="button"
              onClick={() => setSelectedNumber(null)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 transition cursor-pointer ${
                selectedNumber === null
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              전체
            </button>
            {availableNumbers.map((num) => {
              const isSelected = selectedNumber === num;
              return (
                <button
                  key={`songindex-num-${num}`}
                  type="button"
                  onClick={() => {
                    setSelectedNumber(num);
                    soundManager.playNormalCue();
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400 font-black'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {num}번
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black text-neutral-200">
          검색된 찬양: <strong className="text-amber-400 font-mono text-sm">{filteredSongs.length}곡</strong>
        </span>
        <span className="text-[11px] text-neutral-400">
          👉 <strong className="text-cyan-400">[곡 전환 신호]</strong>를 누르면 악보와 팀 화면이 즉시 전환됩니다.
        </span>
      </div>

      {/* Results Grid */}
      {filteredSongs.length === 0 ? (
        <div className="p-12 text-center bg-neutral-950/60 border border-dashed border-neutral-800 rounded-xl space-y-2">
          <p className="text-sm text-neutral-400">검색 조건에 일치하는 찬양이 없습니다.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            전체 조건 초기화하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[550px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-neutral-700">
          {filteredSongs.map((song) => {
            const isSent = lastSentSongId === song.id;
            const isCurrentlyPlaying = currentSongTitle.trim() === song.title.trim();
            const targetPage = findPageForSong(song.title, song.key) || (song.key === 'G' ? 1 : song.key === 'C' ? 48 : 74);

            return (
              <div
                key={`songindex-card-${song.id}`}
                className={`relative p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isCurrentlyPlaying
                    ? 'bg-emerald-950/50 border-emerald-500/70 ring-2 ring-emerald-500/40'
                    : isSent
                    ? 'bg-cyan-950/60 border-cyan-500/70 ring-2 ring-cyan-500/40'
                    : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs">
                        {song.key}-{song.bookNo}번
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        p.{targetPage}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-white truncate leading-snug">
                        {song.title}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                          {song.type}
                        </span>
                        {song.hymnNo && (
                          <span className="text-[10px] bg-neutral-800/80 text-amber-400 font-bold px-1.5 py-0.5 rounded">
                            {song.hymnNo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isCurrentlyPlaying && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-neutral-950 px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" />
                      연주 중
                    </span>
                  )}
                </div>

                {/* Single '곡 전환 신호' Action Button */}
                <div className="pt-1 border-t border-neutral-800/70">
                  <button
                    type="button"
                    onClick={() => handleTransmitSong(song)}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-cyan-500/20 active:scale-98 cursor-pointer"
                    title="찬양팀에 즉시 곡 전환 신호 전송 및 악보 이동"
                  >
                    <Radio className="w-4 h-4 shrink-0" />
                    <span>곡 전환 신호</span>
                  </button>
                </div>

                {isSent && (
                  <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 text-cyan-300 font-black text-xs animate-in fade-in z-10">
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>찬양팀에 [{song.title}] 큐 전송 완료!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
