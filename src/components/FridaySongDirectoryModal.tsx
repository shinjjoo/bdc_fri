import React, { useState, useMemo } from 'react';
import {
  CatalogSong,
  FRIDAY_PRAISE_CATALOG,
  KOREAN_CONSONANTS,
  PRAISE_KEYS,
  PRAISE_TYPES,
  getChosung,
  getNumbersForKey,
} from '../data/fridayPraiseCatalog';
import { findPageForSong } from '../data/pdfCatalog';
import { CueSignal, SongItem } from '../types';
import { soundManager } from '../utils/audioVibration';
import {
  X,
  Search,
  Music,
  Radio,
  Check,
  Sparkles,
  BookOpen,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface FridaySongDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendCue?: (cue: Omit<CueSignal, 'id' | 'timestamp' | 'acknowledgedBy'>) => void;
  onSelectAsCurrentSong?: (song: SongItem) => void;
  isLeader: boolean;
  senderName: string;
}

export const FridaySongDirectoryModal: React.FC<FridaySongDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSendCue,
  onSelectAsCurrentSong,
  isLeader,
  senderName,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('E');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(18);
  const [selectedConsonant, setSelectedConsonant] = useState<string>('전체');
  const [selectedType, setSelectedType] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [justSentSongId, setJustSentSongId] = useState<string | null>(null);

  // Available numbers for currently selected key
  const availableNumbers = useMemo(() => {
    return getNumbersForKey(selectedKey);
  }, [selectedKey]);

  // Filter logic
  const filteredSongs = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const queryChosung = getChosung(trimmedQuery);
    const queryAsNumber = !isNaN(Number(trimmedQuery)) && trimmedQuery !== '' ? Number(trimmedQuery) : null;

    return FRIDAY_PRAISE_CATALOG.filter((song) => {
      // 1. Key filter
      if (selectedKey !== '전체' && song.key !== selectedKey) {
        return false;
      }

      // 2. Specific Number filter (if selected and search query is empty)
      if (selectedNumber !== null && !trimmedQuery) {
        if (song.bookNo !== selectedNumber) {
          return false;
        }
      }

      // 3. Consonant filter
      if (selectedConsonant !== '전체') {
        const songChosungFirst = song.consonant || getChosung(song.title).charAt(0);
        if (songChosungFirst !== selectedConsonant) {
          return false;
        }
      }

      // 4. Type filter
      if (selectedType !== '전체' && song.type !== selectedType) {
        return false;
      }

      // 5. Search query filter
      if (trimmedQuery) {
        const songTitle = song.title.toLowerCase();
        const songChosung = getChosung(songTitle);
        const hymnNo = (song.hymnNo || '').toLowerCase();

        const matchTitle = songTitle.includes(trimmedQuery);
        const matchChosung = songChosung.includes(queryChosung) || songChosung.includes(trimmedQuery);
        const matchHymn = hymnNo.includes(trimmedQuery);
        const matchBookNo = queryAsNumber !== null && song.bookNo === queryAsNumber;

        if (!matchTitle && !matchChosung && !matchHymn && !matchBookNo) {
          return false;
        }
      }

      return true;
    });
  }, [selectedKey, selectedNumber, selectedConsonant, selectedType, searchQuery]);

  if (!isOpen) return null;

  // Handle immediate Cue signal broadcast for song change
  const handleBroadcastSongCue = (song: CatalogSong) => {
    soundManager.playHighCue();

    const targetPage = findPageForSong(song.title, song.key) || (song.key === 'G' ? 1 : song.key === 'C' ? 48 : 74);

    const songItem: SongItem = {
      id: `praise-${song.id}-${Date.now()}`,
      title: song.title,
      key: song.key,
      notes: `${song.type} (악보 ${song.bookNo}쪽/번 - p.${targetPage})`,
    };

    if (onSelectAsCurrentSong) {
      onSelectAsCurrentSong(songItem);
    }
      if (onSendCue) {
        onSendCue({
          category: 'SONG_FLOW',
          title: `[곡 전환] ${song.title}`,
          subtitle: `Key ${song.key} • 악보 ${song.bookNo}쪽 (p.${targetPage}쪽)`,
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
      }

    setJustSentSongId(song.id);
    setTimeout(() => setJustSentSongId(null), 2500);
  };

  const handleResetFilters = () => {
    setSelectedKey('전체');
    setSelectedNumber(null);
    setSelectedConsonant('전체');
    setSelectedType('전체');
    setSearchQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-2 border-amber-500/50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  금요기도회 찬양집 색인 & 번호 검색
                </h3>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  98~101p (총 {FRIDAY_PRAISE_CATALOG.length}곡)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                코드(E/G/C) 선택 ➔ 번호(예: 18번) 선택 ➔ 곡 터치하여 신호 전송
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 font-semibold transition flex items-center gap-1"
              title="필터 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">초기화</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Filter Controls Body */}
        <div className="p-4 sm:p-5 space-y-3 bg-neutral-950/70 border-b border-neutral-800 overflow-y-auto max-h-[40vh] shrink-0">
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
                    key={k}
                    type="button"
                    onClick={() => {
                      setSelectedKey(k);
                      if (k === 'E') setSelectedNumber(18);
                      else setSelectedNumber(1);
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

          {/* Step 2: Number Chips & Search Bar */}
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-neutral-800/80">
            <span className="text-xs font-black text-amber-400 w-24 shrink-0 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black inline-flex items-center justify-center">2</span>
              번호/검색:
            </span>

            {/* Keyword / Number Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="번호(18) 또는 곡명/초성(ㄲㄷㄷ)..."
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

            {/* Number Chips */}
            <div className="w-full flex items-center gap-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-neutral-700">
              <span className="text-[10px] text-neutral-400 shrink-0 mr-1">번호 바로가기:</span>
              <button
                type="button"
                onClick={() => setSelectedNumber(null)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 transition ${
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
                    key={num}
                    type="button"
                    onClick={() => {
                      setSelectedNumber(num);
                      soundManager.playNormalCue();
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 transition ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400 shadow-sm'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {num}번
                  </button>
                );
              })}
            </div>
          </div>

          {/* Consonant Filter */}
          <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-neutral-800/80">
            <span className="text-[10px] font-bold text-neutral-400 shrink-0 w-24">자음 (ㄱ~ㅎ):</span>
            <div className="flex items-center gap-1 flex-wrap">
              {KOREAN_CONSONANTS.map((c) => {
                const isSelected = selectedConsonant === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedConsonant(c)}
                    className={`w-6 h-6 rounded text-[11px] font-bold transition flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 font-black'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-neutral-900 scrollbar-thin scrollbar-thumb-neutral-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center gap-2">
              <span>
                {selectedNumber !== null
                  ? `${selectedKey} 코드 ${selectedNumber}번 수록 찬양 (${filteredSongs.length}곡)`
                  : `${selectedKey} 코드 검색 결과 (${filteredSongs.length}곡)`}
              </span>
            </span>
            <span className="text-[11px] text-neutral-400">
              👉 곡을 터치하면 찬양팀에 실시간 신호가 전송됩니다.
            </span>
          </div>

          {filteredSongs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl space-y-2">
              <p className="text-sm text-neutral-400">검색 조건에 일치하는 찬양이 없습니다.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-amber-400 hover:underline"
              >
                전체 조건 초기화하기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSongs.map((song) => {
                const isSent = justSentSongId === song.id;

                return (
                  <div
                    key={song.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 relative ${
                      isSent
                        ? 'bg-cyan-950/60 border-cyan-500/80 ring-2 ring-cyan-500/50'
                        : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Number Badge */}
                        <div className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-xs shrink-0">
                          {song.key}-{song.bookNo}번
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-black text-white truncate">
                            {song.title}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
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
                    </div>

                    {/* Action Buttons: Only '곡 전환 신호' */}
                    <div className="pt-1 border-t border-neutral-800/70">
                      <button
                        type="button"
                        onClick={() => handleBroadcastSongCue(song)}
                        className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                        title="모든 찬양팀 화면에 곡 전환 신호 즉시 전송"
                      >
                        <Radio className="w-4 h-4 shrink-0" />
                        <span>곡 전환 신호</span>
                      </button>
                    </div>

                    {isSent && (
                      <div className="absolute inset-0 bg-cyan-950/80 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 text-cyan-300 font-black text-xs animate-in fade-in">
                        <Check className="w-4 h-4 text-cyan-400" />
                        <span>찬양팀에 [{song.title}] 큐 신호 전송 완료!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
