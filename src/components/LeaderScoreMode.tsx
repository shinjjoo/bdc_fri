import React, { useState, useMemo } from 'react';
import { CueSignal, Member, SongItem } from '../types';
import { ScoreViewer } from './ScoreViewer';
import { SongIndexView } from './SongIndexView';
import { SCORE_PAGES, ScorePageSong, searchScoreCatalog } from '../data/pdfCatalog';
import { soundManager } from '../utils/audioVibration';
import { IconRenderer } from './IconRenderer';
import {
  Radio,
  Search,
  BookOpen,
  Send,
  Sparkles,
  Check,
  CheckCircle2,
  ChevronRight,
  ListMusic,
  ArrowRight,
} from 'lucide-react';

interface LeaderScoreModeProps {
  viewMode: 'INTEGRATED' | 'SCORE_ONLY' | 'CUE_ONLY' | 'SONG_INDEX';
  currentPage: number;
  onPageChange: (page: number) => void;
  songs: SongItem[];
  currentSong?: SongItem;
  currentSongIndex: number;
  activeCue: CueSignal | null;
  members: Member[];
  myMemberId: string;
  senderName: string;
  onSendCue: (cue: Omit<CueSignal, 'id' | 'timestamp' | 'acknowledgedBy'>) => void;
  onClearCue?: () => void;
  onClearActiveCue?: () => void;
  onAck?: (cueId: string) => void;
  onQuickReply?: (cueId: string, type: any, msg?: string) => void;
  onSetCurrentSong?: (song: SongItem) => void;
  onSelectCatalogSongAsCurrent?: (song: SongItem) => void;
}

const ESSENTIAL_FLOW_CUES = [
  {
    id: 'chorus_repeat',
    title: '후렴 반복',
    category: 'SONG_FLOW' as const,
    icon: 'Repeat',
    color: 'amber' as const,
    urgency: 'HIGH' as const,
    bg: 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-500/60 text-amber-300',
  },
  {
    id: 'infinite_loop',
    title: '무한 반복',
    category: 'SONG_FLOW' as const,
    icon: 'Infinity',
    color: 'purple' as const,
    urgency: 'HIGH' as const,
    bg: 'bg-purple-950/60 hover:bg-purple-900/80 border-purple-500/60 text-purple-300',
  },
  {
    id: 'switch_to_prayer',
    title: '기도로 전환',
    category: 'PRAYER' as const,
    icon: 'Flame',
    color: 'rose' as const,
    urgency: 'HIGH' as const,
    bg: 'bg-rose-950/60 hover:bg-rose-900/80 border-rose-500/60 text-rose-300',
  },
  {
    id: 'switch_to_ment',
    title: '멘트로 전환',
    category: 'SONG_FLOW' as const,
    icon: 'Mic',
    color: 'blue' as const,
    urgency: 'NORMAL' as const,
    bg: 'bg-blue-950/60 hover:bg-blue-900/80 border-blue-500/60 text-blue-300',
  },
  {
    id: 'switch_to_praise',
    title: '찬양으로 전환',
    category: 'SONG_FLOW' as const,
    icon: 'Music',
    color: 'emerald' as const,
    urgency: 'NORMAL' as const,
    bg: 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-500/60 text-emerald-300',
  },
  {
    id: 'prepare_ending',
    title: '종료 준비',
    category: 'SONG_FLOW' as const,
    icon: 'Sparkles',
    color: 'red' as const,
    urgency: 'HIGH' as const,
    bg: 'bg-red-950/60 hover:bg-red-900/80 border-red-500/60 text-red-300',
  },
];

export const LeaderScoreMode: React.FC<LeaderScoreModeProps> = ({
  viewMode,
  currentPage,
  onPageChange,
  songs,
  currentSong,
  currentSongIndex,
  activeCue,
  members,
  myMemberId,
  senderName,
  onSendCue,
  onClearCue,
  onSelectCatalogSongAsCurrent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [lastSentSongId, setLastSentSongId] = useState<string | null>(null);

  const pageInfo = useMemo(() => {
    return (
      SCORE_PAGES.find((p) => p.pageNumber === currentPage) || {
        pageNumber: currentPage,
        key: 'G',
        title: `${currentPage}쪽`,
        songs: [],
      }
    );
  }, [currentPage]);

  // Transmit Song Switch Cue (찬송가 번호 제외)
  const handleTransmitSong = (song: ScorePageSong) => {
    soundManager.playHighCue();
    setLastSentSongId(song.id);

    const songItem: SongItem = {
      id: `song-${song.id}-${Date.now()}`,
      title: song.title,
      key: song.key,
      notes: `악보 ${song.bookNo}번 (p.${currentPage})`,
    };

    if (onSelectCatalogSongAsCurrent) {
      onSelectCatalogSongAsCurrent(songItem);
    }

    onSendCue({
      category: 'SONG_FLOW',
      title: `[곡 전환] ${song.title}`,
      subtitle: `Key ${song.key} • 악보 ${song.bookNo}번 (p.${currentPage}쪽)`,
      icon: 'Music',
      color: 'cyan',
      senderId: 'leader',
      senderName: senderName || '인도자',
      senderRole: 'LEADER',
      urgency: 'HIGH',
      targetPage: currentPage,
      targetSongTitle: song.title,
      targetKey: song.key,
    });

    setTimeout(() => {
      setLastSentSongId(null);
    }, 2500);
  };

  const handleEssentialCue = (cue: (typeof ESSENTIAL_FLOW_CUES)[0]) => {
    soundManager.playHighCue();
    onSendCue({
      category: cue.category,
      title: cue.title,
      subtitle: currentSong ? `현재 곡: ${currentSong.title} (${currentSong.key})` : undefined,
      icon: cue.icon,
      color: cue.color,
      senderId: 'leader',
      senderName: senderName || '인도자',
      senderRole: 'LEADER',
      urgency: cue.urgency,
      targetPage: currentPage,
    });
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    soundManager.playHighCue();
    onSendCue({
      category: 'MESSAGE',
      title: customMsg.trim(),
      subtitle: '인도자 전달 메시지',
      icon: 'Send',
      color: 'amber',
      urgency: 'HIGH',
      senderId: 'leader',
      senderName: senderName || '인도자',
      senderRole: 'LEADER',
    });
    setCustomMsg('');
  };

  // Determine key from current page for contextual song number search
  const currentKey = useMemo(() => {
    const page = SCORE_PAGES.find((p) => p.pageNumber === currentPage);
    return page && page.key !== 'INDEX' ? page.key : undefined;
  }, [currentPage]);

  // Search Results across all 101 pages with Key/BookNo/Title/Page parser
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchScoreCatalog(searchQuery, currentKey);
  }, [searchQuery, currentKey]);

  // 1. SONG_INDEX Mode (찬양색인: 코드 및 자음 검색)
  if (viewMode === 'SONG_INDEX') {
    return (
      <SongIndexView
        onSendCue={onSendCue}
        onSelectSong={(songItem, page) => {
          if (onSelectCatalogSongAsCurrent) {
            onSelectCatalogSongAsCurrent(songItem);
          }
          onPageChange(page);
        }}
        currentSongTitle={currentSong?.title}
        senderName={senderName}
      />
    );
  }

  // 2. CUE_ONLY Mode (신호만)
  if (viewMode === 'CUE_ONLY') {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Section 1: Essential 6 One-Touch Flow Cues */}
        <div className="bg-neutral-900/95 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs">⚡</span>
              <span>원터치 진행 신호 목록 (6대 필수 신호)</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
              즉시 송신
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {ESSENTIAL_FLOW_CUES.map((cue) => (
              <button
                key={`cue-only-flow-${cue.id}`}
                type="button"
                onClick={() => handleEssentialCue(cue)}
                className={`p-3.5 rounded-xl border text-center transition-all duration-150 active:scale-95 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-md ${cue.bg}`}
              >
                <IconRenderer name={cue.icon} className="w-5 h-5" />
                <span className="text-xs font-black leading-tight">{cue.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Custom Direct Message to Team */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-2.5 shadow-lg">
          <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>찬양팀에 직접 신호/지시 메시지 송신</span>
          </label>
          <form onSubmit={handleSendCustomMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="예: 2절부터 피아노만, 브릿지 드럼 빌드업..."
              className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              disabled={!customMsg.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-neutral-950 font-black px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>신호 전송</span>
            </button>
          </form>
        </div>

        {/* Section 3: Current Page Songs List */}
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-black text-white">
                {currentPage}쪽 수록곡 목록 (곡 전환 신호 송신)
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pageInfo.songs.map((song) => {
              const isSent = lastSentSongId === song.id;
              const isCurrent = currentSong?.title.trim() === song.title.trim();

              return (
                <div
                  key={`cueonly-song-${song.id}`}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/60 border-emerald-500/70 ring-2 ring-emerald-500/40'
                      : isSent
                      ? 'bg-cyan-950/60 border-cyan-500/70 ring-2 ring-cyan-500/50'
                      : 'bg-neutral-950/80 border-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950">
                        #{song.bookNo}
                      </span>
                      <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {song.key}
                      </span>
                      <span className="text-xs font-black text-white truncate">
                        {song.title}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTransmitSong(song)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>곡 전환 신호 전송</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 3. SCORE_ONLY Mode (악보만: 상단에 곡진행 신호 창과 수록곡 창 함께 표시 + 악보PDF 최대 사이즈)
  if (viewMode === 'SCORE_ONLY') {
    return (
      <div className="flex flex-col h-[calc(100vh-125px)] min-h-[500px] w-full gap-2">
        {/* Top Combined Control Bar: Left (6 Essential Flow Cues) + Right (Current Page Songs Switch) */}
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-xl p-2 sm:p-2.5 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 shrink-0">
          {/* Left: 6 Essential Flow Cues in a compact row */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[11px] font-black text-amber-400 px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 shrink-0">
              진행 신호
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {ESSENTIAL_FLOW_CUES.map((cue) => (
                <button
                  key={`scoreonly-top-cue-${cue.id}`}
                  type="button"
                  onClick={() => handleEssentialCue(cue)}
                  className={`px-2 py-1 rounded-lg text-xs font-black shrink-0 transition active:scale-95 flex items-center gap-1 cursor-pointer border ${cue.bg}`}
                  title={`${cue.title} 신호 송신`}
                >
                  <IconRenderer name={cue.icon} className="w-3 h-3" />
                  <span className="whitespace-nowrap">{cue.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Songs on Current Page ({currentPage}쪽 수록곡) + 곡 전환 신호 */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 border-t lg:border-t-0 lg:border-l border-neutral-800 lg:pl-3">
            <span className="text-[11px] font-black text-cyan-400 px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/20 shrink-0">
              {currentPage}쪽 수록곡
            </span>
            {pageInfo.songs.length === 0 ? (
              <span className="text-[11px] text-neutral-500">목차/색인 페이지</span>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                {pageInfo.songs.map((song) => {
                  const isCurrent = currentSong?.title.trim() === song.title.trim();
                  const isSent = lastSentSongId === song.id;

                  return (
                    <button
                      key={`scoreonly-song-${song.id}`}
                      type="button"
                      onClick={() => handleTransmitSong(song)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isCurrent
                          ? 'bg-emerald-600 text-white border border-emerald-400'
                          : isSent
                          ? 'bg-cyan-600 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-neutral-950 active:scale-95'
                      }`}
                      title={`'${song.title}'(으)로 곡 전환 신호 전송`}
                    >
                      <Radio className="w-3 h-3" />
                      <span className="font-mono text-[10px]">#{song.bookNo}</span>
                      <span className="truncate max-w-[120px] sm:max-w-[160px]">{song.title}</span>
                      <span className="text-[10px] bg-black/20 px-1 rounded">전환</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Score PDF Viewer taking remaining full space (Maximized) */}
        <div className="flex-1 w-full min-h-0 bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800 shadow-xl flex flex-col">
          <ScoreViewer
            currentPageNumber={currentPage}
            pageInfo={pageInfo}
            currentSongTitle={currentSong?.title}
            onPageChange={onPageChange}
            onSelectSong={handleTransmitSong}
          />
        </div>
      </div>
    );
  }

  // 4. INTEGRATED Mode (통합뷰어 - 기본모드: PDF 뷰어 왼쪽 + 곡 목록과 원터치 신호창 오른쪽)
  return (
    <div className="flex flex-col md:flex-row landscape:flex-row gap-3 h-[calc(100vh-130px)] min-h-[550px] w-full">
      {/* Left / Center: High-Res Score PDF Viewer (Maximized) */}
      <div className="flex-1 h-full min-h-[420px] bg-neutral-900/95 border border-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <ScoreViewer
          currentPageNumber={currentPage}
          pageInfo={pageInfo}
          currentSongTitle={currentSong?.title}
          onPageChange={onPageChange}
          onSelectSong={handleTransmitSong}
        />
      </div>

      {/* Right Side: Flow Signals, Page Songs & Search Controls */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-2.5 shrink-0 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-neutral-700">
        {/* Section 1: Songs on Current Score Sheet */}
        <div className="bg-neutral-900/95 border-2 border-cyan-500/50 rounded-2xl p-3 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-cyan-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                <Radio className="w-3 h-3" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                {currentPage}쪽 <span className="text-cyan-400">수록곡 목록</span>
              </h3>
            </div>
            <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              {pageInfo.songs.length}곡 수록
            </span>
          </div>

          {pageInfo.songs.length === 0 ? (
            <div className="py-2 text-center text-xs text-neutral-400">
              이 페이지에 수록된 곡이 없습니다. 상단 찬양색인 탭을 이용해 원하는 곡을 검색하세요.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {pageInfo.songs.map((song, sIdx) => {
                const isSent = lastSentSongId === song.id;
                const isCurrent = currentSong?.title.trim() === song.title.trim();

                return (
                  <div
                    key={`integrated-song-${song.id || sIdx}`}
                    className={`relative p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/60 border-emerald-500/70 ring-2 ring-emerald-500/40 shadow-emerald-950/50'
                        : isSent
                        ? 'bg-cyan-950/60 border-cyan-500/70 ring-2 ring-cyan-500/50'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500 text-neutral-950 shadow-sm">
                            #{song.bookNo}
                          </span>
                          <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            {song.key}코드
                          </span>
                          <span className="text-xs font-black text-white truncate">
                            {song.title}
                          </span>
                        </div>
                      </div>

                      {isCurrent && (
                        <span className="text-[9px] font-black bg-emerald-500 text-neutral-950 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5 shadow-sm">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 연주중
                        </span>
                      )}
                    </div>

                    {/* Single Full-Width '곡 전환 신호' Button */}
                    <button
                      type="button"
                      onClick={() => handleTransmitSong(song)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-neutral-950 font-black text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
                      title="찬양팀에 즉시 곡 전환 신호 전송"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>곡 전환 신호</span>
                    </button>

                    {isSent && (
                      <div className="absolute inset-0 bg-cyan-950/95 backdrop-blur-sm rounded-xl flex items-center justify-center gap-1.5 text-cyan-300 font-black text-xs animate-in fade-in z-10">
                        <Check className="w-4 h-4 text-cyan-400" />
                        <span>찬양팀에 신호 전송 완료!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Essential 6 One-Touch Flow Cues */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 space-y-2 shadow-lg">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
            <h3 className="text-xs font-black text-neutral-200 flex items-center gap-1.5">
              <span>⚡ 원터치 진행 신호 목록</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
              원터치 전송
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {ESSENTIAL_FLOW_CUES.map((cue) => (
              <button
                key={`flow-${cue.id}`}
                type="button"
                onClick={() => handleEssentialCue(cue)}
                className={`p-2 rounded-xl border text-center transition-all duration-150 active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer shadow-sm ${cue.bg}`}
              >
                <IconRenderer name={cue.icon} className="w-3.5 h-3.5" />
                <span className="text-[11px] font-black leading-tight">{cue.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Quick Direct Message to Band */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1">
              <Send className="w-3 h-3 text-amber-400" />
              <span>지시 메시지 신호</span>
            </span>
          </div>

          <form onSubmit={handleSendCustomMessage} className="flex items-center gap-1.5">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="예: 2절부터 빌드업, 피아노만..."
              className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              disabled={!customMsg.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
            >
              전송
            </button>
          </form>
        </div>

        {/* Section 4: Quick Page Jump & Song Number Search */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 space-y-2 shadow-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchResults.length > 0) {
                const target = searchResults[0];
                onPageChange(target.pageNumber);
                if (onSelectCatalogSongAsCurrent) {
                  onSelectCatalogSongAsCurrent({
                    id: target.song.id,
                    title: target.song.title,
                    key: target.song.key,
                    hymnNumber: target.song.hymnNo,
                  });
                }
                setSearchQuery('');
              }
            }}
            className="relative"
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="예: E코드 #2, E#2, 75쪽, 찬양제목 검색..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-14 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-[10px] font-bold text-neutral-950 cursor-pointer"
              >
                이동
              </button>
            )}
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {searchResults.map((item) => (
                <button
                  key={`search-res-${item.pageNumber}-${item.song.id}`}
                  type="button"
                  onClick={() => {
                    onPageChange(item.pageNumber);
                    if (onSelectCatalogSongAsCurrent) {
                      onSelectCatalogSongAsCurrent({
                        id: item.song.id,
                        title: item.song.title,
                        key: item.song.key,
                        hymnNumber: item.song.hymnNo,
                      });
                    }
                    setSearchQuery('');
                  }}
                  className="w-full p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-left flex items-center justify-between text-xs transition cursor-pointer border border-neutral-800 hover:border-amber-500/50"
                >
                  <div className="flex flex-col truncate pr-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[11px] text-amber-400 font-mono font-bold">
                        {item.key} #{item.song.bookNo}
                      </span>
                      <span className="text-white font-bold truncate">{item.song.title}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">{item.badge}</span>
                  </div>
                  <span className="text-xs text-amber-400 font-mono font-bold shrink-0 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                    {item.pageNumber}쪽 이동 →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
