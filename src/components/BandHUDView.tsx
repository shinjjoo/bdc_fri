import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CueSignal, Member, QuickReply, SongItem } from '../types';
import { ScoreViewer } from './ScoreViewer';
import { soundManager } from '../utils/audioVibration';
import { SCORE_PAGES } from '../data/pdfCatalog';
import {
  Radio,
  Send,
  MessageSquare,
  CheckCircle2,
  BookOpen,
  Sparkles,
  X,
} from 'lucide-react';

interface BandHUDViewProps {
  viewMode: 'INTEGRATED' | 'SCORE_ONLY' | 'CUE_ONLY';
  activeCue: CueSignal | null;
  currentSong?: SongItem;
  currentScorePage: number;
  onPageChange: (page: number) => void;
  myMemberId: string;
  myName?: string;
  members: Member[];
  onAckCue: (cueId: string) => void;
  onQuickReply: (cueId: string, type: QuickReply['type'], msg?: string) => void;
  onSendChatMessage: (text: string) => void;
  onOpenChat: () => void;
}

export const BandHUDView: React.FC<BandHUDViewProps> = ({
  viewMode,
  activeCue,
  currentSong,
  currentScorePage,
  onPageChange,
  myMemberId,
  myName,
  onAckCue,
  onSendChatMessage,
  onOpenChat,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [isCueVisible, setIsCueVisible] = useState(true);
  const [dismissedCueId, setDismissedCueId] = useState<string | null>(null);
  const cueTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 10-second timer trigger function
  const triggerCueVisibility = useCallback(() => {
    if (!activeCue) return;
    // If the user explicitly closed this specific cue, do not auto-reopen on general touches
    if (activeCue.id === dismissedCueId) return;

    if (cueTimerRef.current) {
      clearTimeout(cueTimerRef.current);
    }
    setIsCueVisible(true);
    cueTimerRef.current = setTimeout(() => {
      setIsCueVisible(false);
    }, 10000); // 10 seconds
  }, [activeCue, dismissedCueId]);

  // 1. Trigger when a new signal is received or activeCue updates
  useEffect(() => {
    if (activeCue) {
      // New signal received: clear dismissed status and show with 10s timer
      setDismissedCueId(null);
      if (cueTimerRef.current) {
        clearTimeout(cueTimerRef.current);
      }
      setIsCueVisible(true);
      cueTimerRef.current = setTimeout(() => {
        setIsCueVisible(false);
      }, 10000); // 10 seconds
    } else {
      setIsCueVisible(false);
      if (cueTimerRef.current) {
        clearTimeout(cueTimerRef.current);
      }
    }
    return () => {
      if (cueTimerRef.current) {
        clearTimeout(cueTimerRef.current);
      }
    };
  }, [activeCue?.id, activeCue?.timestamp]);

  const handleCloseCue = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (cueTimerRef.current) {
      clearTimeout(cueTimerRef.current);
      cueTimerRef.current = null;
    }
    setIsCueVisible(false);
    if (activeCue) {
      setDismissedCueId(activeCue.id);
    }
  };

  const isAcked =
    activeCue?.acknowledgedBy.some(
      (a) =>
        (myMemberId && a.memberId === myMemberId) ||
        (myName && a.memberName === myName) ||
        (myMemberId && a.memberName === myMemberId)
    ) || false;

  const handleTouchAck = () => {
    if (activeCue && !isAcked) {
      soundManager.playSuccessAck();
      onAckCue(activeCue.id);
      triggerCueVisibility();
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onSendChatMessage(quickInput.trim());
    setQuickInput('');
  };

  // 1. SCORE_ONLY Mode (악보만: 악보 최대화 + 10초 타이머 플로팅 진행 신호 알림)
  if (viewMode === 'SCORE_ONLY') {
    return (
      <div
        className="flex flex-col h-[calc(100vh-80px)] w-full relative"
        onPointerDown={triggerCueVisibility}
        onTouchStart={triggerCueVisibility}
        onTouchMove={triggerCueVisibility}
        onWheel={triggerCueVisibility}
      >
        {/* Floating In-Score Cue Alert Overlay (상단 메뉴 부분에 열려 악보를 가리지 않음, 윗줄: 곡제목 / 아랫줄: 이동버튼 + 확인완료) */}
        {activeCue && (
          <div
            className={`absolute top-2 left-2 right-2 sm:left-4 sm:right-4 z-30 transition-all duration-300 ease-out ${
              isCueVisible
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              triggerCueVisibility();
            }}
          >
            <div className="bg-neutral-950/95 border-2 border-cyan-500/90 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md flex flex-col gap-2">
              {/* Top Row: Cue Badge, Song Title, Subtitle, and Close Button (Title never obscured) */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                    진행 신호
                  </span>
                  {/* Song title: Bold, clear, never clipped */}
                  <span className="text-sm sm:text-base font-black text-white tracking-tight leading-snug break-words">
                    {activeCue.title}
                  </span>
                  {activeCue.subtitle && (
                    <span className="text-[11px] text-cyan-200/90 font-medium truncate hidden xs:inline">
                      • {activeCue.subtitle.replace(/,\s*(?:통합|새찬송가|새)?\s*\d+\s*장/gi, '')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCloseCue}
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition cursor-pointer shrink-0 ml-1"
                  title="신호창 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Row: Jump Button on Left, Confirmation Button on Right */}
              <div className="flex items-center gap-2 pt-1 border-t border-cyan-500/20">
                {activeCue.targetPage && activeCue.targetPage !== currentScorePage ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playNormalCue();
                        onPageChange(activeCue.targetPage!);
                        triggerCueVisibility();
                      }}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span className="whitespace-nowrap font-black">p.{activeCue.targetPage}쪽 악보 이동</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTouchAck}
                      disabled={isAcked}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                        isAcked
                          ? 'bg-emerald-600 text-white border border-emerald-400 cursor-default'
                          : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 ring-2 ring-amber-300/60 active:scale-95 animate-pulse'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap font-black">{isAcked ? '확인 완료됨' : '확인 완료'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleTouchAck}
                    disabled={isAcked}
                    className={`w-full py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                      isAcked
                        ? 'bg-emerald-600 text-white border border-emerald-400 cursor-default'
                        : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 ring-2 ring-amber-300/60 active:scale-95 animate-pulse'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="font-black">{isAcked ? '진행 신호 확인 완료됨' : '신호 확인 완료 (터치)'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Small collapsed badge on top right when cue is active but dismissed/hidden */}
        {activeCue && !isCueVisible && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissedCueId(null);
              setIsCueVisible(true);
              triggerCueVisibility();
            }}
            className="absolute top-2 right-2 z-30 px-2.5 py-1 rounded-full bg-cyan-950/95 border border-cyan-500/80 text-cyan-300 text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5 hover:bg-cyan-900/90 transition cursor-pointer animate-pulse"
            title="진행 신호 다시 보기"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>신호 보기</span>
          </button>
        )}

        {/* Full PDF Score Viewer taking full height and width */}
        <div className="flex-1 w-full min-h-0 bg-neutral-900 rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800 shadow-xl flex flex-col">
          <ScoreViewer
            currentPageNumber={currentScorePage}
            currentSongTitle={currentSong?.title}
            onPageChange={onPageChange}
            onInteraction={triggerCueVisibility}
          />
        </div>
      </div>
    );
  }

  // 2. CUE_ONLY Mode (신호만)
  if (viewMode === 'CUE_ONLY') {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Large Cue Box with Direct Confirmation */}
        {activeCue ? (
          <div className="bg-neutral-900/95 border-2 border-cyan-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                실시간 진행 신호
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white pt-2 leading-tight">
                {activeCue.title}
              </h2>
              {activeCue.subtitle && (
                <p className="text-sm sm:text-base text-cyan-200 font-semibold">
                  {activeCue.subtitle.replace(/,\s*(?:통합|새찬송가|새)?\s*\d+\s*장/gi, '')}
                </p>
              )}
            </div>

            {/* Direct Confirmation Button */}
            <button
              type="button"
              onClick={handleTouchAck}
              disabled={isAcked}
              className={`w-full py-5 sm:py-6 rounded-2xl font-black text-base sm:text-xl transition-all duration-200 flex flex-col items-center justify-center gap-1.5 shadow-2xl cursor-pointer ${
                isAcked
                  ? 'bg-emerald-600 border-2 border-emerald-400 text-white'
                  : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 hover:brightness-110 active:scale-[0.98] animate-pulse ring-4 ring-amber-400/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>{isAcked ? '신호 확인 완료됨' : '확인 완료'}</span>
              </div>
              <span className="text-xs font-medium opacity-85">
                {isAcked ? '인도자에게 확인 응답이 전달되었습니다' : '터치 시 즉시 인도자 화면에 확인 표시가 전달됩니다'}
              </span>
            </button>
          </div>
        ) : (
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 text-center space-y-2">
            <Radio className="w-8 h-8 text-neutral-500 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-neutral-300">현재 대기 중인 신호가 없습니다</h3>
            <p className="text-xs text-neutral-500">인도자가 곡 전환 또는 진행 신호를 송신하면 즉시 표시됩니다.</p>
          </div>
        )}

        {/* Live Chat Message Input */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              메시지 보내기
            </span>
            <button
              type="button"
              onClick={onOpenChat}
              className="text-xs text-amber-400 hover:underline"
            >
              전체 대화창 열기 →
            </button>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="인도자 및 팀원에게 메시지 전송..."
              className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>전송</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. INTEGRATED Mode (통합뷰어 - 기본모드: PDF 뷰어창 왼쪽 + 곡 목록과 원터치 신호창 오른쪽)
  const currentPageInfo = SCORE_PAGES.find((p) => p.pageNumber === currentScorePage) || {
    pageNumber: currentScorePage,
    key: currentScorePage < 48 ? 'G' : currentScorePage < 74 ? 'C' : currentScorePage < 98 ? 'E' : 'INDEX',
    title: `${currentScorePage}쪽`,
    songs: [],
  };

  return (
    <div className="flex flex-col md:flex-row landscape:flex-row gap-3 h-[calc(100vh-130px)] min-h-[550px] w-full">
      {/* Left: High-Res Score PDF Viewer (Maximized) */}
      <div className="flex-1 h-full min-h-[420px] bg-neutral-900/95 border border-neutral-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <ScoreViewer
          currentPageNumber={currentScorePage}
          pageInfo={currentPageInfo}
          currentSongTitle={currentSong?.title}
          onPageChange={onPageChange}
        />
      </div>

      {/* Right Side: Real-Time Flow Signal, Page Songs & Quick Chat */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-2.5 shrink-0 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-neutral-700">
        {/* Section 1: Real-Time Flow Signal & Direct Confirmation */}
        <div className="bg-neutral-900/95 border-2 border-cyan-500/50 rounded-2xl p-3 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-cyan-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                <Radio className="w-3 h-3" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                실시간 <span className="text-cyan-400">진행 신호</span>
              </h3>
            </div>
            {activeCue ? (
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full animate-pulse">
                수신됨
              </span>
            ) : (
              <span className="text-[10px] text-neutral-500 font-bold bg-neutral-950 border border-neutral-800 px-2 py-0.5 rounded-full">
                대기 중
              </span>
            )}
          </div>

          {activeCue ? (
            <div className="space-y-2.5 pt-0.5">
              <div className="p-3 rounded-xl bg-neutral-950/90 border border-neutral-800 text-center space-y-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                  {activeCue.category}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {activeCue.title}
                </h4>
                {activeCue.subtitle && (
                  <p className="text-xs text-cyan-200 font-semibold truncate">
                    {activeCue.subtitle.replace(/,\s*(?:통합|새찬송가|새)?\s*\d+\s*장/gi, '')}
                  </p>
                )}
              </div>

              {/* Direct One-Touch Confirmation Button */}
              <button
                type="button"
                onClick={handleTouchAck}
                disabled={isAcked}
                className={`w-full py-3 px-4 rounded-xl font-black text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  isAcked
                    ? 'bg-emerald-600 border border-emerald-400 text-white'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 hover:brightness-110 active:scale-[0.98] animate-pulse ring-2 ring-amber-400/50'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isAcked ? '신호 확인 완료됨' : '확인 완료 (터치)'}</span>
              </button>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-neutral-400 space-y-1 bg-neutral-950/50 rounded-xl border border-neutral-800/80">
              <Radio className="w-5 h-5 text-neutral-600 mx-auto animate-pulse" />
              <p className="font-bold text-neutral-300">현재 대기 중인 신호가 없습니다</p>
              <p className="text-[11px] text-neutral-500">인도자가 진행 신호를 보내면 즉시 표시됩니다.</p>
            </div>
          )}
        </div>

        {/* Section 2: Songs on Current Score Sheet */}
        <div className="bg-neutral-900/95 border border-neutral-800 rounded-2xl p-3 space-y-2.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-amber-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                <BookOpen className="w-3 h-3" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                {currentScorePage}쪽 <span className="text-amber-400">수록곡 목록</span>
              </h3>
            </div>
            <span className="text-[10px] text-amber-300 font-bold bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {currentPageInfo.songs.length}곡 수록
            </span>
          </div>

          {currentPageInfo.songs.length === 0 ? (
            <div className="py-2 text-center text-xs text-neutral-400">
              이 페이지에 등록된 곡 정보가 없습니다.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {currentPageInfo.songs.map((song, sIdx) => {
                const isCurrent = currentSong?.title.trim() === song.title.trim();

                return (
                  <div
                    key={`band-song-${song.id || sIdx}`}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/60 border-emerald-500/70 ring-2 ring-emerald-500/40 shadow-emerald-950/50'
                        : 'bg-neutral-950/80 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500 text-neutral-950 shadow-sm">
                          #{song.bookNo}
                        </span>
                        <span className="text-[10px] font-mono font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                          {song.key}코드
                        </span>
                        <span className="text-xs font-black text-white truncate">
                          {song.title}
                        </span>
                        {song.hymnNo && (
                          <span className="text-[10px] text-neutral-400 truncate">
                            ({song.hymnNo})
                          </span>
                        )}
                      </div>

                      {isCurrent && (
                        <span className="text-[9px] font-black bg-emerald-500 text-neutral-950 px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5 shadow-sm">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 연주중
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Messaging & Full Chat Link */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>메시지 보내기</span>
            </span>
            <button
              type="button"
              onClick={onOpenChat}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              전체 대화창 열기 →
            </button>
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-1.5">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="인도자 및 팀원에게 메시지..."
              className="flex-1 bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold px-3 py-1.5 rounded-xl text-xs transition cursor-pointer"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
