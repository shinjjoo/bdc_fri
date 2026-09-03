import React, { useState, useMemo } from 'react';
import { CueSignal, CueUrgency, SongItem, UserRole } from '../types';
import { soundManager } from '../utils/audioVibration';
import { IconRenderer } from './IconRenderer';
import {
  FRIDAY_PRAISE_CATALOG,
  getChosung,
  KOREAN_CONSONANTS,
  PRAISE_KEYS,
} from '../data/fridayPraiseCatalog';
import { findPageForSong } from '../data/pdfCatalog';
import {
  Send,
  Sparkles,
  Repeat,
  Flame,
  Mic,
  Music,
  Hourglass,
  Infinity as InfinityIcon,
  Check,
  ChevronRight,
  Radio,
  BookOpen,
  Search,
  CheckCircle2,
  Edit3,
} from 'lucide-react';

interface LeaderControlsProps {
  presets: any[];
  songs: SongItem[];
  currentSong: SongItem | null;
  currentSongIndex: number;
  totalSongs: number;
  cueHistory: CueSignal[];
  onSendCue: (cue: Omit<CueSignal, 'id' | 'timestamp' | 'acknowledgedBy'>) => void;
  onSetCurrentSong: (index: number) => void;
  onOpenSongDirectory?: () => void;
  onOpenScoreMode?: () => void;
  onSelectCatalogSongAsCurrent?: (song: SongItem) => void;
  senderName: string;
}

// 6 Essential Flow Cues for Praise Leader
const ESSENTIAL_LEADER_CUES = [
  {
    id: 'chorus_repeat',
    title: '후렴반복',
    icon: 'Repeat',
    color: 'amber' as const,
    urgency: 'NORMAL' as CueUrgency,
    category: 'SONG_FLOW' as const,
    bgClasses: 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25',
    iconBg: 'bg-amber-500/20 text-amber-400',
    badge: '진행',
  },
  {
    id: 'free_loop',
    title: '무한반복',
    icon: 'Infinity',
    color: 'indigo' as const,
    urgency: 'NORMAL' as CueUrgency,
    category: 'SONG_FLOW' as const,
    bgClasses: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25',
    iconBg: 'bg-indigo-500/20 text-indigo-400',
    badge: '진행',
  },
  {
    id: 'to_prayer',
    title: '기도로 전환',
    icon: 'Flame',
    color: 'rose' as const,
    urgency: 'URGENT' as CueUrgency,
    category: 'PRAYER' as const,
    bgClasses: 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30 ring-1 ring-rose-500/30',
    iconBg: 'bg-rose-500/20 text-rose-400',
    badge: '긴급',
  },
  {
    id: 'to_ment',
    title: '멘트로 전환',
    icon: 'Mic',
    color: 'purple' as const,
    urgency: 'NORMAL' as CueUrgency,
    category: 'SONG_FLOW' as const,
    bgClasses: 'bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25',
    iconBg: 'bg-purple-500/20 text-purple-400',
    badge: '진행',
  },
  {
    id: 'to_praise',
    title: '찬양으로 전환',
    icon: 'Music',
    color: 'cyan' as const,
    urgency: 'NORMAL' as CueUrgency,
    category: 'SONG_FLOW' as const,
    bgClasses: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
    badge: '진행',
  },
  {
    id: 'ending_ready',
    title: '종료 준비',
    icon: 'Hourglass',
    color: 'orange' as const,
    urgency: 'HIGH' as CueUrgency,
    category: 'SONG_FLOW' as const,
    bgClasses: 'bg-orange-500/15 border-orange-500/40 text-orange-300 hover:bg-orange-500/25',
    iconBg: 'bg-orange-500/20 text-orange-400',
    badge: '종료',
  },
];

export const LeaderControls: React.FC<LeaderControlsProps> = ({
  presets,
  songs = [],
  currentSong,
  currentSongIndex,
  totalSongs,
  cueHistory,
  onSendCue,
  onSetCurrentSong,
  onOpenSongDirectory,
  onOpenScoreMode,
  onSelectCatalogSongAsCurrent,
  senderName,
}) => {
  // Feedback tracking for sent song
  const [lastSentSongId, setLastSentSongId] = useState<string | null>(null);

  // ==========================================
  // [1구역] 필수 진행 큐 신호 & 직접 큐 메시지
  // ==========================================
  const [customText, setCustomText] = useState('');
  const [customUrgency, setCustomUrgency] = useState<CueUrgency>('NORMAL');

  // ==========================================
  // [2구역] 코드 및 자음 검색 상태
  // ==========================================
  const [zone2Key, setZone2Key] = useState<string>('전체');
  const [zone2Consonant, setZone2Consonant] = useState<string>('전체');
  const [zone2SearchQuery, setZone2SearchQuery] = useState<string>('');

  // 2구역 필터링된 곡 목록
  const zone2FilteredSongs = useMemo(() => {
    const trimmed = zone2SearchQuery.trim().toLowerCase();
    const queryChosung = getChosung(trimmed);

    return FRIDAY_PRAISE_CATALOG.filter((song) => {
      // 1. Key filter
      if (zone2Key !== '전체' && song.key !== zone2Key) {
        return false;
      }

      // 2. Consonant filter
      if (zone2Consonant !== '전체') {
        const firstC = song.consonant || getChosung(song.title).charAt(0);
        if (firstC !== zone2Consonant) {
          return false;
        }
      }

      // 3. Text & Chosung search
      if (trimmed) {
        const titleLower = song.title.toLowerCase();
        const titleChosung = getChosung(song.title);
        const hymnStr = song.hymnNo ? song.hymnNo.toLowerCase() : '';
        const matchTitle = titleLower.includes(trimmed);
        const matchChosung = titleChosung.includes(queryChosung) || titleChosung.includes(trimmed);
        const matchHymn = hymnStr.includes(trimmed);
        const matchNo = String(song.bookNo) === trimmed;

        return matchTitle || matchChosung || matchHymn || matchNo;
      }

      return true;
    });
  }, [zone2Key, zone2Consonant, zone2SearchQuery]);

  // Consonant chips
  const consonantList = KOREAN_CONSONANTS;

  // Transmit Song Cue from Search List
  const handleTransmitSongCue = (
    song: (typeof FRIDAY_PRAISE_CATALOG)[0]
  ) => {
    soundManager.playHighCue();
    setLastSentSongId(song.id);

    const targetPage = findPageForSong(song.title, song.key) || (song.key === 'G' ? 1 : song.key === 'C' ? 48 : 74);

    const songItem: SongItem = {
      id: `catalog-song-${song.id}-${Date.now()}`,
      title: song.title,
      key: song.key,
      notes: `악보 ${song.bookNo}번 (p.${targetPage})`,
    };

    if (onSelectCatalogSongAsCurrent) {
      onSelectCatalogSongAsCurrent(songItem);
    }

    onSendCue({
      category: 'SONG_FLOW',
      title: `[곡 전환] ${song.title}`,
      subtitle: `Key ${song.key} • 악보 ${song.bookNo}번 (p.${targetPage}${song.hymnNo ? `, ${song.hymnNo}` : ''})`,
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

  // Essential Cue Handler
  const handleEssentialCueClick = (cueItem: (typeof ESSENTIAL_LEADER_CUES)[0]) => {
    if (cueItem.urgency === 'URGENT') {
      soundManager.playUrgentCue();
    } else if (cueItem.urgency === 'HIGH') {
      soundManager.playHighCue();
    } else {
      soundManager.playNormalCue();
    }

    onSendCue({
      category: cueItem.category,
      title: cueItem.title,
      icon: cueItem.icon,
      color: cueItem.color,
      senderId: 'leader',
      senderName: senderName || '인도자',
      senderRole: 'LEADER',
      urgency: cueItem.urgency,
    });
  };

  // Custom Direct Message Handler
  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    onSendCue({
      category: 'CUSTOM',
      title: customText.trim(),
      icon: 'Edit3',
      color: customUrgency === 'URGENT' ? 'red' : customUrgency === 'HIGH' ? 'amber' : 'purple',
      senderId: 'leader',
      senderName: senderName || '인도자',
      senderRole: 'LEADER',
      urgency: customUrgency,
    });

    setCustomText('');
  };

  return (
    <div className="space-y-6">
      {/* 인도자 악보 모드 (101p PDF 악보 + 실시간 곡 전환) 퀵 런처 배너 */}
      {onOpenScoreMode && (
        <div className="bg-gradient-to-r from-amber-500/25 via-neutral-900 to-amber-500/15 border-2 border-amber-500/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-amber-500/30">
              🎼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  인도자 실시간 101쪽 PDF 악보 모드
                </h3>
                <span className="text-[10px] bg-amber-500 text-neutral-950 font-black px-2 py-0.5 rounded-full uppercase">
                  추천
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                101쪽 찬양 악보집(PDF) 원본을 열람하고, 상하 스크롤로 페이지를 넘기며 <strong>[곡 전환 버튼]</strong>으로 찬양팀에 즉시 큐를 전송하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenSongDirectory && (
              <button
                type="button"
                onClick={onOpenSongDirectory}
                className="px-3.5 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-neutral-200 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>전체 찬양 색인</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenScoreMode}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition cursor-pointer shrink-0"
            >
              <span>악보 모드 실행하기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1구역: 필수 진행 큐 신호 (6종 원터치 신호 + 직접 큐 메시지 입력) */}
      {/* ========================================================================= */}
      <section
        id="zone-1-essential-cue-signals"
        className="bg-neutral-900/95 border-2 border-indigo-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl backdrop-blur-md"
      >
        {/* Zone Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-500/20 text-lg">
              1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  <span className="text-indigo-400">1구역 :</span>
                  <span>필수 진행 큐 신호</span>
                </h3>
                <span className="text-[11px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                  원터치 6대 필수 신호
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                터치 시 모든 찬양팀 및 악보대 화면에 즉시 대형 신호가 송신됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 6 Essential Cues Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ESSENTIAL_LEADER_CUES.map((cueItem) => (
            <button
              key={`zone1-${cueItem.id}`}
              type="button"
              onClick={() => handleEssentialCueClick(cueItem)}
              className={`p-3 rounded-2xl border text-left transition-all duration-150 active:scale-[0.97] flex items-center gap-3 cursor-pointer ${cueItem.bgClasses}`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${cueItem.iconBg}`}>
                <IconRenderer name={cueItem.icon} className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black tracking-tight truncate">{cueItem.title}</span>
                  <span className="text-[9px] font-bold opacity-75 uppercase px-1 py-0.2 rounded bg-black/20">
                    {cueItem.badge}
                  </span>
                </div>
                <p className="text-[10px] opacity-75 truncate mt-0.5">즉시 큐 전송</p>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Direct Message Input */}
        <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-neutral-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>직접 큐 메시지 입력 전송</span>
            </label>
          </div>

          <form onSubmit={handleSendCustom} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="예: 2절부터 시작, 피아노만 잔잔하게, 브릿지로 점프 등..."
                className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
              />
              <button
                type="submit"
                disabled={!customText.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>전송</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">긴급도:</span>
              <div className="flex gap-1">
                {(['NORMAL', 'HIGH', 'URGENT'] as CueUrgency[]).map((u) => (
                  <button
                    key={`zone1-urgency-${u}`}
                    type="button"
                    onClick={() => setCustomUrgency(u)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-lg font-bold transition ${
                      customUrgency === u
                        ? u === 'URGENT'
                          ? 'bg-rose-500 text-white'
                          : u === 'HIGH'
                          ? 'bg-amber-500 text-neutral-950 font-black'
                          : 'bg-indigo-500 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {u === 'URGENT' ? '긴급(빨강)' : u === 'HIGH' ? '중요(노랑)' : '일반(인디고)'}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2구역: 코드 및 자음 검색 (ㄱ~ㅎ 자음 & 곡명 검색) */}
      {/* ========================================================================= */}
      <section
        id="zone-2-code-consonant-search"
        className="bg-neutral-900/95 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl backdrop-blur-md"
      >
        {/* Zone Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-neutral-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/20 text-lg">
              2
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  <span className="text-emerald-400">2구역 :</span>
                  <span>코드 및 자음 검색</span>
                </h3>
                <span className="text-[11px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  자음(ㄱ~ㅎ) & 초성 검색
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                코드와 한글 자음(초성)을 선택하거나 검색어를 입력하여 원하는 곡을 빠르게 찾을 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 2구역 - Step 1: 코드 (Key) 필터 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-emerald-400 tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black inline-flex items-center justify-center">
                A
              </span>
              <span>코드 (Key) 필터</span>
            </label>
            <span className="text-[11px] text-neutral-300">
              현재 필터: <strong className="text-emerald-300 font-bold">{zone2Key} 코드</strong>
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {PRAISE_KEYS.map((k) => {
              const isSelected = zone2Key === k;
              return (
                <button
                  key={`zone2-key-${k}`}
                  type="button"
                  onClick={() => {
                    setZone2Key(k);
                    soundManager.playNormalCue();
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-black shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-neutral-950/80 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-black">{k === '전체' ? '전체 코드' : `${k} 코드`}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2구역 - Step 2: 자음(ㄱ~ㅎ) 선택 바 & 검색창 */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-black text-emerald-400 tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black inline-flex items-center justify-center">
                B
              </span>
              <span>자음(초성) 및 곡명 검색</span>
            </label>

            {/* Keyword Search Input */}
            <div className="relative flex-1 max-w-xs min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={zone2SearchQuery}
                onChange={(e) => setZone2SearchQuery(e.target.value)}
                placeholder="곡명 또는 초성(예: ㄲㄷㄷ, 변찮는)..."
                className="w-full bg-neutral-900 border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
              />
              {zone2SearchQuery && (
                <button
                  type="button"
                  onClick={() => setZone2SearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Consonant Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {consonantList.map((consonant) => {
              const isSelected = zone2Consonant === consonant;
              return (
                <button
                  key={`zone2-consonant-${consonant}`}
                  type="button"
                  onClick={() => {
                    setZone2Consonant(consonant);
                    soundManager.playNormalCue();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {consonant}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2구역 - Step 3: 검색된 곡 리스트 & 즉시 큐 전송 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-emerald-400 tracking-wider flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-black inline-flex items-center justify-center">
                C
              </span>
              <span>
                검색 결과: <strong className="text-white">{zone2FilteredSongs.length}곡</strong>
              </span>
            </label>
            <span className="text-[11px] text-neutral-400 font-medium">
              👉 곡을 선택하여 <strong className="text-cyan-300">[곡 전환 신호]</strong>를 바로 송신하세요.
            </span>
          </div>

          {zone2FilteredSongs.length === 0 ? (
            <div className="p-8 text-center bg-neutral-950/60 border border-dashed border-neutral-800 rounded-xl space-y-1">
              <p className="text-xs text-neutral-400">조건에 맞는 찬양을 찾지 못했습니다.</p>
              <button
                type="button"
                onClick={() => {
                  setZone2Key('전체');
                  setZone2Consonant('전체');
                  setZone2SearchQuery('');
                }}
                className="text-xs text-emerald-400 font-bold hover:underline"
              >
                검색 조건 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-neutral-700">
              {zone2FilteredSongs.map((song) => {
                const isSent = lastSentSongId === song.id;
                const isCurrentlyPlaying = currentSong?.title.trim() === song.title.trim();

                return (
                  <div
                    key={`zone2-song-${song.id}`}
                    className={`relative p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                      isCurrentlyPlaying
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/30'
                        : isSent
                        ? 'bg-cyan-950/50 border-cyan-500/60 ring-2 ring-cyan-500/40'
                        : 'bg-neutral-950/90 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {/* Song Info */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="flex flex-col items-center shrink-0">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs">
                            {song.key}-{song.bookNo}번
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-black text-white truncate leading-snug">
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

                      {isCurrentlyPlaying && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-neutral-950 px-2 py-0.5 rounded-full shrink-0 shadow-sm">
                          <CheckCircle2 className="w-3 h-3" />
                          연주 중
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: Only '곡 전환 신호' */}
                    <div className="pt-1 border-t border-neutral-800/70">
                      <button
                        type="button"
                        onClick={() => handleTransmitSongCue(song)}
                        className="w-full py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md shadow-cyan-500/20 active:scale-98 cursor-pointer"
                        title="찬양팀에 즉시 곡 전환 신호 전송"
                      >
                        <Radio className="w-4 h-4 shrink-0" />
                        <span>곡 전환 신호</span>
                      </button>
                    </div>

                    {isSent && (
                      <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 text-cyan-300 font-black text-xs animate-in fade-in">
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
      </section>
    </div>
  );
};
