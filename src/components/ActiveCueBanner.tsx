import React, { useState, useEffect, useMemo } from 'react';
import { CueSignal, Member, QuickReply } from '../types';
import { IconRenderer } from './IconRenderer';
import { ROLE_INFOS } from '../data/presets';
import { findPageForSong } from '../data/pdfCatalog';
import {
  Check,
  CheckCircle2,
  Clock,
  X,
  BookOpen,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

interface ActiveCueBannerProps {
  cue: CueSignal | null;
  myMemberId: string;
  myName?: string;
  isLeader: boolean;
  members: Member[];
  onAck: (cueId: string) => void;
  onQuickReply?: (cueId: string, type: QuickReply['type'], msg?: string) => void;
  onClear: () => void;
  onJumpToPage?: (page: number) => void;
  compact?: boolean;
}

const COLOR_THEMES = {
  amber: 'bg-amber-950/70 border-amber-500/60 text-amber-200 shadow-amber-500/10',
  emerald: 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200 shadow-emerald-500/10',
  blue: 'bg-blue-950/70 border-blue-500/60 text-blue-200 shadow-blue-500/10',
  rose: 'bg-rose-950/70 border-rose-500/60 text-rose-200 shadow-rose-500/10',
  purple: 'bg-purple-950/70 border-purple-500/60 text-purple-200 shadow-purple-500/10',
  cyan: 'bg-cyan-950/70 border-cyan-500/60 text-cyan-200 shadow-cyan-500/10',
  red: 'bg-red-950/80 border-red-500 text-red-100 shadow-red-500/20 ring-2 ring-red-500/30 animate-pulse',
  indigo: 'bg-indigo-950/70 border-indigo-500/60 text-indigo-200 shadow-indigo-500/10',
  orange: 'bg-orange-950/70 border-orange-500/60 text-orange-200 shadow-orange-500/10',
  neutral: 'bg-neutral-900/90 border-neutral-700 text-neutral-200 shadow-black/20',
};

const BADGE_COLORS = {
  amber: 'bg-amber-500 text-neutral-950',
  emerald: 'bg-emerald-500 text-neutral-950',
  blue: 'bg-blue-500 text-neutral-950',
  rose: 'bg-rose-500 text-white',
  purple: 'bg-purple-500 text-white',
  cyan: 'bg-cyan-500 text-neutral-950',
  red: 'bg-red-600 text-white font-black',
  indigo: 'bg-indigo-500 text-white',
  orange: 'bg-orange-500 text-neutral-950',
  neutral: 'bg-neutral-600 text-white',
};

export const ActiveCueBanner: React.FC<ActiveCueBannerProps> = ({
  cue,
  myMemberId,
  myName,
  isLeader,
  members,
  onAck,
  onClear,
  onJumpToPage,
}) => {
  const [localAcked, setLocalAcked] = useState(false);

  useEffect(() => {
    setLocalAcked(false);
  }, [cue?.id]);

  const resolvedTargetPage = useMemo(() => {
    if (cue?.targetPage) return cue.targetPage;
    if (!cue) return null;
    const cleanTitle = cue.title.replace(/\[곡 전환\]|\[다음 곡 예고\]/g, '').trim();
    if (cleanTitle) {
      const p = findPageForSong(cleanTitle, cue.targetKey);
      if (p) return p;
    }
    const matchPage = cue.subtitle?.match(/p\.(\d+)|악보\s*(\d+)쪽|악보\s*(\d+)번/);
    if (matchPage) {
      const num = parseInt(matchPage[1] || matchPage[2] || matchPage[3], 10);
      if (num >= 1 && num <= 101) return num;
    }
    return null;
  }, [cue]);

  // Sanitize subtitle: Remove hymn numbers (e.g. , 123장, (통합 123장), 새찬송가 etc.)
  const sanitizedSubtitle = useMemo(() => {
    if (!cue?.subtitle) return '';
    return cue.subtitle
      .replace(/,\s*(?:통합|새찬송가|새)?\s*\d+\s*장/gi, '')
      .replace(/\s*\((?:통합|새찬송가|새)?\s*\d+\s*장\)/gi, '')
      .replace(/,\s*\d+\s*장/gi, '')
      .trim();
  }, [cue?.subtitle]);

  if (!cue) {
    return (
      <div className="bg-neutral-900/60 border border-dashed border-neutral-800 rounded-xl px-3 py-1.5 sm:py-2 text-center flex items-center justify-between text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
            <Clock className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold text-neutral-300">신호 대기 중</span>
          <span className="text-[11px] text-neutral-500 hidden sm:inline">
            {isLeader
              ? '원터치 진행 신호 또는 곡 전환 신호를 전송하세요.'
              : '인도자의 다음 큐 신호를 기다리고 있습니다.'}
          </span>
        </div>
      </div>
    );
  }

  const themeClass = COLOR_THEMES[cue.color] || COLOR_THEMES.amber;
  const badgeColor = BADGE_COLORS[cue.color] || BADGE_COLORS.amber;
  const isAckedByMe =
    localAcked ||
    cue.acknowledgedBy.some(
      (a) =>
        (myMemberId && a.memberId === myMemberId) ||
        (myName && a.memberName === myName) ||
        (myMemberId && a.memberName === myMemberId)
    );

  const handleAck = () => {
    setLocalAcked(true);
    onAck(cue.id);
  };

  const secondsAgo = Math.max(0, Math.floor((Date.now() - cue.timestamp) / 1000));
  const timeText = secondsAgo < 60 ? `${secondsAgo}초 전` : `${Math.floor(secondsAgo / 60)}분 전`;

  const totalMembers = members.filter((m) => !m.isLeader).length;
  const ackCount = cue.acknowledgedBy.length;

  return (
    <div
      className={`relative rounded-xl border backdrop-blur-md transition-all shadow-lg ${themeClass} px-2.5 py-2 sm:px-4 sm:py-2.5`}
    >
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* Top Row: Icon, Category Badge, Song Title, Subtitle, and Time (Song title never clipped) */}
        <div className="flex items-start sm:items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
            {/* Icon */}
            <div className="p-1 sm:p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0 text-white shadow-sm">
              <IconRenderer name={cue.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {/* Category badge */}
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shrink-0 ${badgeColor}`}>
              {cue.category === 'SONG_FLOW'
                ? '곡 진행 신호'
                : cue.category === 'DYNAMICS'
                ? '다이내믹'
                : cue.category === 'PRAYER'
                ? '기도회 진행'
                : '진행 신호'}
            </span>

            {cue.urgency === 'URGENT' && (
              <span className="flex items-center gap-0.5 text-[10px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-full animate-bounce shrink-0">
                <AlertTriangle className="w-2.5 h-2.5" />
                긴급
              </span>
            )}

            {/* Song Title: Fully legible, bold, break-words, never hidden */}
            <span className="text-sm sm:text-base font-black text-white tracking-tight leading-snug break-words">
              {cue.title}
            </span>

            {/* Subtitle without hymn number */}
            {sanitizedSubtitle && (
              <span className="text-[11px] font-medium text-neutral-300 opacity-90 truncate hidden md:inline">
                • {sanitizedSubtitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-center sm:self-auto">
            <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5 text-neutral-500" />
              {timeText}
            </span>
            {/* Leader close button on top right */}
            {isLeader && (
              <button
                type="button"
                onClick={onClear}
                className="text-neutral-400 hover:text-white bg-black/40 hover:bg-black/60 p-1 rounded-lg border border-neutral-700/50 transition flex items-center gap-0.5 text-xs cursor-pointer ml-1"
                title="신호 내리기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Note if any */}
        {cue.note && (
          <div className="text-[11px] text-amber-200 bg-amber-950/60 border border-amber-500/30 rounded px-2 py-0.5 inline-block">
            💡 {cue.note}
          </div>
        )}

        {/* Bottom Row: Jump Button and Confirmation / Ack Status Button */}
        <div className="flex items-center gap-2 pt-0.5 sm:pt-1 border-t border-white/10">
          {!isLeader ? (
            /* Receiver: Bottom row with Jump Button on Left and Confirmation Button on Right */
            <div className="w-full flex items-center gap-2">
              {resolvedTargetPage && onJumpToPage ? (
                <>
                  <button
                    type="button"
                    onClick={() => onJumpToPage(resolvedTargetPage)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-neutral-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-neutral-950 shrink-0" />
                    <span className="whitespace-nowrap font-black">p.{resolvedTargetPage}쪽 악보 열기</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAck}
                    disabled={isAckedByMe}
                    className={`flex-1 py-2 px-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                      isAckedByMe
                        ? 'bg-emerald-600 text-white shadow-emerald-600/30 border border-emerald-400 cursor-default'
                        : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 active:scale-95 ring-2 ring-amber-300/60 animate-pulse'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap font-black">{isAckedByMe ? '확인 완료됨' : '확인 완료'}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleAck}
                  disabled={isAckedByMe}
                  className={`w-full py-2 px-3 rounded-xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                    isAckedByMe
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30 border border-emerald-400 cursor-default'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 active:scale-95 ring-2 ring-amber-300/60 animate-pulse'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-black">{isAckedByMe ? '진행 신호 확인 완료됨' : '확인 완료 (터치)'}</span>
                </button>
              )}
            </div>
          ) : (
            /* Leader: Bottom row with Jump Button and Team Ack Status */
            <div className="w-full flex items-center justify-between gap-2">
              {resolvedTargetPage && onJumpToPage ? (
                <button
                  type="button"
                  onClick={() => onJumpToPage(resolvedTargetPage)}
                  className="py-1.5 px-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-black text-xs flex items-center gap-1 shadow cursor-pointer active:scale-95 transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-950" />
                  <span>p.{resolvedTargetPage}쪽 악보 열기</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-xs text-neutral-300 font-medium">실시간 전송된 신호</span>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="font-bold text-neutral-300">
                    수신 {ackCount}/{totalMembers > 0 ? totalMembers : ackCount}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1 max-w-[200px] overflow-hidden">
                  {cue.acknowledgedBy.slice(0, 3).map((ack) => {
                    const role = ROLE_INFOS[ack.memberRole];
                    return (
                      <span
                        key={ack.memberId}
                        className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-medium"
                      >
                        {role?.label || ack.memberRole}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
